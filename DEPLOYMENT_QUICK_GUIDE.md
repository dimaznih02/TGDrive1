# ⚡ Quick Guide: Deployment Terpisah

## 🚀 Command Cepat

### Development Mode (Recommended)
```bash
# Terminal 1 - Bot (jalankan sekali)
python start_bot.py

# Terminal 2 - Web Service (restart sesuka hati)
python start_web.py
```

### Production Mode
```bash
# Menggunakan PM2
pm2 start bot_main.py --name "tgdrive-bot" --interpreter python
pm2 start "uvicorn web_main:app --host 0.0.0.0 --port 8000" --name "tgdrive-web"
```

### All-in-One Mode
```bash
python start_all.py
```

## 📁 File Structure Baru

```
├── bot_main.py          # Bot Telegram (standalone)
├── web_main.py          # Web Service (standalone) 
├── start_bot.py         # Script untuk jalankan bot
├── start_web.py         # Script untuk jalankan web
├── start_all.py         # Script untuk jalankan keduanya
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
- **Web Service**: http://localhost:8000
- **Bot Telegram**: Otomatis terhubung ke chat