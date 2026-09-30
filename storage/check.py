import sqlite3
from config import DB_PATH

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

'''
c.execute("""
        SELECT * FROM messages 
        WHERE time_stamp > '2026-05-24T00:00:00'
        AND content LIKE "%sorry%"
        
""")

msg=c.fetchall()

for i in msg:
    print(f'{i[4]} --> {i[5]}')
'''

idd = "0aefa40f76ca919f"


c.execute("""
        SELECT * FROM messages
        WHERE id=?
        """,(idd,))

msg=c.fetchone()

print(msg)