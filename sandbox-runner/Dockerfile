FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install dependencies for psycopg2
RUN apt-get update && apt-get install -y libpq-dev gcc g++ && rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["python", "-u", "worker.py"]
