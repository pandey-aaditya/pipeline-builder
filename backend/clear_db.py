import os
import sys

db_file = "pipelines.db"

if os.path.exists(db_file):
    os.remove(db_file)
    print(f"✓ Database '{db_file}' cleared successfully")
else:
    print(f"✗ Database '{db_file}' not found")
