# Backup & Restore Guide

This guide explains how to backup and restore website data for the EPIC Project Website.

**What gets backed up:**
- Case Studies (text + images)
- Photo Gallery (albums + images)  
- Resources (files + documents)
- Team Members (profiles + photos)

⚠️ **Important**: Always backup your data before making changes or updates!

---

## 🚀 Quick Backup (Do This Regularly!)

### Step 1: Open the Console
Go to: **https://www.pythonanywhere.com/user/EPICIITD/consoles/**

Click on "Bash" to open a new console (or click an existing one).

### Step 2: Run the Backup Command
Copy and paste this entire block into the console and press Enter:
```bash
mkdir -p ~/backups && tar -czvf ~/backups/backup_$(date +%Y%m%d_%H%M%S).tar.gz static/
```

Wait for it to finish. You'll see a list of files being backed up.

### Step 3: Verify the Backup
Run this to see your backups:
```bash
ls -lh ~/backups/
```
You should see your new backup file with today's date.

### Step 4: Close the Console
Press `Ctrl+D` or type `exit` and press Enter.

### Step 5: Clean Up Old Backups (Important!)
If storage fills up, the website may stop working. Delete old backups periodically:
1. Go to **Files** tab: https://www.pythonanywhere.com/user/EPICIITD/files/home/EPICIITD/backups
2. Click on old backup files you don't need
3. Click the red "Delete" button

💡 **Tip**: Keep at least the 2-3 most recent backups.

---

## 📥 Download Backup to Your Computer

### Step 1: Go to Files
Open: **https://www.pythonanywhere.com/user/EPICIITD/files/home/EPICIITD/backups**

### Step 2: Download
Click on the backup file you want (e.g., `backup_20260201_120000.tar.gz`)

Click the **"Download"** button on the right side.

Save it somewhere safe on your computer!

---

## 🔄 Restore from Backup

⚠️ **Warning**: This will replace all current data. Make sure you really want to do this!

### Step 1: Open the Console
Go to: **https://www.pythonanywhere.com/user/EPICIITD/consoles/**

Click "Bash" to open a new console.

### Step 2: See Available Backups
```bash
ls -lh ~/backups/
```
Note the filename of the backup you want to restore (e.g., `backup_20260201_120000.tar.gz`).

### Step 3: Create a Safety Backup First
```bash
tar -czvf ~/backups/before_restore_$(date +%Y%m%d_%H%M%S).tar.gz static/
```

### Step 4: Remove Current Data
```bash
rm -rf static/
```

### Step 5: Restore the Backup
Replace `FILENAME` with your actual backup filename:
```bash
tar -xzvf ~/backups/FILENAME.tar.gz
```

Example:
```bash
tar -xzvf ~/backups/backup_20260201_120000.tar.gz
```

### Step 6: Verify
```bash
ls -la static/
```
You should see folders: `case_studies`, `gallery`, `resources`, `team`

### Step 7: Reload the Website
Go to: **https://www.pythonanywhere.com/user/EPICIITD/webapps/**

Click the green **"Reload"** button.

### Step 8: Close the Console
Press `Ctrl+D` or type `exit`.

---

## 📤 Upload a Backup from Your Computer

If you have a backup file on your computer and need to upload it:

### Step 1: Go to Backups Folder
Open: **https://www.pythonanywhere.com/user/EPICIITD/files/home/EPICIITD/backups**

### Step 2: Upload
Click **"Upload a file"** button (yellow button at top).

Select your backup file from your computer.

Wait for upload to complete.

### Step 3: Restore
Follow the "Restore from Backup" steps above.

---

## 🛠️ Troubleshooting

### "No space left on device" Error
Storage is full. Delete old backups:
1. Go to: https://www.pythonanywhere.com/user/EPICIITD/files/home/EPICIITD/backups
2. Delete old backup files you don't need
3. Try your operation again

### Website Not Loading After Restore
1. Go to: https://www.pythonanywhere.com/user/EPICIITD/webapps/
2. Click the green **"Reload"** button
3. Check the **"Error log"** link if still not working

### Images Not Showing
Check that the static folder has correct permissions:
```bash
chmod -R 755 static/
```

### Console Says "Permission Denied"
Run:
```bash
chmod -R 755 static/
```

---

## 📋 Quick Reference

| What you want to do | Command |
|---------------------|---------|
| Create backup | `tar -czvf ~/backups/backup_$(date +%Y%m%d).tar.gz static/` |
| List all backups | `ls -lh ~/backups/` |
| Restore a backup | `tar -xzvf ~/backups/FILENAME.tar.gz` |
| Delete old backups | Use Files tab or `rm ~/backups/old_backup.tar.gz` |
| Check disk space | `df -h` |

---

## 📞 Getting Help

- **PythonAnywhere Help**: https://help.pythonanywhere.com
- **Check Error Logs**: Web tab → "Error log" link
- **Dashboard**: https://www.pythonanywhere.com/user/EPICIITD/

---

## ✅ Best Practices

1. **Backup weekly** - Or before any major content changes
2. **Download backups** - Keep copies on your computer too
3. **Delete old backups** - Keep only last 2-3 to save space
4. **Test restores** - Occasionally verify backups actually work
5. **Note what changed** - Keep a simple log of major updates
