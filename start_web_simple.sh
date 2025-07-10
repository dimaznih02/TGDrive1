#!/bin/bash
export PATH="/home/ubuntu/.local/bin:$PATH"
cd /workspace
python3 -m uvicorn web_main:app --host 0.0.0.0 --port 8000 --reload
