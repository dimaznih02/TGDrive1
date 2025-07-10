# 🚀 Panduan Deployment Terpisah: Bot Telegram & Web Service

## 📋 Ringkasan

Panduan ini menjelaskan cara memisahkan deployment antara **Bot Telegram** dan **Web Service** TG Drive, sehingga:

✅ **Bot Telegram** tetap berjalan stabil tanpa terganggu restart web service  
✅ **Web Service** bisa dideploy ulang dengan bebas tanpa menyebabkan floodwait pada bot  
✅ **Kedua service tetap sinkron** dan berbagi data yang sama  

## 🔧 Files yang Telah Dibuat

### 1. **Service Files**
- `bot_main.py` - Main file untuk menjalankan bot Telegram saja
- `web_main.py` - Main file untuk menjalankan web service saja

### 2. **Starter Scripts**
- `start_bot.py` - Script untuk menjalankan bot Telegram
- `start_web.py` - Script untuk menjalankan web service
- `start_all.py` - Script untuk menjalankan keduanya bersamaan (dalam proses terpisah)

## 🎯 Command untuk Deployment Terpisah

### **Menjalankan Hanya Bot Telegram**
```bash
python start_bot.py
```
atau langsung:
```bash
python bot_main.py
```

### **Menjalankan Hanya Web Service**
```bash
python start_web.py
```
atau langsung:
```bash
uvicorn web_main:app --host 0.0.0.0 --port 8000 --reload
```

### **Menjalankan Keduanya Bersamaan (Tapi Terpisah)**
```bash
python start_all.py
```

## 🔄 Skenario Deployment

### **Skenario 1: Pengembangan Website** *(Recommended)*

1. **Jalankan bot sekali saja:**
   ```bash
   python start_bot.py
   ```
   
2. **Develop & restart web service sesuka hati:**
   ```bash
   python start_web.py
   # Restart kapan saja tanpa mengganggu bot
   ```

3. **Bot akan tetap berjalan** dan tidak terkena floodwait!

### **Skenario 2: Development Mode**

Jika ingin keduanya berjalan bersamaan tapi tetap dalam proses terpisah:
```bash
python start_all.py
```

### **Skenario 3: Production Deployment**

**Menggunakan PM2 (Recommended untuk production):**

1. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Jalankan bot sebagai daemon:**
   ```bash
   pm2 start bot_main.py --name "tgdrive-bot" --interpreter python
   ```

3. **Jalankan web service sebagai daemon:**
   ```bash
   pm2 start "uvicorn web_main:app --host 0.0.0.0 --port 8000" --name "tgdrive-web"
   ```

4. **Monitoring:**
   ```bash
   pm2 status
   pm2 logs tgdrive-bot
   pm2 logs tgdrive-web
   ```

5. **Restart hanya web service:**
   ```bash
   pm2 restart tgdrive-web
   # Bot tetap berjalan tanpa gangguan!
   ```

## 🔧 Menggunakan systemd (Linux)

### **1. Buat service file untuk bot:**
```bash
sudo nano /etc/systemd/system/tgdrive-bot.service
```

```ini
[Unit]
Description=TG Drive Bot Service
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/your/project
Environment=PATH=/path/to/your/venv/bin
ExecStart=/path/to/your/venv/bin/python bot_main.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### **2. Buat service file untuk web:**
```bash
sudo nano /etc/systemd/system/tgdrive-web.service
```

```ini
[Unit]
Description=TG Drive Web Service
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/your/project
Environment=PATH=/path/to/your/venv/bin
ExecStart=/path/to/your/venv/bin/uvicorn web_main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### **3. Enable dan start services:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable tgdrive-bot
sudo systemctl enable tgdrive-web
sudo systemctl start tgdrive-bot
sudo systemctl start tgdrive-web
```

### **4. Control services:**
```bash
# Status
sudo systemctl status tgdrive-bot
sudo systemctl status tgdrive-web

# Restart hanya web service
sudo systemctl restart tgdrive-web

# Restart hanya bot (jarang diperlukan)
sudo systemctl restart tgdrive-bot

