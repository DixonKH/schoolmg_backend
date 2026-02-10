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

