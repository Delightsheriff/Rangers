# Project Overview

Team Rangers participated in ADC Hackathon 2025 and this concept is to create an app where users can log shared expenses (e.g., for roommates, trips, or group outings), and it calculates who owes what amount.

## SplitWise

---

## About ✍️

## An app where users can log shared expenses (e.g., for roommates, trips, or group outings), and it calculates who owes what amount.

## Features 🌠

Here’s what makes Educare stand out:

### Frontend Features

- 📖 **User Authentication**:
  Users are able to create account and login to their account to create expense data

- 🏆 **Create a Group**:
  Users are able to create a group and invite friends so we can split expenses together.

- 🌐 **Add an Expense**:
  As a user, you are able to add an expense with details like amount, payer, and participants so we can track costs.

- 🤖 **View Split Costs**:
  Use cutting-edge AI technology to get instant solutions and insights into complex concepts.

### Backend Features

- 🚀 **RESTful API**:
  The backend provides a RESTful API to handle user authentication, group creation, create expenses, and balances.

- 🔒 **Authentication & Authorization**:
  Secure user authentication and authorization using JWT (JSON Web Tokens) and Passport.js.

---

## Setup 🛠️

### Frontend Setup

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open your browser and visit:

   ```bash
   http://localhost:3000
   ```

### Backend Setup

1. Navigate to the `api` directory:

   ```bash
   cd api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the backend server:

   ```bash
   npm run start
   ```

4. The backend API will be available at:

   ```bash
   http://localhost:3000
   ```

---

## Environment Variables 🔑

To run the project, you need to set up environment variables. Create a `.env` file in the `api` directory with the following variables:

```env
# Backend .env file
PORT=3000

```

---

## Technologies Used 🛠️

### Frontend

- **Next.js with Typescript**: For building the user interface.
- **Tailwind CSS**: For styling the components.
- **Next-auth**: For making API calls for authentication and authorisation.

### Backend

- **NestJS**: For the server-side runtime.
- **JWT**: For user authentication and authorization.
- **Passport.js**: For handling authentication.
- **Swagger-ui-express**: Serves the Swagger API documentation through an Express route.

---
