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

## 📝 Features

### 1. User Authentication

- 1.1. Registration
- 1.2. Login
- 1.3. Logout
- 1.4. Forgot Password (Send a password reset link to the user's email address)
- 1.5. Update Account
- 1.6. Reset Password
- 1.7. Delete Account
- 1.8. Email Confirmation (Send a confirmation email to the user's email address)

### 2. Task Management

- 2.1. Create Task
- 2.2. Create Recurring Task (Daily, Weekly, Monthly), Specify:
  - the date to stop repeating tasks
  - the day of the week if the task is weekly
  - the day of the month if the task is monthly
- 2.3. Update Task
- 2.4. Delete Task
- 2.5. Update Task Completion Status (Done, Undone)
- 2.6. Set Priority (High, Medium, Low)
- 2.7. Set Due Date
- 2.8. Attatch File to Task
- 2.9. Add Task to My Day (Make it due today)
- 2.10. Write Description
- 2.11. Display All Tasks
- 2.12. Display Tasks by Search
- 2.13. Display Tasks Due Today
- 2.14. Display Done Tasks
- 2.15. Display Undone Tasks
- 2.16. Sort Tasks by Priority
- 2.17. Sort Tasks by Due Date
- 2.18. Sort Tasks by Creation Date
- 2.19. Tasks Pagination (Limit, Page)

<br>

- 2.19. Add Subtasks to Task
- 2.20. Delete Subtask
- 2.21. Update Subtask Completion Status (Done, Undone)
- 2.22. Update Subtask

<br>

- 2.23. Create List to Group Tasks
- 2.24. Add Task to List
- 2.25. Remove Task from List
- 2.26. Update List
- 2.27. Delete List
- 2.28. Display Lists
- 2.29. Display Tasks by List
- 2.30. Share List With Public Link

### 3. Insights

- 3.1. Display Some Statistics About The User's Tasks
  - 3.1.1 Number of Total Tasks
  - 3.1.2. Number of Done Tasks
  - 3.1.3. Number of Undone Tasks
  - 3.1.4. Number of Overdue Tasks
  - 3.1.5. Number of Tasks by Priority (High, Medium, Low)
  - 3.1.6. Lists Title and Number of Tasks in Each List

- 3.2. Display some information about the weather
  - 3.2.1. Current Temperature
  - 3.2.2. Weather Main Title
  - 3.2.3. Weather Description
  - 3.2.4. Humidity

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

## 🐘 Database Schema

<p align="center">
	<img src="./assets/UML.jpeg" alt="Database Schema" width="1000"/>
</p>

## 🧐 Testing

#### Unit, Integration, and Functional Tests.<br> With more than 90% code coverage and 130+ tests 🎉

<p align="center">
	<img src="./assets/Code Coverage.png" alt="Code Coverage" width="1000"/>
</p>

## 🔧 Pre-requisites

- `Node.js` installed on your machine.
- A `PostgreSQL` database server running whether locally or remotely.
- An `email account` to send emails from.
- An `Azure Blob Storage` account to store files.
- An `OpenWeatherMap API` key to get weather information.
- A `.env` file containing these environment variables.

```js
DATABASE_URL // PostgreSQL database url

SALT_ROUNDS // Number of rounds to hash the password
JWT_SECRET_KEY // Secret key (string) to sign the jwt token

GMAIL_USER // Email address to send emails from
GMAIL_PASS // Password of the email address

WEATHER_API_KEY // OpenWeatherMap API key

STORAGE_ACCOUNT_NAME // Azure Blob Storage account name
STORAGE_CONTAINER_NAME // Azure Blob Storage container name
ACCOUNT_CONNECTION_STRING // Azure Blob Storage connection string
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
