# Deployment Guide

This guide outlines the steps to deploy the EPIC Project Website to the production server.

## Prerequisites

- SSH access to the server (`epic.iitd.ac.in`).
- `npm` installed locally.
- `zip` utility installed locally.

## Automated Deployment (Recommended)

### Linux / macOS
A deployment script `deploy.sh` is included in the repository which automates the build, upload, and deployment process, including creating backups.

```bash
./deploy.sh <username> <password>
```
*Note: You may need to install `sshpass` for password automation, or run it without the password argument to enter it manually.*

### Windows
A PowerShell script `deploy.ps1` is available for Windows users.

```powershell
.\deploy.ps1 -Username <username>
```
*Note: This script uses the native OpenSSH client (`ssh` and `scp`) available in Windows 10/11. You will be prompted for your password during the upload and deployment steps unless you have set up SSH keys.*

## Manual Deployment

If you prefer to deploy manually, follow these steps:

### 1. Build the Project
Generate the production build of the frontend.
```bash
npm run build
```

### 2. Package the Build
Zip the `dist` folder containing the build artifacts.
```bash
zip -r dist.zip dist
```

### 3. Transfer to Server
Copy the zipped file to the server using `scp`.
```bash
scp dist.zip es1230842@epic.iitd.ac.in:/var/www/epic/https
```

### 4. Deploy on Server
SSH into the server and replace the existing `html` folder with the new build.
```bash
ssh es1230842@epic.iitd.ac.in
```

*Inside the SSH session:*
```bash
cd /var/www/epic/https
unzip dist.zip
rm -r html
mv dist html
exit
```

## Backend Deployment

The backend (`server.py`) and the data (`static/` folder) reside on the server.

- **Location**: Ensure `server.py` and the `static/` folder are located in the appropriate directory on the server (likely `/var/www/epic/https` or a sibling directory depending on the server configuration).
- **Updates**: If you make changes to `server.py`, you must upload the new file to the server and restart the backend service.
- **Data Persistence**: The `static/` folder contains the website's data (case studies, gallery images, etc.). **Do not delete or overwrite this folder** unless you intend to reset the data. The frontend deployment steps above (replacing `html`) do NOT affect the `static/` folder, which is safe.

## Troubleshooting

- **Admin Portal Issues**: If the Admin Portal is not working, ensure the backend server (`server.py`) is running and accessible.
- **Missing Images/Data**: Ensure the `static/` folder exists and has the correct permissions.
