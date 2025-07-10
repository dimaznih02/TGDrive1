#!/usr/bin/env python3
"""
🧪 Quick Test Script - Troubleshoot TG Drive Issues
"""

import os
import subprocess
import sys

def test_basic():
    """Test basic Python and imports"""
    print("🐍 Testing Basic Python...")
    
    # Test Python version
    print(f"   Python version: {sys.version}")
    
    # Test basic imports
    try:
        import fastapi
        print("   ✅ FastAPI available")
    except ImportError:
        print("   ❌ FastAPI missing - Run: pip3 install fastapi --break-system-packages")
        return False
    
    try:
        import uvicorn
        print("   ✅ Uvicorn available")
    except ImportError:
        print("   ❌ Uvicorn missing - Run: pip3 install uvicorn --break-system-packages")
        return False
    
    return True

def test_env():
    """Test .env file"""
    print("\n🔧 Testing Environment...")
    
    if not os.path.exists('.env'):
        print("   ❌ .env file missing!")
        return False
    
    print("   ✅ .env file exists")
    
    # Load and check basic vars
    try:
        from dotenv import load_dotenv
        load_dotenv()
        
        api_id = os.getenv('API_ID')
        if api_id:
            print(f"   ✅ API_ID: {api_id}")
        else:
            print("   ❌ API_ID missing")
            return False
            
        storage_channel = os.getenv('STORAGE_CHANNEL')
        if storage_channel:
            print(f"   ✅ STORAGE_CHANNEL: {storage_channel}")
        else:
            print("   ❌ STORAGE_CHANNEL missing")
            return False
            
    except ImportError:
        print("   ❌ python-dotenv missing - Run: pip3 install python-dotenv --break-system-packages")
        return False
    
    return True

def test_manual_uvicorn():
    """Test starting uvicorn manually"""
    print("\n🚀 Testing Manual Uvicorn Start...")
    
    # Test import web_main
    try:
        print("   Testing import web_main...")
        result = subprocess.run([
            "python3", "-c", "import web_main; print('Import successful')"
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            print("   ✅ web_main imports successfully")
        else:
            print(f"   ❌ Import error: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print("   ❌ Import timeout - possible hanging")
        return False
    except Exception as e:
        print(f"   ❌ Import test failed: {e}")
        return False
    
    # Try to start uvicorn briefly
    print("   Starting uvicorn for 3 seconds...")
    try:
        process = subprocess.Popen([
            "python3", "-m", "uvicorn", "web_main:app", 
            "--host", "0.0.0.0", "--port", "8000"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Wait 3 seconds
        import time
        time.sleep(3)
        
        if process.poll() is None:
            print("   ✅ Uvicorn started successfully!")
            print("   🌐 Website should be accessible at: http://209.74.83.188:8000")
            
            # Kill the process
            process.terminate()
            process.wait()
            return True
        else:
            stdout, stderr = process.communicate()
            print("   ❌ Uvicorn failed to start")
            print(f"   Stdout: {stdout.decode()}")
            print(f"   Stderr: {stderr.decode()}")
            return False
            
    except Exception as e:
        print(f"   ❌ Uvicorn test failed: {e}")
        return False

def show_process_info():
    """Show current processes"""
    print("\n📋 Current Python Processes:")
    try:
        result = subprocess.run([
            "ps", "aux"
        ], capture_output=True, text=True)
        
        lines = result.stdout.split('\n')
        python_lines = [line for line in lines if 'python' in line.lower() and 'grep' not in line]
        
        if python_lines:
            for line in python_lines:
                print(f"   {line}")
        else:
            print("   No Python processes found")
            
    except Exception as e:
        print(f"   Error checking processes: {e}")

def main():
    print("🧪 TG Drive Quick Test")
    print("=" * 40)
    
    success = True
    
    # Test basic imports
    if not test_basic():
        success = False
    
    # Test environment
    if not test_env():
        success = False
    
    # Show current processes
    show_process_info()
    
    # If basics are OK, test uvicorn
    if success:
        if test_manual_uvicorn():
            print("\n🎉 SUCCESS!")
            print("   All tests passed - website should be working")
            print("   🌐 Try: http://209.74.83.188:8000")
        else:
            print("\n❌ UVICORN FAILED")
            print("   Basic setup OK but uvicorn won't start")
            success = False
    
    if not success:
        print("\n🔧 QUICK FIXES:")
        print("   1. Install missing packages:")
        print("      pip3 install fastapi uvicorn python-dotenv aiofiles aiohttp --break-system-packages")
        print("   2. Check .env file exists and has correct values")
        print("   3. Run this test again")
        print("   4. If still failing, run: python3 debug_services.py")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n🛑 Test cancelled")
    except Exception as e:
        print(f"\n❌ Test error: {e}")
        print("🔧 Try running: python3 web_main.py")
        print("   to see detailed error messages")