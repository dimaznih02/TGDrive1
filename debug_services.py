#!/usr/bin/env python3
"""
🔍 TG Drive Debug Script
Script untuk mencari tahu kenapa services tidak berjalan
"""

import os
import subprocess
import sys
import time
import socket

def run_cmd(command):
    """Run command and return output"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=10)
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return False, "", "Command timeout"
    except Exception as e:
        return False, "", str(e)

def check_port(port, host='127.0.0.1'):
    """Check if port is listening"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except:
        return False

def check_dependencies():
    """Check if all required dependencies are available"""
    print("📦 Checking Dependencies...")
    
    deps = [
        'fastapi', 'uvicorn', 'aiofiles', 'aiohttp', 
        'pyrogram', 'tgcrypto', 'python-dotenv'
    ]
    
    missing = []
    for dep in deps:
        try:
            __import__(dep.replace('-', '_'))
            print(f"   ✅ {dep}")
        except ImportError:
            print(f"   ❌ {dep} - MISSING")
            missing.append(dep)
    
    return len(missing) == 0, missing

def check_env_file():
    """Check .env file"""
    print("\n🔧 Checking Environment...")
    
    if not os.path.exists('.env'):
        print("   ❌ .env file not found")
        return False
    
    print("   ✅ .env file exists")
    
    # Check required vars
    from dotenv import load_dotenv
    load_dotenv()
    
    required_vars = [
        'API_ID', 'API_HASH', 'BOT_TOKENS', 'STORAGE_CHANNEL',
        'DATABASE_BACKUP_MSG_ID', 'MAIN_BOT_TOKEN'
    ]
    
    missing_vars = []
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            missing_vars.append(var)
            print(f"   ❌ {var} - Missing")
        else:
            print(f"   ✅ {var} - OK")
    
    return len(missing_vars) == 0, missing_vars

def check_files():
    """Check if required files exist"""
    print("\n📁 Checking Files...")
    
    required_files = [
        'web_main.py', 'bot_main.py', 'config.py',
        'utils/clients.py', 'utils/directoryHandler.py'
    ]
    
    missing_files = []
    for file in required_files:
        if os.path.exists(file):
            print(f"   ✅ {file}")
        else:
            print(f"   ❌ {file} - MISSING")
            missing_files.append(file)
    
    return len(missing_files) == 0, missing_files

def test_manual_start():
    """Test manual start of web service"""
    print("\n🧪 Testing Manual Web Service Start...")
    
    # Test web_main.py import
    success, stdout, stderr = run_cmd("python3 -c 'import web_main; print(\"Import OK\")'")
    if not success:
        print(f"   ❌ Import error: {stderr}")
        return False
    else:
        print("   ✅ web_main.py imports successfully")
    
    # Test config import
    success, stdout, stderr = run_cmd("python3 -c 'import config; print(\"Config OK\")'")
    if not success:
        print(f"   ❌ Config error: {stderr}")
        return False
    else:
        print("   ✅ config.py imports successfully")
    
    return True

def check_processes():
    """Check running processes"""
    print("\n🔍 Checking Running Processes...")
    
    # Check for python processes
    success, stdout, stderr = run_cmd("ps aux | grep -E '(python3|uvicorn|bot_main|web_main)' | grep -v grep")
    if stdout.strip():
        print("   📋 Running Python processes:")
        for line in stdout.strip().split('\n'):
            print(f"      {line}")
    else:
        print("   ❌ No TG Drive processes running")
    
    # Check port 8000
    if check_port(8000):
        print("   ✅ Port 8000 is listening")
    else:
        print("   ❌ Port 8000 is NOT listening")
    
    return check_port(8000)

def test_direct_uvicorn():
    """Test starting uvicorn directly"""
    print("\n🚀 Testing Direct Uvicorn Start...")
    
    print("   Starting uvicorn web_main:app for 5 seconds...")
    process = subprocess.Popen([
        "python3", "-m", "uvicorn", "web_main:app", 
        "--host", "0.0.0.0", "--port", "8000"
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    time.sleep(5)
    
    if process.poll() is None:
        print("   ✅ Uvicorn started successfully")
        print("   🌐 Test: http://209.74.83.188:8000")
        
        # Test port
        if check_port(8000):
            print("   ✅ Port 8000 is now listening!")
        else:
            print("   ❌ Port 8000 still not accessible")
        
        # Kill process
        process.terminate()
        process.wait()
        return True
    else:
        stdout, stderr = process.communicate()
        print(f"   ❌ Uvicorn failed to start")
        print(f"   Error: {stderr.decode()}")
        return False

def main():
    print("🔍 TG Drive Services Debug Report")
    print("=" * 50)
    
    issues = []
    
    # Check dependencies
    deps_ok, missing_deps = check_dependencies()
    if not deps_ok:
        issues.append(f"Missing dependencies: {', '.join(missing_deps)}")
    
    # Check environment
    env_ok, missing_vars = check_env_file()
    if not env_ok:
        issues.append(f"Missing environment variables: {', '.join(missing_vars)}")
    
    # Check files
    files_ok, missing_files = check_files()
    if not files_ok:
        issues.append(f"Missing files: {', '.join(missing_files)}")
    
    # Test imports
    import_ok = test_manual_start()
    if not import_ok:
        issues.append("Import errors detected")
    
    # Check processes
    processes_ok = check_processes()
    if not processes_ok:
        issues.append("No services running on port 8000")
    
    # Test direct uvicorn if everything else looks good
    if deps_ok and env_ok and files_ok and import_ok:
        uvicorn_ok = test_direct_uvicorn()
        if not uvicorn_ok:
            issues.append("Uvicorn fails to start")
    
    print("\n" + "=" * 50)
    print("📊 DIAGNOSIS SUMMARY")
    print("=" * 50)
    
    if not issues:
        print("✅ All checks passed!")
        print("🚀 Services should be working")
        print("🌐 Try: http://209.74.83.188:8000")
    else:
        print("❌ Issues found:")
        for i, issue in enumerate(issues, 1):
            print(f"   {i}. {issue}")
        
        print("\n🔧 RECOMMENDED FIXES:")
        if missing_deps:
            print(f"   pip3 install {' '.join(missing_deps)} --break-system-packages")
        if missing_vars:
            print("   Check your .env file configuration")
        if missing_files:
            print("   Ensure all project files are present")
        print("   Then run: python3 manage.py start-all")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ Debug script error: {e}")
        print("🔧 Try running: python3 -c 'import sys; print(sys.path)'")