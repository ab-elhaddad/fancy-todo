# Fancy To Do App

## A To Do backend server with fancy Features! ✨

## 🔍 Description

A To Do backend server which enables the user to add tasks and mark them as done when completed. The user can also add tags to the tasks and filter them based on the tags. The user can also sort the tasks based on the due date and the priority of the task. The user can also search for a particular task based on the title of the task. the user can also split the tasks into subtasks and mark them as done when completed.

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
