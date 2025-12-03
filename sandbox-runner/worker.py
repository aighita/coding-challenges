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

# Parse DATABASE_URL for psycopg2
# Assuming format: postgresql://user:password@host:port/dbname
# A simple parser or just passing the string might work if libpq supports it.
# psycopg2.connect(DATABASE_URL) usually works.

def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Error connecting to DB: {e}")
        return None

def execute_code(code, tests):
    # This is a naive implementation.
    # It writes code to a file and runs it.
    # It checks output against tests.
    
    # Security Warning: This executes arbitrary code on the container!
    # User is aware and requested subprocesses for now.
    
    filename = f"temp_{int(time.time())}.py"
    with open(filename, "w") as f:
        f.write(code)
    
    verdict = "PASSED"
    logs = []
    
    try:
        # For now, we assume the code is a script that prints output.
        # Or maybe it defines a function?
        # Let's assume the user code reads from stdin and prints to stdout,
        # or the 'tests' define how to run it.
        
        # Simplified: Just run the code and see if it runs without error for now.
        # If tests exist, we need a way to inject input.
        
        for test in tests:
            input_data = test.get('input', '')
            expected_output = test.get('output', '').strip()
            
            result = subprocess.run(
                ['python3', filename],
                input=input_data.encode(),
                capture_output=True,
                timeout=5 # 5 seconds timeout

    try:
        for i, test in enumerate(tests):
            input_data = test['input']
            expected_output = test['output'].strip()

            try:
                if language == 'python':
                    result = subprocess.run(['python3', filename], input=input_data.encode(), capture_output=True, timeout=5)
                elif language == 'cpp':
                    result = subprocess.run([f'./{executable_name}'], input=input_data.encode(), capture_output=True, timeout=5)
                
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
        if language == 'cpp' and os.path.exists(executable_name):
            os.remove(executable_name)
            
    return verdict, "\n".join(logs) if logs else "All test cases passed."

def callback(ch, method, properties, body):
    print(" [x] Received job")
    data = json.loads(body)
    submission_id = data['submissionId']
    code = data['code']
            'UPDATE "Submission" SET status = %s, verdict = %s, output = %s, "updatedAt" = NOW() WHERE id = %s',
            ('COMPLETED', verdict, output, submission_id)
        )
        conn.commit()
        cur.close()
        conn.close()
    
    print(f" [x] Done {submission_id}: {verdict}")
    ch.basic_ack(delivery_tag=method.delivery_tag)

def main():
    # Wait for RabbitMQ
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
    
    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='submissions', on_message_callback=callback)
    channel.start_consuming()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
