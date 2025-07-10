# 🚨 QUICK FIX: Dependencies Missing di Ubuntu VPS

## ⚠️ Masalah yang Terjadi
Services start tapi langsung mati karena dependencies seperti `aiohttp`, `fastapi`, `uvicorn` tidak terinstall.

Error: `ModuleNotFoundError: No module named 'aiohttp'`

## ✅ **SOLUSI CEPAT (Pilih salah satu)**

### **🚀 Metode 1: Install dengan --break-system-packages (Quickest)**

```bash
# Install semua dependencies sekaligus
pip3 install -r requirements.txt --break-system-packages

# Setelah itu langsung start services
python3 manage.py start-all
```

### **📦 Metode 2: Install dependencies satu per satu (Safer)**

```bash
# Install core dependencies
pip3 install fastapi uvicorn aiofiles aiohttp python-dotenv --break-system-packages
pip3 install pyrogram tgcrypto dill tqdm curl_cffi --break-system-packages

# Start services
python3 manage.py start-all
```

### **🐍 Metode 3: Virtual Environment (Most Proper)**

```bash
# Install python3-venv
apt install python3-venv -y

# Create virtual environment
python3 -m venv tgdrive_env

# Activate virtual environment
source tgdrive_env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start services (dalam venv)
python manage.py start-all
```

## 🎯 **Test Apakah Fixed:**

```bash
# Test web service manual
python3 -c "import fastapi, uvicorn, aiohttp; print('✅ Dependencies OK')"

# Jika no error, start services
python3 manage.py start-all

# Check status
python3 manage.py status

# Test website di browser
# http://209.74.83.188:8000
```

## ⚡ **One-liner Command (Metode 1 - Recommended untuk VPS):**

```bash
pip3 install fastapi uvicorn aiofiles aiohttp python-dotenv pyrogram tgcrypto dill tqdm curl_cffi techzdl --break-system-packages && python3 manage.py start-all
```

## 🔍 **Troubleshoot Jika Masih Error:**

```bash
# Cek logs real-time
python3 manage.py logs

# Atau manual start untuk debug
python3 web_main.py

# Check port 8000 listening
netstat -tlnp | grep 8000

# Check firewall
ufw status
```

## 📝 **Note:**
- `--break-system-packages` aman untuk VPS dedicated
- Jika shared hosting, gunakan virtual environment (Metode 3)
- Dependencies akan terinstall di system Python