# EPIC Project Website

This is the official website for the EPIC project at IIT Delhi. It is a full-stack application with a React frontend and a Flask backend.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Python, Flask
- **Database**: JSON files (stored in `static/`)

## Prerequisites

- Node.js (v18 or higher recommended)
- Python 3.8 or higher

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd EPIC-Website
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## Development

To run the project locally:

1.  **Start the Backend Server:**
    ```bash
    python server.py
    ```
    The server will start on `http://localhost:5000` (or the port defined in `server.py`).

2.  **Start the Frontend Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Project Structure

- `src/`: React source code.
  - `components/`: Reusable UI components.
  - `pages/`: Page components (Home, About, Case Studies, etc.).
  - `admin/`: Admin portal components.
- `static/`: Data storage (JSON files) and uploaded media.
  - `case_studies/`: Case study data and images.
  - `gallery/`: Gallery images.
  - `resources/`: Resource files.
- `server.py`: Flask backend handling API requests and file management.
- `public/`: Static assets for the frontend build.

## Documentation

For more detailed information, please refer to the following guides:

- [Deployment Guide](DEPLOYMENT.md): Instructions for deploying to production.
- [User Guide](GUIDE.md): Instructions for making content and code changes.

