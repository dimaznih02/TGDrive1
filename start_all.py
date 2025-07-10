#!/usr/bin/env python3
"""
Script untuk menjalankan Web Service dan Bot Telegram TG Drive bersamaan
dalam proses terpisah
"""

import subprocess
import signal
import sys
import time

def signal_handler(sig, frame):
    print('\n🛑 Stopping all services...')
    # Kill all child processes
    for proc in processes:
        proc.terminate()
    
    # Wait for processes to terminate
    for proc in processes:
        proc.wait()
    
    print('✅ All services stopped.')
    sys.exit(0)

def main():
    global processes
    processes = []
    
    print("🚀 Starting TG Drive - Web Service + Bot Telegram")
    print("🌐 Web service: http://0.0.0.0:8000")
    print("🤖 Bot: Telegram bot mode")
    print("⚡ Press Ctrl+C to stop all services")
    print("=" * 60)
    
    # Register signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        # Start web service
        print("🌐 Starting Web Service...")
        web_proc = subprocess.Popen([
            "python3", "start_web.py"
        ])
        processes.append(web_proc)
        time.sleep(2)  # Give web service time to start
        
        # Start bot
        print("🤖 Starting Telegram Bot...")
        bot_proc = subprocess.Popen([
            "python3", "start_bot.py"
        ])
        processes.append(bot_proc)
        
        print("✅ Both services started successfully!")
        print("📝 Logs from both services will appear below:")
        print("-" * 60)
        
        # Wait for processes
        while True:
            # Check if any process has died
            for proc in processes:
                if proc.poll() is not None:
                    print(f"⚠️  A service has stopped unexpectedly (return code: {proc.returncode})")
                    signal_handler(None, None)
            
            time.sleep(1)
            
    except KeyboardInterrupt:
        signal_handler(None, None)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        signal_handler(None, None)

if __name__ == "__main__":
    main()