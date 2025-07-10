#!/usr/bin/env python3
"""
🔧 Setup Virtual Environment untuk TG Drive di Ubuntu VPS
Script untuk setup dependencies yang aman di Ubuntu server
"""

import os
import subprocess
import sys

def run_command(command, shell=True):
    """Run command and return success status"""
    try:
        result = subprocess.run(command, shell=shell, check=True, capture_output=True, text=True)
        print(f"✅ {command}")
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ {command}")
        print(f"   Error: {e.stderr}")
        return False, e.stderr
    except Exception as e:
        print(f"❌ {command}")
        print(f"   Error: {e}")
        return False, str(e)

def main():
    print("🔧 Setting up TG Drive Virtual Environment for Ubuntu VPS")
    print("=" * 60)
    
    # Check if already in venv
    if os.environ.get('VIRTUAL_ENV'):
        print("📝 Already in virtual environment:", os.environ.get('VIRTUAL_ENV'))
        install_deps = input("Install dependencies? (y/n): ").lower() == 'y'
        if install_deps:
            print("\n📦 Installing dependencies...")
            success, _ = run_command("pip install -r requirements.txt")
            if success:
                print("\n✅ Dependencies installed successfully!")
                print("\n🚀 Now you can run:")
                print("   python manage.py start-all")
            else:
                print("\n❌ Failed to install dependencies")
        return
    
    print("🐍 Creating virtual environment...")
    
    # Install python3-venv if not available
    print("\n📦 Installing python3-venv (if needed)...")
    run_command("apt update && apt install -y python3-venv python3-pip")
    
    # Create virtual environment
    print("\n🔨 Creating virtual environment...")
    success, _ = run_command("python3 -m venv tgdrive_env")
    if not success:
        print("❌ Failed to create virtual environment")
        return
    
    print("\n✅ Virtual environment created!")
    print("\n📝 Next steps:")
    print("1. Activate virtual environment:")
    print("   source tgdrive_env/bin/activate")
    print("\n2. Install dependencies:")
    print("   pip install -r requirements.txt")
    print("\n3. Start services:")
    print("   python manage.py start-all")
    print("\n📋 Or run the automated script:")
    print("   source tgdrive_env/bin/activate && pip install -r requirements.txt && python manage.py start-all")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n🛑 Setup cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")