# EPIC Website Handover

Hi,

I'm handing over the EPIC Project Website. Below you'll find all the credentials, links, and documentation you'll need to manage and maintain the website.

---

## 🔐 Credentials

### Website Admin Portal
- **URL**: https://epic.iitd.ac.in/admin
- **Password**: `EPICadmin@123`

### PythonAnywhere (Server Hosting)
- **Dashboard**: https://www.pythonanywhere.com/user/EPICIITD/
- **Username**: `EPICIITD`
- **Password**: `EPIC!@#$`

### GitHub Repository
- **URL**: https://github.com/Z3R0C1PH3R/EPICprojectWebsite

---

## 🔗 Important Links

### Live Website
- **Main Site**: https://epic.iitd.ac.in

### PythonAnywhere
- **Dashboard**: https://www.pythonanywhere.com/user/EPICIITD/
- **Files**: https://www.pythonanywhere.com/user/EPICIITD/files/home/EPICIITD
- **Web App Config**: https://www.pythonanywhere.com/user/EPICIITD/webapps/
- **Consoles**: https://www.pythonanywhere.com/user/EPICIITD/consoles/
- **Backups Folder**: https://www.pythonanywhere.com/user/EPICIITD/files/home/EPICIITD/backups

### GitHub Repository
- **Code**: https://github.com/Z3R0C1PH3R/EPICprojectWebsite
- **Issues**: https://github.com/Z3R0C1PH3R/EPICprojectWebsite/issues

---

## 📚 Documentation

All guides are available in the GitHub repository:

| Guide | Description | Link |
|-------|-------------|------|
| **README** | Project overview & setup | [README.md](https://github.com/Z3R0C1PH3R/EPICprojectWebsite/blob/main/README.md) |
| **Backup Guide** | How to backup & restore data | [BACKUP.md](https://github.com/Z3R0C1PH3R/EPICprojectWebsite/blob/main/BACKUP.md) |
| **Deployment Guide** | How to deploy updates | [DEPLOYMENT.md](https://github.com/Z3R0C1PH3R/EPICprojectWebsite/blob/main/DEPLOYMENT.md) |
| **User Guide** | Content & code changes | [GUIDE.md](https://github.com/Z3R0C1PH3R/EPICprojectWebsite/blob/main/GUIDE.md) |

---

## 🎯 Quick Start Tasks

### Adding/Editing Content (No coding required)
1. Go to https://epic.iitd.ac.in/admin
2. Login with password: `EPICadmin@123`
3. Add/edit Case Studies, Gallery, Resources, or Team members

### Taking a Backup
1. Go to https://www.pythonanywhere.com/user/EPICIITD/consoles/
2. Open a Bash console
3. Run: `mkdir -p ~/backups && tar -czvf ~/backups/backup_$(date +%Y%m%d_%H%M%S).tar.gz static/`
4. Close console (Ctrl+D)

See [BACKUP.md](https://github.com/Z3R0C1PH3R/EPICprojectWebsite/blob/main/BACKUP.md) for detailed instructions.

### Reloading the Website (After Issues)
1. Go to https://www.pythonanywhere.com/user/EPICIITD/webapps/
2. Click the green "Reload" button

### Viewing Error Logs
1. Go to https://www.pythonanywhere.com/user/EPICIITD/webapps/
2. Click "Error log" link under "Log files"

---

## 🏗️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Python, Flask
- **Hosting**: PythonAnywhere
- **Data Storage**: JSON files in `static/` folder

---

## 📁 Important Files & Folders

On PythonAnywhere (`/home/EPICIITD/`):

| Path | Description |
|------|-------------|
| `static/` | All website data (case studies, gallery, resources, team) |
| `static/case_studies/` | Case study content and images |
| `static/gallery/` | Photo albums and images |
| `static/resources/` | Resource files and documents |
| `static/team/` | Team member data and photos |
| `server.py` | Backend server code |
| `backups/` | Backup files (create if doesn't exist) |

---

## 🔧 Changing the Admin Password

The admin password is stored in `server.py` on PythonAnywhere. **It is NOT in the GitHub repo for security reasons.**

### To view or change the password:

1. Go to: https://www.pythonanywhere.com/user/EPICIITD/files/home/EPICIITD/server.py
2. Find this line near the top (around line 23):
   ```python
   ADMIN_PASSWORD = "<THE PASSWORD>"
   ```
3. Change the password inside the quotes to whatever you want
4. Click **Save**
5. Go to https://www.pythonanywhere.com/user/EPICIITD/webapps/ and click **Reload**

⚠️ **Note**: The GitHub repository has `ADMIN_PASSWORD = "REDACTED_FOR_SECURITY"` as a placeholder. The actual password only exists on the PythonAnywhere server.

---

## ⚠️ Important Notes

1. **Always backup before major changes** - Use the backup guide
2. **Don't delete the `static/` folder** - It contains all website data
3. **Reload after changes** - Click Reload in PythonAnywhere after any server changes
4. **Storage limits** - Delete old backups periodically to avoid storage issues
5. **Keep credentials secure** - Don't share these credentials publicly

---

## 📞 Need Help?

- **PythonAnywhere Support**: https://help.pythonanywhere.com
- **Check Error Logs**: Web tab → Error log link
- **GitHub Issues**: https://github.com/Z3R0C1PH3R/EPICprojectWebsite/issues

---

Feel free to reach out if you have any questions!

Best regards,
Aryan
