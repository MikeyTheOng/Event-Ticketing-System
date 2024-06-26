# EventJar Project for IS442

A full-stack application built with a React frontend and a Spring Boot backend using JPA with an SQLite database. The backend API provides event management capabilities, while the frontend offers a user-friendly interface for interacting with the event data.

## Overview

- **Backend**: Spring Boot & JPA
- **Database**: SQLite
- **Frontend**: React

## Getting Started

Follow these steps to set up the project on your local machine for development purposes.

### Prerequisites

Before running the project, make sure you have the following installed:
- Java JDK 11 or higher
- Maven (for backend)
- Node.js and npm or pnpm (for frontend)

### Backend Development (IntelliJ IDE Users)

1. Navigate to the `./backend/src/main/java/com/is442project/app` directory:
    ```sh
    run EventJarApplication.java
    ``` 
The backend server will start by default at `http://localhost:8080`.

### Frontend Development

1. Open a new terminal and navigate to the `/frontend` directory:
    ```sh
    cd frontend
    ```
2. Install the dependencies:
    ```sh
    pnpm install
    ```
3. Start the development server:
    ```sh
    pnpm dev
    ```

The frontend development server will start by default at `http://localhost:3000`.

### Running the Full Application

To run both frontend and backend simultaneously, you can open two terminals and follow the steps provided above for each part of the project. Ensure that both servers are running and accessible before attempting to use the application.
