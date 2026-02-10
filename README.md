# 🎓 School Management Backend API

A full-featured School Management System Backend built with Node.js, TypeScript, Prisma, PostgreSQL, and Docker.
This backend powers a modern school CRM including students, teachers, classes, subjects, attendance, journals, grades, and analytics.

# 🚀 Tech Stack

Node.js (v22)
TypeScript
Express.js
Prisma ORM
PostgreSQL
Docker
Zod (validation)
JWT Authentication
Cloudinary (file uploads)

✨ Features
👤 Users & Roles

Admin / Staff
Teacher
Student

# 🏫 Core School Modules

Classes
Subjects
Students
Teachers
Journals
Schedule (weekly timetable)

# 📒 Academic Management
Journals (per class & subject)
Journal Entries (attendance + grade)
Grades & grading types

# ✅ Attendance System
Daily attendance per schedule
Bulk attendance create/update
Attendance analytics:
Attendance % per student
Class attendance performance
Subject attendance stats

📊 Analytics APIs
Student average score
Subject average score
Class average score
Attendance percentage (date range supported)

# 🔐 Environment Variables

Create a .env file in the root:
DATABASE_URL=postgresql://user:password@localhost:5432/school_db
JWT_SECRET=your_jwt_secret
PORT=3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

🧱 Database Setup
npx prisma migrate dev
npx prisma generate

▶️ Run Locally (without Docker)
npm install
npm run build
npm start

Server runs on:

http://localhost:3000

# 🐳 Run with Docker
Build image
docker build -t school-backend .

Run container
docker run --env-file .env -p 3000:3000 school-backend

# 🧪 API Validation

All query & body validation is handled using Zod
via validateMiddleware.

# 📈 Performance Optimizations
Indexed foreign keys
Minimal include usage
Aggregations done in memory only when necessary
Date filtering via indexed fields

# 🔮 Future Improvements
Redis caching
Swagger API documentation
WebSocket real-time attendance

# 👨‍💻 Author
Dilshod
Backend / Full-Stack Developer
Node.js • TypeScript • Prisma
Open to collaboration & opportunities

⭐️ Support
If you find this project useful, don’t forget to ⭐️ the repository!
