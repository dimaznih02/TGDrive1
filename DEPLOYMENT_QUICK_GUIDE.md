# ⚡ Quick Guide: Deployment Terpisah

## ⚠️ PENTING untuk VPS!
Jika deploy di VPS, jangan gunakan `python3 start_bot.py` langsung - akan mati saat SSH terputus!  
Gunakan `python3 manage.py start-all` atau `python3 screen_manage.py start-all` untuk persistent background process.  

**Ubuntu Server**: Gunakan `python3` bukan `python`!

## 🚀 Command Cepat

### Development Mode (Local)
```bash
# Terminal 1 - Bot (jalankan sekali)
python start_bot.py

# Terminal 2 - Web Service (restart sesuka hati)
python start_web.py
```

### VPS Deployment (Background/Persistent)
```bash
# Service Manager (Recommended untuk VPS)
python3 manage.py start-all        # Start persistent di background
python3 manage.py restart-web      # Quick restart web untuk development
python3 manage.py status           # Check status

# Screen Sessions (Alternative)  
python3 screen_manage.py start-all # Start di screen sessions
python3 screen_manage.py restart-web
python3 screen_manage.py attach-web  # Lihat logs real-time
```

### Production Mode (PM2)
```bash
pm2 start bot_main.py --name "tgdrive-bot" --interpreter python
pm2 start "uvicorn web_main:app --host 0.0.0.0 --port 8000" --name "tgdrive-web"
```

## 📁 File Structure Baru

```
├── bot_main.py          # Bot Telegram (standalone)
├── web_main.py          # Web Service (standalone) 
├── start_bot.py         # Script untuk jalankan bot (local)
├── start_web.py         # Script untuk jalankan web (local)
├── start_all.py         # Script untuk jalankan keduanya (local)
├── manage.py            # Service Manager untuk VPS (background process)
├── screen_manage.py     # Screen Manager untuk VPS (screen sessions)
├── main.py              # File lama (masih bisa dipakai)
└── PANDUAN_DEPLOYMENT_TERPISAH.md  # Panduan lengkap
```

## ✅ Keuntungan

- ✅ **Bot tidak floodwait** saat restart web
- ✅ **Web bisa restart bebas** untuk development  
- ✅ **Kedua service tetap sinkron**
- ✅ **Development workflow lebih lancar**

## 🔗 Links

- **Panduan Lengkap**: [PANDUAN_DEPLOYMENT_TERPISAH.md](PANDUAN_DEPLOYMENT_TERPISAH.md)
- **VPS Deployment**: [VPS_DEPLOYMENT_GUIDE.md](VPS_DEPLOYMENT_GUIDE.md)
- **Web Service**: http://localhost:8000 (local) atau http://your-vps-ip:8000 (VPS)
- **Bot Telegram**: Otomatis terhubung ke chat