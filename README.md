
# Networq - Professional Social Media Platform

Networq is a full-stack social networking application built for seamless professional and personal interaction. It features a robust connection management system, real-time engagement tools, and a centralized state management architecture.


## 🔗 Links
https://networq-olive.vercel.app/


## Features

- Secure Authentication: User signup and login with protected routes.
- Connection System: Send and accept connection requests to build  your professional network.

- Content Creation: Create, delete (author-only), and manage posts.

- Social Engagement: Interactive Like, Comment, and Share functionality on user posts.

- Profile Management: View detailed user profiles with a specialized "Download Profile" feature (PDF/Export).

- State Management: Centralized data flow using Redux to ensure UI consistency across the app.


## Tech Stacks


- Frontend - "Next.js, React.js, Tailwind CSS"
- State Management - Redux (Toolkit)
- Backend - "Node.js, Express.js"
- Database  - MongoDB (Mongoose)
- Authentication - bcrypt
## Colne the Reposatory

```bash
git clone https://github.com/derek-aman/socialmedia.git
cd socialmedia
```
## Installation

Install my-project with npm

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```
    
## Environment Variables

Create a .env file in the root of your backend folder
```bash
MONGO_URI=your_mongodb_uri
```
## Run the Application

```bash
# Run Backend (from /backend folder)
npm run dev

# Run Frontend (from /frontend folder)
npm run dev
```

## Data Model

<img width="1020" height="1230" alt="diagram-export-3-26-2026-11_24_35-PM" src="https://github.com/user-attachments/assets/53274461-1dd6-4f93-bbda-04ebb33e0506" />

## API Flow

<img width="1020" height="1230" alt="diagram-export-3-26-2026-11_24_35-PM" src="https://github.com/user-attachments/assets/c7d88718-f771-4a9d-ad49-0f972c09ebc7" />
