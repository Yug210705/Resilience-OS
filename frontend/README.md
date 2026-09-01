# Resilience OS Frontend

This is the Chapter 3 React frontend for Resilience OS. It visualizes the supply chain network, simulates disruptions, and displays recovery options using data directly from the FastAPI backend.

## Prerequisites
- Node.js (v20+)
- Running Resilience OS Backend (FastAPI + PostgreSQL)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Ensure `VITE_API_BASE_URL` points to your backend (default: `http://localhost:8000/api/v1`).

## Running
Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Testing
To verify TypeScript compilation:
```bash
npm run build
```

*(Note: End-to-end integration is verified via the Command Center UI and backend smoke tests.)*
