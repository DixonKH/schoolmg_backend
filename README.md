# 🎓 School Management Backend API

> A full-featured **School Management System Backend** built with  
> **Node.js, TypeScript, Prisma, PostgreSQL, and Docker**

---

## 🚀 Tech Stack

- ⚙️ **Node.js** (v22)
- 🟦 **TypeScript**
- 🚂 **Express.js**
- 🧬 **Prisma ORM**
- 🐘 **PostgreSQL**
- 🐳 **Docker**
- ✅ **Zod Validation**
- 🔐 **JWT Authentication**
- ☁️ **Cloudinary**

---

## ✨ Features

### 👤 User & Roles
- Admin / Staff
- Teacher
- Student

### 🏫 School Core
- Classes
- Subjects
- Students
- Teachers
- Weekly Schedule

### 📒 Academic System
- Journals (Class + Subject)
- Journal Entries
- Attendance & Grades

### 📊 Analytics
- Student attendance %
- Class attendance performance
- Subject average score
- Student / Class / Subject statistics

---

## 📁 Project Structure

```bash
src/
├── app.ts
├── server.ts
├── routes.ts
├── middlewares/
├── models/
│   ├── auth/
│   ├── students/
│   ├── teachers/
│   ├── classes/
│   ├── subjects/
│   ├── attendance/
│   ├── journals/
│   └── analytics/
├── prisma/
│   └── schema.prisma
└── utils/
```
## 🔐 Environment Variables

- DATABASE_URL=postgresql://user:password@localhost:5432/school_db
- JWT_SECRET=your_secret_key
- PORT=3000

- CLOUDINARY_CLOUD_NAME=xxxx
- CLOUDINARY_API_KEY=xxxx
- CLOUDINARY_API_SECRET=xxxx

## Database setup

- npx prisma migrate dev
- npx prisma generate

## Run locally

- npm install
- npm run build
- npm start

## 📈 Performance Notes

- Indexed foreign keys
- Minimal include usage
- Date range filters
- Optimized Prisma queries

## Future Plans

- Swagger API docs
- Redis caching
- WebSocket attendance

## 👨‍💻 Author
- Dilshod
- Backend / Full-Stack Developer
- Node.js • TypeScript • Prisma

### ⭐️ Support
If you like this project, don’t forget to ⭐️ the repository!

