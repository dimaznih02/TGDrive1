#!/usr/bin/env python3
"""
📺 TG Drive Screen Manager
Alternative manager menggunakan screen sessions untuk VPS
"""

import os
import subprocess
import sys
import time

def run_command(command):
    """Run shell command and return output"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def is_screen_running(session_name):
    """Check if screen session is running"""
    success, output, _ = run_command(f"screen -list | grep {session_name}")
    return success and session_name in output

def start_bot():
    """Start Bot in screen session"""
    session_name = "tgdrive-bot"
    
    if is_screen_running(session_name):
        print(f"🤖 Bot sudah berjalan di screen session: {session_name}")
        print(f"   📺 Attach: screen -r {session_name}")
        return
    
    print("🤖 Starting Bot Telegram in screen session...")
    
    # Start bot in screen
    command = f"screen -dmS {session_name} python3 bot_main.py"
    success, _, error = run_command(command)
    
    if success:
        print(f"✅ Bot started in screen session: {session_name}")
        print(f"📺 Attach to session: screen -r {session_name}")
        print(f"📱 Detach from session: Ctrl+A, D")
    else:
        print(f"❌ Failed to start bot: {error}")

def start_web():
    """Start Web Service in screen session"""
    session_name = "tgdrive-web"
    
    if is_screen_running(session_name):
        print(f"🌐 Web service sudah berjalan di screen session: {session_name}")
        print(f"   📺 Attach: screen -r {session_name}")
        return
    
    print("🌐 Starting Web Service in screen session...")
    
    # Start web in screen
    command = f"screen -dmS {session_name} uvicorn web_main:app --host 0.0.0.0 --port 8000 --reload"
    success, _, error = run_command(command)
    
    if success:
        print(f"✅ Web service started in screen session: {session_name}")
        print(f"📺 Attach to session: screen -r {session_name}")
        print(f"🌐 Access: http://your-vps-ip:8000")
        print(f"📱 Detach from session: Ctrl+A, D")
    else:
        print(f"❌ Failed to start web service: {error}")

def stop_bot():
    """Stop Bot screen session"""
    session_name = "tgdrive-bot"
    
    if not is_screen_running(session_name):
        print("🤖 Bot tidak sedang berjalan")
        return
    
    print(f"🛑 Stopping Bot screen session: {session_name}")
    success, _, _ = run_command(f"screen -S {session_name} -X quit")
    
    if success:
        print("✅ Bot stopped successfully!")
    else:
        print("❌ Failed to stop bot")

def stop_web():
    """Stop Web Service screen session"""
    session_name = "tgdrive-web"
    
    if not is_screen_running(session_name):
        print("🌐 Web service tidak sedang berjalan")
        return
    
    print(f"🛑 Stopping Web Service screen session: {session_name}")
    success, _, _ = run_command(f"screen -S {session_name} -X quit")
    
    if success:
        print("✅ Web service stopped successfully!")
    else:
        print("❌ Failed to stop web service")

def restart_web():
    """Quick restart web service"""
    print("🔄 Restarting Web Service...")
    stop_web()
    time.sleep(1)
    start_web()

def status():
    """Show status of screen sessions"""
    print("📊 TG Drive Screen Sessions Status:")
    print("=" * 45)
    
    # Check bot
    if is_screen_running("tgdrive-bot"):
        print("🤖 Bot Telegram: ✅ Running (screen: tgdrive-bot)")
        print("   📺 Attach: screen -r tgdrive-bot")
    else:
        print("🤖 Bot Telegram: ❌ Not running")
    
    # Check web
    if is_screen_running("tgdrive-web"):
        print("🌐 Web Service: ✅ Running (screen: tgdrive-web)")
        print("   📺 Attach: screen -r tgdrive-web")
        print("   📍 URL: http://your-vps-ip:8000")
    else:
        print("🌐 Web Service: ❌ Not running")

def list_sessions():
    """List all screen sessions"""
    print("📺 All Screen Sessions:")
    success, output, _ = run_command("screen -list")
    if success and output.strip():
        print(output)
    else:
        print("No screen sessions found")

def attach_bot():
    """Attach to bot screen session"""
    if is_screen_running("tgdrive-bot"):
        print("📺 Attaching to bot session... (Ctrl+A, D to detach)")
        os.system("screen -r tgdrive-bot")
    else:
        print("🤖 Bot session not running")

def attach_web():
    """Attach to web screen session"""
    if is_screen_running("tgdrive-web"):
        print("📺 Attaching to web session... (Ctrl+A, D to detach)")
        os.system("screen -r tgdrive-web")
    else:
        print("🌐 Web session not running")

def show_help():
    """Show help message"""
    print("""
📺 TG Drive Screen Manager

Usage: python3 screen_manage.py <command>

Commands:
  start-bot        Start Bot di screen session
  start-web        Start Web Service di screen session
  start-all        Start keduanya
  
  stop-bot         Stop Bot screen session
  stop-web         Stop Web Service screen session  
  stop-all         Stop semua screen sessions
  
  restart-web      Quick restart Web Service
  restart-all      Restart keduanya
  
  status           Show status screen sessions
  list             List semua screen sessions
  
  attach-bot       Attach ke bot screen session
  attach-web       Attach ke web screen session

Screen Commands:
  📺 Attach ke session: screen -r <session-name>
  📱 Detach dari session: Ctrl+A, D
  🛑 Kill session: Ctrl+A, K

Examples:
  python3 screen_manage.py start-all     # Start bot + web
  python3 screen_manage.py restart-web   # Quick restart web
  python3 screen_manage.py attach-web    # Lihat web logs real-time
  python3 screen_manage.py status        # Check status
""")

def check_screen_installed():
    """Check if screen is installed"""
    success, _, _ = run_command("which screen")
    if not success:
        print("❌ Screen tidak terinstall!")
        print("📦 Install dengan: sudo apt-get install screen")
        print("   atau: sudo yum install screen")
        return False
    return True

def main():
    if not check_screen_installed():
        return
    
    if len(sys.argv) < 2:
        show_help()
        return
    
    command = sys.argv[1].lower()
    
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
    elif command == "list":
        list_sessions()
    elif command == "attach-bot":
        attach_bot()
    elif command == "attach-web":
        attach_web()
    else:
        print(f"❌ Unknown command: {command}")
        show_help()

if __name__ == "__main__":
    main()