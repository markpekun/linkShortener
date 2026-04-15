# 🚀 Short Linker

<p align="center">
  <b>Minimal, production-ready URL shortener.</b>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/backend-FastAPI-009688?style=for-the-badge&logo=fastapi"></a>
  <a href="#"><img src="https://img.shields.io/badge/frontend-React-61DAFB?style=for-the-badge&logo=react"></a>
  <a href="#"><img src="https://img.shields.io/badge/database-PostgreSQL-336791?style=for-the-badge&logo=postgresql"></a>
  <a href="#"><img src="https://img.shields.io/badge/typescript-TS-3178C6?style=for-the-badge&logo=typescript"></a>
  <a href="#"><img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge"></a>
</p>




    

## 🎥 Demo (Back OFF)
<p align="center">
  <a href="https://link-shine.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge">
  </a>
</p>

<p align="center">
  <img src="pictures/gif.gif" width="600"/>
</p>




## ⚡ Features

- ⚡ Fully async backend (FastAPI + SQLAlchemy)
- 🔗 Configurable redirects (`302` / `307`)
- 📊 Optional click tracking
- 🎨 Minimal UI (React + Tailwind)
- 🚀 Ready for production scaling


## 🛠 Tech Stack

### Backend
- FastAPI  
- SQLAlchemy (async)  
- PostgreSQL  
- Alembic  
- Pydantic  

### Frontend
- React  
- Vite  
- TypeScript  
- TailwindCSS  


## 📁 Project Structure

```bash
.
├── alembic/
├── frontend/
├── src/
│   ├── api/
│   ├── core/
│   ├── models/
│   ├── repository/
│   ├── schemas/
│   ├── services/
│   └── utils/
├── .env.example
├── alembic.ini
├── main.py
└── requirements.txt
```

## ⚡ Quick Start

### 1. Backend

```bash
cp .env.example .env
pip install -r requirements.txt
alembic upgrade head
uvicorn src.main:app --host 0.0.0.0 --port 8000
```
### 🔗 Local Endpoints

<p>
  <a href="http://127.0.0.1:8000">
    <img src="https://img.shields.io/badge/API-127.0.0.1:8000-00ADB5?style=flat-square">
  </a>
  <a href="http://127.0.0.1:8000/docs">
    <img src="https://img.shields.io/badge/Docs-Swagger-85EA2D?style=flat-square">
  </a>

</p>

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```


##  🔌 API

### Create Short Link

```http request
POST /shorten
```

```json
{
  "original_url": "https://example.com"
}
```

## Response
```json
{
  "short_code": "AbXyQz",
  "short_url": "http://127.0.0.1:8000/AbXyQz",
  "original_url": "https://example.com",
  "created_at": "2026-04-15T12:00:00Z"
}
```

## Redirect
```http request
GET /{code}
```

