#!/usr/bin/env python3
"""
🚀 TG Drive Service Manager
Script untuk manage Bot dan Web Service dengan mudah di VPS
"""

import os
import subprocess
import sys
import time
import signal
import psutil

def get_pid_from_file(pid_file):
    """Get PID from file if exists and process is running"""
    try:
        if os.path.exists(pid_file):
            with open(pid_file, 'r') as f:
                pid = int(f.read().strip())
            # Check if process is still running
            try:
                if psutil.pid_exists(pid):
                    return pid
            except:
                # Fallback if psutil not available - check with os
                try:
                    os.kill(pid, 0)  # Signal 0 just checks if process exists
                    return pid
                except ProcessLookupError:
                    pass
    except:
        pass
    return None

def save_pid(pid_file, pid):
    """Save PID to file"""
    with open(pid_file, 'w') as f:
        f.write(str(pid))

def remove_pid_file(pid_file):
    """Remove PID file"""
    try:
        if os.path.exists(pid_file):
            os.remove(pid_file)
    except:
        pass

def start_bot():
    """Start Bot Telegram in background"""
    pid_file = "bot.pid"
    
    # Check if bot is already running
    existing_pid = get_pid_from_file(pid_file)
    if existing_pid:
        print(f"🤖 Bot sudah berjalan dengan PID: {existing_pid}")
        return
    
    print("🤖 Starting Bot Telegram...")
    
    # Start bot in background using nohup
    # Add user local bin to PATH for pip-installed packages
    env = os.environ.copy()
    env['PATH'] = f"/home/ubuntu/.local/bin:{env.get('PATH', '')}"
    
    process = subprocess.Popen([
        "nohup", "python3", "bot_main.py"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, preexec_fn=os.setsid, env=env)
    
    save_pid(pid_file, process.pid)
    
    # Wait a moment to check if it started successfully
    time.sleep(2)
    if get_pid_from_file(pid_file):
        print(f"✅ Bot started successfully! PID: {process.pid}")
        print("🔍 Check logs: tail -f nohup.out")
    else:
        print("❌ Failed to start bot")

def start_web():
    """Start Web Service in background"""
    pid_file = "web.pid"
    
    # Check if web is already running
    existing_pid = get_pid_from_file(pid_file)
    if existing_pid:
        print(f"🌐 Web service sudah berjalan dengan PID: {existing_pid}")
        return
    
    print("🌐 Starting Web Service...")
    
    # Start web service in background using nohup
    # Add user local bin to PATH for pip-installed packages
    env = os.environ.copy()
    env['PATH'] = f"/home/ubuntu/.local/bin:{env.get('PATH', '')}"
    
    process = subprocess.Popen([
        "nohup", "python3", "-m", "uvicorn", "web_main:app", "--host", "0.0.0.0", "--port", "8000"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, preexec_fn=os.setsid, env=env)
    
    save_pid(pid_file, process.pid)
    
    # Wait a moment to check if it started successfully
    time.sleep(2)
    if get_pid_from_file(pid_file):
        print(f"✅ Web service started successfully! PID: {process.pid}")
        print("🌐 Access: http://your-vps-ip:8000")
        print("🔍 Check logs: tail -f nohup.out")
    else:
        print("❌ Failed to start web service")

def stop_bot():
    """Stop Bot Telegram"""
    pid_file = "bot.pid"
    pid = get_pid_from_file(pid_file)
    
    if not pid:
        print("🤖 Bot tidak sedang berjalan")
        return
    
    try:
        print(f"🛑 Stopping Bot (PID: {pid})...")
        os.killpg(os.getpgid(pid), signal.SIGTERM)
        time.sleep(2)
        
        # Force kill if still running
        if psutil.pid_exists(pid):
            os.killpg(os.getpgid(pid), signal.SIGKILL)
        
        remove_pid_file(pid_file)
        print("✅ Bot stopped successfully!")
    except Exception as e:
        print(f"❌ Error stopping bot: {e}")
        remove_pid_file(pid_file)

def stop_web():
    """Stop Web Service"""
    pid_file = "web.pid"
    pid = get_pid_from_file(pid_file)
    
    if not pid:
        print("🌐 Web service tidak sedang berjalan")
        return
    
    try:
        print(f"🛑 Stopping Web Service (PID: {pid})...")
        os.killpg(os.getpgid(pid), signal.SIGTERM)
        time.sleep(2)
        
        # Force kill if still running
        if psutil.pid_exists(pid):
            os.killpg(os.getpgid(pid), signal.SIGKILL)
        
        remove_pid_file(pid_file)
        print("✅ Web service stopped successfully!")
    except Exception as e:
        print(f"❌ Error stopping web service: {e}")
        remove_pid_file(pid_file)

def restart_web():
    """Restart Web Service (Quick for development)"""
    print("🔄 Restarting Web Service...")
    stop_web()
    time.sleep(1)
    start_web()

def status():
    """Show status of both services"""
    print("📊 TG Drive Services Status:")
    print("=" * 40)
    
    # Check bot status
    bot_pid = get_pid_from_file("bot.pid")
    if bot_pid:
        print(f"🤖 Bot Telegram: ✅ Running (PID: {bot_pid})")
    else:
        print("🤖 Bot Telegram: ❌ Not running")
    
    # Check web status  
    web_pid = get_pid_from_file("web.pid")
    if web_pid:
        print(f"🌐 Web Service: ✅ Running (PID: {web_pid})")
        print("   📍 URL: http://your-vps-ip:8000")
    else:
        print("🌐 Web Service: ❌ Not running")

def show_help():
    """Show help message"""
    print("""
🚀 TG Drive Service Manager

Usage: python3 manage.py <command>

Commands:
  start-bot        Start Bot Telegram di background
  start-web        Start Web Service di background  
  start-all        Start keduanya
  
  stop-bot         Stop Bot Telegram
  stop-web         Stop Web Service
  stop-all         Stop keduanya
  
  restart-web      Restart Web Service (untuk development)
  restart-all      Restart keduanya
  
  status           Show status services
  logs             Show logs
  
Examples:
  python3 manage.py start-all       # Start bot + web
  python3 manage.py restart-web     # Quick restart web untuk development
  python3 manage.py status          # Check status
  python3 manage.py stop-all        # Stop semua
""")

def show_logs():
    """Show logs"""
    print("📋 Showing logs (Press Ctrl+C to exit):")
    try:
        subprocess.run(["tail", "-f", "nohup.out"])
    except KeyboardInterrupt:
        print("\n👋 Log viewing stopped")
    except FileNotFoundError:
        print("📝 No logs found. Start services first.")

def main():
    if len(sys.argv) < 2:
        show_help()
        return
    
    command = sys.argv[1].lower()
    
    # Try to import psutil, install if needed
    try:
        import psutil
    except ImportError:
        print("📦 Installing required package psutil...")
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", "psutil", "--break-system-packages"], check=True)
            import psutil
            print("✅ psutil installed successfully")
        except subprocess.CalledProcessError:
            print("⚠️  Warning: Could not install psutil automatically")
            print("   Process status checking may be limited")
            print("   Run manually: pip3 install psutil --break-system-packages")
            # Continue without psutil - basic functionality will work
    
    if command == "start-bot":
        start_bot()
    elif command == "start-web":
        start_web()
    elif command == "start-all":
        start_bot()
        time.sleep(1)
        start_web()
    elif command == "stop-bot":
        stop_bot()
    elif command == "stop-web":
        stop_web()
    elif command == "stop-all":
        stop_bot()
        stop_web()
    elif command == "restart-web":
        restart_web()
    elif command == "restart-all":
        stop_bot()
        stop_web()
        time.sleep(1)
        start_bot()
        start_web()
    elif command == "status":
        status()
    elif command == "logs":
        show_logs()
    else:
        print(f"❌ Unknown command: {command}")
        show_help()

if __name__ == "__main__":
    main()