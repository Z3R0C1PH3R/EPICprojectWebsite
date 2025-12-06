# User & Developer Guide

This guide explains how to make changes to the EPIC Project Website, covering both content updates and code modifications.

## Making Content Changes

Content such as Case Studies, Gallery Images, and Resources can be managed through the Admin Portal.

### Using the Admin Portal

1.  **Access the Portal**: Navigate to `/admin` (e.g., `https://epic.iitd.ac.in/admin`).
2.  **Login**: Enter the admin password.
3.  **Dashboard**: You will see options to manage:
    - **Case Studies**: Add, edit, or delete case studies.
    - **Gallery**: Upload or remove images.
    - **Resources**: Manage downloadable resources.
    - **Team/Partners**: Update partner information.

**Note**: The Admin Portal requires the backend server to be running. Changes made here are saved to JSON files in the `static/` directory on the server.

## Making Code Changes

To modify the website's design or functionality (React components), follow these steps:

1.  **Setup Development Environment**:
    - Ensure you have the repository cloned and dependencies installed (`npm install`).
    - Start the local development server: `npm run dev`.

2.  **Project Structure**:
    - **Pages**: Located in `src/pages/`. Edit these to change the layout of specific routes.
    - **Components**: Reusable UI elements in `src/components/`.
    - **Styles**: Tailwind CSS is used. Edit classes directly in JSX or modify `src/index.css`.

3.  **Common Tasks**:
    - **Changing Navigation**: Edit `src/components/Navigation.tsx`.
    - **Updating Footer**: Edit `src/components/Footer.tsx`.
    - **Modifying Home Page**: Edit `src/pages/Home.tsx`.

4.  **Testing**:
    - Verify changes locally on `http://localhost:5173`.
    - Ensure the backend is running (`python server.py`) if your changes involve data fetching.

5.  **Deployment**:
    - Once satisfied, follow the [Deployment Guide](DEPLOYMENT.md) to build and deploy the changes to production.
