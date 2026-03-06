FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*


COPY pyproject.toml requirements-serve.txt ./
COPY src/ src/
COPY models/ models/

ENV MODEL_PATH=models/baseline/model.pkl

RUN pip install --no-cache-dir -r requirements-serve.txt
RUN pip install --no-cache-dir .

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1


CMD ["gunicorn", "src.serving.app:app", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "--workers", "1", "--timeout", "120"]
