#!/usr/bin/env python3
"""
Script untuk menjalankan Web Service TG Drive secara terpisah
"""

import os
import sys

def main():
    print("🌐 Starting TG Drive Web Service...")
    print("📍 Web service will be available at: http://0.0.0.0:8000")
    print("🔄 Bot Telegram akan berjalan terpisah")
    print("⚡ Press Ctrl+C to stop")
    print("-" * 50)
    
    try:
        os.system("uvicorn web_main:app --host 0.0.0.0 --port 8000 --reload")
    except KeyboardInterrupt:
        print("\n🛑 Web service stopped.")
    except Exception as e:
        print(f"\n❌ Error starting web service: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()