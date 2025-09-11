# Full Stack Application - F1

This project consists of a Python backend and a TypeScript/HTML frontend, each located in their respective folders.

## Running the Application

Use Docker Compose to build and run the application:

```
docker compose up --build
```
And to tear it down:

```
docker compose down -v
```

Always use Incognito Mode when testing the frontend in your browser.
Browsers cache compiled frontend code aggressively, which can lead to outdated behavior during development.

## Run frontend application with mock server
Frontend application has been tested building its code using Node.js v22 and running on Chrome v140.<br>
To run the frontend application with a mock server, follow these steps:
- install Node.js and npm if you haven't already.
- navigate to the `frontend` directory
- run "npm install" to install the dependencies
- run "npm start" to start the development server
- open your browser and go to `http://localhost:3000`