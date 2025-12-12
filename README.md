# Love PDF

A clone of ilovepdf.com built with Next.js and Python FastAPI.

## Features

- **Merge PDF**: Combine multiple PDFs into one.
- **Split PDF**: Split a PDF into individual pages (zipped).

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Lucide Icons
- **Backend**: FastAPI, pypdf
- **Deployment**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose installed.

### Running with Docker

1. Build and start the services:
   ```bash
   docker-compose up --build
   ```

2. Open [http://localhost:3000](http://localhost:3000) for the frontend.
3. The backend API is running at [http://localhost:8000](http://localhost:8000).

### Local Development

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
