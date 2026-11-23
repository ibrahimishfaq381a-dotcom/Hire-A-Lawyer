# Hire A Lawyer

A MERN stack web platform that connects clients with lawyers. Final Year Project (FYP), BS Computer Science.

## Features

- Client and lawyer registration and login
- Browse lawyers by category (Family, Criminal, Civil, Divorce, Tax Filing, Trademark and more)
- Lawyer profiles with reviews and ratings
- Real-time chat between client and lawyer (Socket.io)
- AI support chatbot
- Case studies and case submission form
- Contact form with email notifications
- Image uploads via Cloudinary

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Real-time:** Socket.io
- **Other:** Cloudinary, Nodemailer, JWT authentication

## Project Structure

```
Hire A Lawyer
├── client/    # React frontend
└── Server/    # Node.js + Express backend
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB running locally (or a MongoDB Atlas connection string)

### 1. Clone the repository

```bash
git clone https://github.com/ibrahimishfaq381a-dotcom/Hire-A-Lawyer.git
cd Hire-A-Lawyer
```

### 2. Setup the backend

```bash
cd Server
npm install
```

Create a file named `.env` inside the `Server` folder with these variables (use your own values):

```
MONGODB_STRING=
DB_NAME=
PORT=5000
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
EMAIL=
PASSWORD=
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Start the server:

```bash
npm start
```

### 3. Setup the frontend

Open a new terminal:

```bash
cd client
npm install
npm start
```

The app runs at `http://localhost:3000` and the API at `http://localhost:5000`.

## Team

- Ibrahim

## Note

The `.env` file is not included in this repository for security reasons.