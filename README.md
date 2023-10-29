<p align="center">
  <br>
  <img width="800" src="https://github.com/ab-elhaddad/Fancy-ToDo/assets/113056556/bfeb7458-2791-418d-bdad-c9b238885ac6">
  <br>
  <br>
</p>

# Fancy To Do App

## A To Do backend server with fancy Features! ✨

## 🔍 Description

This is a To Do app backend server built with Node.js and Express.js. It uses PostgreSQL as a database and Prisma as an ORM. It also uses JWT for authentication and authorization. It has a lot of fancy features like weather forecast, email notifications, and more!

## 💡 Used Tools & Technologies

- **Node.js** (Runtime Environment)
- **Express.js** (Web Application Framework)
- **PostgreSQL** (Database)
- **Prisma** (ORM)
- **TypeScript** (Programming Language)
- **ejs** (Templating Engine)
- **jwt** (Authentication)
- **bcrypt** (Password Hashing)
- **joi** (Data Validation)
- **jest** (Testing Framework)
- **supertest** (HTTP Testing)
- **nodemailer** (Email Service)
- **prettier** (Code Formatter)
- **editorconfig** (Code Formatter)
- **eslint** (Code Linter)
- **GitHub Actions** (CI/CD)
- **OpenWeatherMap API** (Weather API)
- **Multer** (File Upload)
- **Azure Blob Storage** (File Storage)

## 🔧 Pre-requisites

- `Node.js` installed on your machine.
- A `PostgreSQL` database server running whether locally or remotely.
- An `email account` to send emails from.
- A `.env` file containing these environment variables.

```js
DATABASE_URL // PostgreSQL database url

SALT_ROUNDS // Number of rounds to hash the password
JWT_SECRET_KEY // Secret key (string) to sign the jwt token

GMAIL_USER // Email address to send emails from
GMAIL_PASS // Password of the email address
```

## 📦 Installation

- Clone the repository

```bash
git clone https://github.com/ab-elhaddad/Fancy-ToDo.git
```

- Install dependencies

```bash
npm install
```

- Generate Prisma Client

```bash
npx prisma generate
```

- Run the server

```bash
npm start
```
