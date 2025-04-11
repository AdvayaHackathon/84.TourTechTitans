#!/usr/bin/env python
"""
Run script for the Tourism API FastAPI server
"""
import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", 
                host="0.0.0.0", 
                port=5000, 
                reload=True,
                log_level="info") 