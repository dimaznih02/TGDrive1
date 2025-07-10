# 🐧 Ubuntu Python Fix

## ⚠️ Issue di Ubuntu Server
Di Ubuntu server, command `python` tidak tersedia secara default, hanya `python3`.

Error yang muncul:
```bash
Command 'python' not found, did you mean:
  command 'python3' from deb python3
  command 'python' from deb python-is-python3
```

## ✅ **SOLUSI - Files sudah diperbaiki!**

Saya telah memperbaiki semua script untuk menggunakan `python3`:

### **Gunakan command ini untuk Ubuntu:**

```bash
# 🟢 START - Jalankan bot + web di background
python3 manage.py start-all

# 📊 STATUS - Check status
python3 manage.py status

# 🔄 RESTART WEB - Quick restart untuk development
python3 manage.py restart-web

# 🛑 STOP - Stop semua services
python3 manage.py stop-all

# 📋 LOGS - Lihat logs
python3 manage.py logs
```

### **Atau menggunakan screen manager:**

```bash
# Install screen dulu
sudo apt-get install screen

# Start services
python3 screen_manage.py start-all

# Quick restart web
python3 screen_manage.py restart-web

# Check status
python3 screen_manage.py status
```

## 🔧 **Alternative: Setup python alias (opsional)**

Jika Anda ingin menggunakan `python` command:

```bash
# Install python-is-python3
sudo apt install python-is-python3

# Setelah itu bisa pakai 'python' command
python manage.py start-all
```

## 🎯 **Quick Test:**

```bash
# Test apakah python3 bekerja
python3 --version

# Start services
python3 manage.py start-all

# Check status
python3 manage.py status
```

**✅ Sekarang semua script sudah compatible dengan Ubuntu server!**