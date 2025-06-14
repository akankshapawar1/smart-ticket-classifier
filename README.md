# Smart Ticket Classifier

A full-stack application that uses ChatGPT-4.1 Nano to intelligently classify support tickets based on their content. 
Built with NestJS for the backend and React for the frontend, the app is designed to streamline customer support by automatically tagging and routing tickets based on semantic understanding.

---

## Purpose

This project demonstrates how to use OpenAI’s ChatGPT-4.1 Nano model to build an AI-assisted ticket classification system. It helps support teams reduce manual triaging effort and ensures faster ticket resolution by automatically assigning categories.

---

## Tech Stack

- **Frontend:** React (TypeScript)
- **Backend:** NestJS (TypeScript)
- **Model:** ChatGPT-4.1 Nano

---

## Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/smart-ticket-classifier.git
cd smart-ticket-classifier
```

### 2. Set Up the Backend

```bash
cd server
npm install
```
Create a .env file inside the server directory with the following content:

```bash
PORT=3001
OPENAI_API_KEY=your_openai_key_here
```

Then build and start the backend server:

```bash
npm run build
npm run start:dev
```

### 3. Set Up the Frontend

```bash
cd client
npm install
npm start
```

This will run the frontend on http://localhost:3000.

## Features

- Text-based support ticket classification
- Uses ChatGPT 4.1 Nano for semantic understanding

## Future Work

- Deploy on cloud
- Save ticket history in a database
- Add user authentication
