FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose port (Cloud Run sets PORT=8080 by default)
ENV PORT=8080
EXPOSE $PORT

# Run uvicorn server
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
