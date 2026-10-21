"""
==============================================================================
ASSIFY — Root Shortcut: Query messages from Oct 19 onwards
Usage:
    python query_messages.py
    python query_messages.py --export txt
    python query_messages.py --limit 50
==============================================================================
"""

import sys
from pathlib import Path

# Add backend to path and execute main
ROOT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT_DIR))

from backend.query_messages import main

if __name__ == "__main__":
    main()
