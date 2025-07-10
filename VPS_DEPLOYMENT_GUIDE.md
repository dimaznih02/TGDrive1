# 🖥️ VPS Deployment Guide

## ⚠️ PENTING!
`python start_bot.py` dan `python start_web.py` akan **MATI saat SSH terputus**!  
Gunakan command di bawah untuk deployment persistent di VPS.

## 🚀 Quick Commands untuk VPS

### **Metode 1: Service Manager (Recommended)**

```bash
# 🟢 START - Jalankan bot + web di background
python manage.py start-all

# 📊 STATUS - Check apakah running
python manage.py status

# 🔄 RESTART WEB - Untuk development/deploy ulang
python manage.py restart-web

# 🛑 STOP - Stop semua services
python manage.py stop-all

# 📋 LOGS - Lihat logs
python manage.py logs
```

### **Metode 2: Screen Sessions**

```bash
# Install screen (jika belum ada)
sudo apt-get install screen

# 🟢 START - Jalankan di screen sessions
python screen_manage.py start-all

# 📊 STATUS - Check status screen sessions
python screen_manage.py status

# 🔄 RESTART WEB - Quick restart untuk development
python screen_manage.py restart-web

# 📺 LIHAT LOGS - Attach ke web session (real-time logs)
python screen_manage.py attach-web
# Tekan Ctrl+A, D untuk keluar

# 🛑 STOP - Stop semua screen sessions
python screen_manage.py stop-all
```

## 🎯 Workflow Development di VPS

### **Setup Awal:**
```bash
# 1. Start bot + web
python manage.py start-all

# 2. Check status
python manage.py status
```

### **Saat Development (Edit Code):**
```bash
# Edit code web service...
nano web_main.py

# Quick restart hanya web service
python manage.py restart-web
# Bot tetap jalan, tidak kena floodwait!

# Check status
python manage.py status
```

### **Monitoring:**
```bash
# Lihat logs real-time
python manage.py logs

# Atau dengan screen method
python screen_manage.py attach-web
```

## 📊 Command Reference

| Action | Service Manager | Screen Manager |
|--------|----------------|----------------|
| **Start All** | `python manage.py start-all` | `python screen_manage.py start-all` |
| **Status** | `python manage.py status` | `python screen_manage.py status` |
| **Restart Web** | `python manage.py restart-web` | `python screen_manage.py restart-web` |
| **Stop All** | `python manage.py stop-all` | `python screen_manage.py stop-all` |
| **View Logs** | `python manage.py logs` | `python screen_manage.py attach-web` |

## ✅ Benefits

- ✅ **Persistent** - Services tetap jalan saat SSH terputus
- ✅ **Quick Restart** - Web bisa restart cepat tanpa ganggu bot  
- ✅ **No Floodwait** - Bot tidak ter-restart saat web deploy ulang
- ✅ **Easy Management** - Command simple untuk start/stop/restart
- ✅ **Real-time Logs** - Bisa monitor logs secara real-time

## 🎉 Selesai!

Sekarang Anda bisa:
1. **Deploy di VPS** dengan persistent background process
2. **Restart web service** sesuka hati tanpa ganggu bot
3. **Monitor logs** secara real-time
4. **Management yang mudah** dengan command sederhana

**🚀 Happy Deploying!**