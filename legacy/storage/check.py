import sqlite3
from config import DB_PATH,DATA_PATH
from ingestion.whatsapp_parser import parse_whatsapp_file
from storage.sqlsaving import save_to_sql,connect_database

"""    msgs=parse_whatsapp_file(DATA_PATH)
    conn,c=connect_database(DB_PATH)
    save_to_sql(msgs,conn,c)
    """
if __name__=="__main__":
        msgs=parse_whatsapp_file(DATA_PATH)
        conn,c=connect_database(DB_PATH)
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