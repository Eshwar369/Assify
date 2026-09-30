import sqlite3
from config import DB_PATH

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()


c.execute("""
        SELECT * FROM messages 
        WHERE time_stamp > '2026-09-29 00:00:00'
        
""")

msg=c.fetchall()
for i in msg:
    if(i[4]=="them"):
        print(f'{i[1]} |{i[3]}|--> {i[5]}')
    else:
        print(f'{i[4]} |{i[3]}| --> {i[5]}')




'''idd = "0aefa40f76ca919f"


c.execute("""
        SELECT * FROM messages
        WHERE id=?
        """,(idd,))

msg=c.fetchone()

print(msg)'''