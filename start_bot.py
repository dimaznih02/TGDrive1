#!/usr/bin/env python3
"""
Script untuk menjalankan Bot Telegram TG Drive secara terpisah
"""

import os
import sys

def main():
    print("🤖 Starting TG Drive Telegram Bot...")
    print("📱 Bot akan terhubung ke Telegram")
    print("🔄 Web service akan berjalan terpisah")
    print("⚡ Press Ctrl+C to stop")
    print("-" * 50)
    
    try:
        os.system("python bot_main.py")
    except KeyboardInterrupt:
        print("\n🛑 Bot stopped.")
    except Exception as e:
        print(f"\n❌ Error starting bot: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()