from sys import platform
import __main__
from ingestion.normalizer import MessageObject , generate_msg_id
import re
from datetime import datetime


pattern = re.compile(
    r"^(?P<date>\d{2}/\d{2}/\d{4}),\s(?P<time>\d{2}:\d{2})\s-\s(?P<sender>[^:]+):\s(?P<message>.*)$"
)

test_lines = [
    "06/05/2026, 14:01 - Sleepless Zombiee: Hi Eshwar",
    "06/05/2026, 14:02 - Sleepless Zombiee: Surgery annav kada ",
    "Em kaadu everything will be alright take care get well soon❤️ <This message was edited>",
    "09/05/2026, 20:26 - *: I will call you in an hour,"
]


def parse_whatsapp_text(lines: list[str], contact_name:str,my_name:str):
    msg_list=[]
    current_msg=None
    for line in lines:
        match = pattern.match(line)
        if match:
            msg_list.append(current_msg)
            date_str= match.group("date")
            time_str= match.group("time")
            sender = match.group("sender")
            content = match.group("message")

            current_msg={
                "date_str":date_str,
                "time_str":time_str,
                "sender":sender,
                "content":content
            }
        else:
            if current_msg:
                current_msg["content"] += "\n" + line
    msg_list.append(current_msg)
    final_normalized=[]
    for cmsg in msg_list:
        if cmsg is None:
            continue
        else:
            date_str= f"{cmsg['date_str']} {cmsg['time_str']}"
            ts = datetime.strptime(date_str, "%d/%m/%Y %H:%M")
            sender=cmsg["sender"]
            if(my_name):
                sender="me" if sender==my_name else "them"
            else:
                sender="them" if contact_name=="*" else contact_name
            
            
            msgId=generate_msg_id(contact_name,ts,sender, cmsg['content'])

            Msg_obj=MessageObject(
                id=msgId,
                contact_name=contact_name,
                platform="whatsapp",
                time_stamp=ts,
                sender=sender,
                content=cmsg["content"],
            )
            final_normalized.append(Msg_obj)
    return final_normalized
    
results = parse_whatsapp_text(test_lines,   
contact_name="Sleepless Zombiee", my_name="*")
for m in results:
    print(m)

    
def parse_whatsapp_file(file_path: str, contact_name: str, my_name:  str) -> list[MessageObject]:
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    return parse_whatsapp_text(lines, contact_name, my_name)


if __name__ == "__main__":
    file_path= "data/assify_data.txt"
    contact_name ="Sleepless Zombiee"
    my_name = "*"
    print("Parsing WhatsApp export...")
    messages = parse_whatsapp_file(file_path, contact_name,my_name)
    
    print(f"Total messages successfully parsed: {len(messages)}")
    
"""    print("\n--- First 3 messages ---")
    for m in messages[:3]:
        print(f"[{m.time_stamp}] {m.sender}: {m.content}")
        
    print("\n--- Last 3 messages ---")
    for m in messages[-3:]:
        print(f"[{m.times_tamp}] {m.sender}: {m.content}")
"""