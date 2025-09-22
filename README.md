# 🎤 Ticket System

โปรเจคตัวอย่างระบบ **Ticket System** (ระบบจัดการ Ticket)
**Frontend (Next.js + TailwindCSS)** และ **Backend (Node.js + Express + PostgreSQL + Redis)**

---

## 🚀 วิธีติดตั้งและรัน

### 🔹 Clone โปรเจค

```bash
git clone https://github.com/fearwmt/Ticket-System.git
```

---

### 🔹 รันด้วย Docker

1. ติดตั้ง [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. เปิด terminal แล้วรัน:

   ```bash
   docker run -d -p 6379:6379 redis
   ```

#### 📌 Backend

```bash
cd backend
npm install
npm run start:dev
```

#### 📌 Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## ⚙️ Services ที่ใช้

* **Frontend** → Next.js 13 + TailwindCSS
* **Backend** → Node.js (Express)
* **Database** → PostgreSQL
* **Cache** → Redis
* **Dev Tools** → Docker Compose

---