# Logs
sudo journalctl -u tgdrive-bot -f
sudo journalctl -u tgdrive-web -f
```

## 🎯 Keuntungan Deployment Terpisah

### ✅ **Untuk Bot Telegram:**
- **Tidak ada floodwait** karena bot tidak ter-restart
- **Koneksi Telegram tetap stabil**
- **Upload/download tidak terganggu**
- **Session Telegram tetap aktif**

### ✅ **Untuk Web Service:**
- **Bebas restart kapan saja** untuk testing fitur baru
- **Hot reload development** tanpa mengganggu bot
- **Deploy ulang lebih cepat** karena tidak perlu restart bot
- **Debugging lebih mudah**

### ✅ **Untuk Development:**
- **Workflow development lebih lancar**
- **Testing lebih efisien**
- **No more waiting untuk floodwait**
- **Parallel development** bot dan web

## 🔄 Cara Kerja Sinkronisasi

Kedua service tetap **sinkron** karena:

1. **Shared Database**: Keduanya menggunakan file `drive.data` yang sama di Telegram
2. **Shared Storage**: Upload/download menggunakan storage channel yang sama  
3. **Shared Configuration**: Menggunakan environment variables yang sama
4. **Real-time Sync**: Perubahan data langsung tersinkron via Telegram backup

## 🛠️ Tips & Best Practices

### **1. Development Workflow:**
```bash
# 1. Start bot once (untuk local development)
python3 start_bot.py

# 2. Develop web service dengan restart bebas (untuk local)
python3 start_web.py
# Stop, modify code, restart - repeat!

# ATAU untuk VPS development:
python3 manage.py start-all        # Start sekali
python3 manage.py restart-web      # Restart web sesuka hati
```

### **2. Production Workflow:**
```bash
# 1. Deploy bot menggunakan PM2/systemd
pm2 start bot_main.py --name "tgdrive-bot" --interpreter python3

# 2. Deploy web menggunakan reverse proxy (nginx)
# dengan restart sesuka hati tanpa mengganggu bot
```

### **3. Monitoring:**
- Monitor dengan PM2: `pm2 logs tgdrive-bot` dan `pm2 logs tgdrive-web`
- Monitor dengan Service Manager: `python3 manage.py logs`
- Monitor dengan Screen: `python3 screen_manage.py attach-web`
- Check status: `python3 manage.py status` atau `pm2 status`

### **4. Backup Strategy:**
Karena bot dan web terpisah, backup database tetap otomatis dari kedua service.

## 🖥️ Deployment di VPS (Background Process)

### ⚠️ **PENTING untuk VPS:**
Jika Anda run `python start_bot.py` atau `python start_web.py` langsung di VPS, mereka akan **mati saat SSH connection terputus**!

### **🚀 Solusi 1: Menggunakan Service Manager (Recommended)**

```bash
# Start services di background (persistent)
python3 manage.py start-all

# Check status
python3 manage.py status

# Quick restart web untuk development
python3 manage.py restart-web

# Stop services
python3 manage.py stop-all

# Lihat logs
python3 manage.py logs
```

### **📺 Solusi 2: Menggunakan Screen Sessions**

```bash
# Install screen jika belum ada
sudo apt-get install screen

# Start services di screen sessions
python3 screen_manage.py start-all

# Check status
python3 screen_manage.py status

# Quick restart web
python3 screen_manage.py restart-web

# Attach ke web session untuk lihat logs real-time
python3 screen_manage.py attach-web
# (Ctrl+A, D untuk detach)
```

## ⚡ Quick Start Commands

### **Local Development:**
```bash
# Development mode - untuk coding/testing
python start_bot.py    # Terminal 1 (jalankan sekali)
python start_web.py    # Terminal 2 (restart sesuka hati)
```

### **VPS Deployment:**
```bash
# Persistent background services
python manage.py start-all        # Atau
python screen_manage.py start-all

# Quick restart web untuk development
python manage.py restart-web      # Atau  
python screen_manage.py restart-web
```

### **Production dengan PM2:**
```bash
# Production mode - menggunakan PM2
pm2 start bot_main.py --name "tgdrive-bot" --interpreter python
pm2 start "uvicorn web_main:app --host 0.0.0.0 --port 8000" --name "tgdrive-web"
```

## 🎉 Hasil

Dengan setup ini, Anda bisa:

🚀 **Deploy web service berkali-kali** tanpa mengganggu bot  
🤖 **Bot Telegram tetap stabil** dan tidak floodwait  
⚡ **Development jadi lebih cepat** dan efisien  
🔄 **Kedua service tetap sinkron** dengan sempurna  

---

**🎯 Selamat! Bot dan Web Service Anda sekarang berjalan terpisah namun tetap terhubung!**