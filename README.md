# Sahayogi - AI-Driven Financial Assistant

Sahayogi is a friendly, AI-driven financial assistant designed to help gig workers, students, and professionals make smarter financial decisions. It proactively analyzes income, spending, and goals to offer personalized, actionable advice.

## Features

- **Smart Dashboard**: Visualizes cash flow and implements the 33-33-33 budgeting rule.
- **Transaction Management**: Track income and expenses with manual entry or simulated bank connection.
- **AI Financial Assistant**: Get personalized financial tips and chat with an AI advisor (powered by Gemini/OpenAI).
- **Onboarding**: tailored financial plans based on user profile and income type.
- **Insights**: Early warnings for overspending and upcoming bill detection.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **AI**: Gemini/OpenAI API

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your MongoDB URI and AI API Key.
4. Start the server:
   ```bash
   npm run dev
   ```

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
   npm run dev
   ```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```
