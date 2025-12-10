import os
import json
import pika
import psycopg2
import subprocess
import time
import sys
from dotenv import load_dotenv

load_dotenv()

RABBITMQ_URL = os.getenv('RABBITMQ_URL', 'amqp://user:password@broker:5672')
DATABASE_URL = os.getenv('DATABASE_URL')

def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Error connecting to DB: {e}")
        return None

def execute_code(code, tests, language='python'):
    filename = f"temp_{int(time.time())}.py"
    executable_name = "solution"
    
    import re
    # Extract function name from code
    # Matches "def function_name("
    match = re.search(r"def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(", code)
    func_name = match.group(1) if match else None

    with open(filename, "w") as f:
        f.write(code)
        if func_name and language == 'python':
            # Append driver code to read input, execute it to get args, call function, and print repr of result
            driver = f"""
import sys
if __name__ == "__main__":
    try:
        input_data = sys.stdin.read().strip()
        if input_data:
            scope = {{}}
            exec(input_data, {{}}, scope)
            # Call the function with arguments from the input definition
            # We filter out builtins and ensure we only pass arguments defined in input
            # Actually, simplest way is to pass **scope as kwargs if the function signature allows,
            # or matches common expected variables.
            # Given the seed data examples (n=..., s=..., nums=...), these are valid variable names.
            result = {func_name}(**scope)
            print(repr(result))
    except Exception as e:
        print(f"Driver Error: {{e}}")
        exit(1)
"""
            f.write(driver)
    
    verdict = "PASSED"
    logs = []
    
    try:
        for i, test in enumerate(tests):
            input_data = test.get('input', '')
            expected_output = test.get('output', '').strip()

            try:
                if language == 'python':
                    result = subprocess.run(['python3', filename], input=input_data.encode(), capture_output=True, timeout=5)
                elif language == 'cpp':
                    # Simplified: ignoring compilation for now, just assuming it won't be hit or fails gracefully
                    result = subprocess.run([f'./{executable_name}'], input=input_data.encode(), capture_output=True, timeout=5)
                else:
                    result = subprocess.CompletedProcess(args=[], returncode=1, stderr=b"Unsupported language")

                if result.returncode != 0:
                    verdict = "RUNTIME_ERROR"
                    logs.append(f"Test case {i+1} failed with runtime error: {result.stderr.decode()}")
                    break
                
                actual_output = result.stdout.decode().strip()
                if actual_output != expected_output:
                    verdict = "WRONG_ANSWER"
                    logs.append(f"Test case {i+1} failed. Input: '{input_data}', Expected: '{expected_output}', Got: '{actual_output}'")
                    break
            except subprocess.TimeoutExpired:
                verdict = "TIME_LIMIT_EXCEEDED"
                logs.append(f"Test case {i+1} timed out.")
                break
            except Exception as e:
                verdict = "SYSTEM_ERROR"
                logs.append(f"An unexpected error occurred during test case {i+1}: {str(e)}")
                break
    finally:
        if os.path.exists(filename):
            os.remove(filename)
            
    return verdict, "\n".join(logs) if logs else "All test cases passed."

def callback(ch, method, properties, body):
    print(" [x] Received job")
    data = json.loads(body)
    submission_id = data.get('submissionId')
    code = data.get('code')
    tests = data.get('tests', [])
    language = data.get('language', 'python')

    # Basic validation
    if not submission_id or not code:
        print("Invalid job data")
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    print(f"Processing submission {submission_id}")
    verdict, output = execute_code(code, tests, language)

    # Update DB
    conn = get_db_connection()
    if conn:
        try:
            cur = conn.cursor()
            cur.execute(
                'UPDATE "Submission" SET status = %s, verdict = %s, output = %s, "updatedAt" = NOW() WHERE id = %s',
                ('COMPLETED', verdict, output, submission_id)
            )
            conn.commit()
            cur.close()
            conn.close()
        except Exception as e:
            print(f"Error updating DB: {e}")
    else:
        print("Could not connect to DB to update status")
    
    print(f" [x] Done {submission_id}: {verdict}")
    ch.basic_ack(delivery_tag=method.delivery_tag)

def main():
    while True:
        try:
            print("Connecting to RabbitMQ...")
            params = pika.URLParameters(RABBITMQ_URL)
            connection = None
            while connection is None:
                try:
                    connection = pika.BlockingConnection(params)
                except pika.exceptions.AMQPConnectionError:
                     print("Waiting for RabbitMQ...")
                     time.sleep(5)
            
            channel = connection.channel()
            channel.queue_declare(queue='submissions', durable=True)
            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(queue='submissions', on_message_callback=callback)

            print(' [*] Waiting for messages. To exit press CTRL+C')
            try:
                channel.start_consuming()
            except KeyboardInterrupt:
                channel.stop_consuming()
                connection.close()
                break
            except Exception as e:
                print(f"Connection lost: {e}")
                # Connection loop will retry
        except Exception as e:
             print(f"Main loop error: {e}")
             time.sleep(5)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        pass
