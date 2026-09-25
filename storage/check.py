import sqlite3

conn=sqlite3.connect("storage/allmessages.db")
c=conn.cursor()

c.execute("""
        SELECT * FROM messages 
        WHERE time_stamp > '2026-05-24T00:00:00'
        AND content LIKE "%sorry%"
        
""")

msg=c.fetchall()

for i in msg:
    print(f'{i[4]} --> {i[5]}')
