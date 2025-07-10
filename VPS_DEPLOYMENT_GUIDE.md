# 🖥️ VPS Deployment Guide

## ⚠️ PENTING!
`python start_bot.py` dan `python start_web.py` akan **MATI saat SSH terputus**!  
Gunakan command di bawah untuk deployment persistent di VPS.

## 🚀 Quick Commands untuk VPS

### **Metode 1: Service Manager (Recommended)**

```bash
# 🟢 START - Jalankan bot + web di background
python3 manage.py start-all

# 📊 STATUS - Check apakah running
python3 manage.py status

# 🔄 RESTART WEB - Untuk development/deploy ulang
python3 manage.py restart-web

# 🛑 STOP - Stop semua services
python3 manage.py stop-all

# 📋 LOGS - Lihat logs
python3 manage.py logs
```

### **Metode 2: Screen Sessions**

```bash
# Install screen (jika belum ada)
sudo apt-get install screen

# 🟢 START - Jalankan di screen sessions
python3 screen_manage.py start-all

# 📊 STATUS - Check status screen sessions
python3 screen_manage.py status

# 🔄 RESTART WEB - Quick restart untuk development
python3 screen_manage.py restart-web

# 📺 LIHAT LOGS - Attach ke web session (real-time logs)
python3 screen_manage.py attach-web
# Tekan Ctrl+A, D untuk keluar

# 🛑 STOP - Stop semua screen sessions
python3 screen_manage.py stop-all
```

## 🎯 Workflow Development di VPS

### **Setup Awal:**
```bash
# 1. Start bot + web
python3 manage.py start-all

# 2. Check status
python3 manage.py status
```

### **Saat Development (Edit Code):**
```bash
# Edit code web service...
nano web_main.py

# Quick restart hanya web service
python3 manage.py restart-web
# Bot tetap jalan, tidak kena floodwait!

# Check status
python3 manage.py status
```

### **Monitoring:**
```bash
# Lihat logs real-time
python3 manage.py logs

# Atau dengan screen method
python3 screen_manage.py attach-web
```

## 📊 Command Reference

| Action | Service Manager | Screen Manager |
|--------|----------------|----------------|
| **Start All** | `python3 manage.py start-all` | `python3 screen_manage.py start-all` |
| **Status** | `python3 manage.py status` | `python3 screen_manage.py status` |
| **Restart Web** | `python3 manage.py restart-web` | `python3 screen_manage.py restart-web` |
| **Stop All** | `python3 manage.py stop-all` | `python3 screen_manage.py stop-all` |
| **View Logs** | `python3 manage.py logs` | `python3 screen_manage.py attach-web` |

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