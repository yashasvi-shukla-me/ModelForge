FROM python:3.12-slim

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY pyproject.toml requirements.txt ./
COPY src/ src/
COPY models/ models/

ENV MODEL_PATH=models/baseline/model.pkl

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install your package (this is the key fix)
RUN pip install --no-cache-dir .

EXPOSE 8000

CMD ["uvicorn", "serving.app:app", "--host", "0.0.0.0", "--port", "8000"]
