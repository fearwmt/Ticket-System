# 🎤 Ticket System

โปรเจคตัวอย่างระบบ **Ticket System** (ระบบจัดการ Ticket)
**Frontend (Next.js + TailwindCSS)** และ **Backend (Node.js + Express + PostgreSQL + Redis)**

---

## 🚀 วิธีติดตั้งและรัน

### 🔹 1. Clone โปรเจค

```bash
git clone https://github.com/fearwmt/Ticket-System.git
```

---

### 🔹 2. วิธีที่แนะนำ: รันด้วย Docker

1. ติดตั้ง [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. เปิด terminal แล้วรัน:

   ```bash
   docker-compose up -d
   ```
3. เมื่อเสร็จแล้วสามารถเข้าใช้งานได้:

   * **Frontend (Web)** → [http://localhost:3000](http://localhost:3000)
   * **Backend API** → [http://localhost:4000](http://localhost:4000)
   * **PostgreSQL DB** → localhost:5432
   * **Redis** → localhost:6379

---

### 🔹 3. วิธี Manual (กรณีไม่ใช้ Docker)

#### 📌 Backend

```bash
cd backend
npm install
# แก้ไฟล์ .env (ใช้ค่าใน .env.example)
npm run dev
```

👉 เปิดที่ [http://localhost:4000](http://localhost:4000)

#### 📌 Frontend

```bash
cd frontend
npm install
# แก้ไฟล์ .env.local (API_URL=http://localhost:4000)
npm run dev
```

👉 เปิดที่ [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Services ที่ใช้

* **Frontend** → Next.js 13 + TailwindCSS
* **Backend** → Node.js (Express)
* **Database** → PostgreSQL
* **Cache** → Redis
* **Dev Tools** → Docker Compose

---

## 📝 Notes

* รีสตาร์ท Container:

  ```bash
  docker-compose down -v
  docker-compose up -d
  ```
* ถ้า Port ซ้ำ → แก้ไข `docker-compose.yml` แล้วเปลี่ยนเลข port
* สามารถเลือกได้ 2 วิธี:

  * ใช้ `docker-compose` (ง่ายสุด)
  * หรือรันแยก frontend/backend ด้วย `npm run dev`

---
