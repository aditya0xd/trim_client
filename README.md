# Trim - URL Shortener with Analytics

Trim is a modern, high-performance URL shortener built with a sleek, dark SaaS aesthetic inspired by Linear and Vercel. It allows users to quickly shorten long URLs, assign custom aliases, and track detailed click analytics.

## Features

- **Link Shortening**: Convert long URLs into easily shareable short links.
- **Custom Aliases**: Personalize your short links (e.g., `trim.so/my-campaign`).
- **Comprehensive Analytics**:
  - Track total link clicks.
  - View time-series data of clicks over time.
  - Analyze referrer sources (e.g., direct, social media).
- **Modern SaaS UI**: Dark-mode first design using Tailwind CSS, featuring subtle borders, vibrant accents, and smooth hover interactions.
- **Dockerized Backend**: Ready for production deployment using Docker Compose.

## Tech Stack

**Frontend**:
- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- Lucide React (Icons)
- Recharts (Data Visualization)
- React Router DOM

**Backend**:
- Node.js & Express
- TypeScript
- MongoDB (Mongoose)
- Docker & Docker Compose

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI.

### 1. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/trim
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Running via Docker

You can easily spin up the backend and database using Docker.

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Build and start the containers in detached mode:
   ```bash
   docker compose up -d --build
   ```
This will start both the Express API and a MongoDB instance automatically. The API will be available at `http://localhost:5000`.

## Architecture Overview

- **Modular Hooks**: The frontend logic is decoupled from the UI using custom hooks (`useLinks`, `useAnalytics`) located in `src/hooks/`.
- **Stateless Components**: The UI leverages reusable components (`MetricCard`, `LinksTable`, `ClicksChart`) found in `src/components/`.
- **RESTful API**: The backend exposes standard REST endpoints for link creation, redirection, and fetching aggregated analytics data.
