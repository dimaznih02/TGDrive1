import asyncio
import signal
import sys
from pathlib import Path
from contextlib import asynccontextmanager
from config import MAIN_BOT_TOKEN
from utils.clients import initialize_clients
from utils.directoryHandler import loadDriveData
from utils.logger import Logger
from utils.extra import reset_cache_dir

logger = Logger(__name__)

async def main():
    """Main function to run only the Telegram bot"""
    if not MAIN_BOT_TOKEN:
        logger.error("MAIN_BOT_TOKEN is not configured. Bot mode cannot start.")
        sys.exit(1)
    
    logger.info("Starting TG Drive Bot Mode (Standalone)")
    
    # Reset the cache directory
    reset_cache_dir()
    
    # Initialize the clients (this will also start the bot)
    await initialize_clients()
    
    logger.info("Bot started successfully. Press Ctrl+C to stop.")
    
    # Keep the bot running
    try:
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        logger.info("Received interrupt signal. Shutting down bot...")
    except Exception as e:
        logger.error(f"Bot error: {e}")
    finally:
        logger.info("Bot stopped.")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Bot shutdown complete.")
    except Exception as e:
        logger.error(f"Failed to start bot: {e}")
        sys.exit(1)