import uuid
from dataclasses import dataclass, field
from datetime import datetime
import hashlib


def generate_msg_id(contact_name: str, time_stamp_str: str, sender: str, content: str) -> str:
    raw = f"{contact_name}|{time_stamp_str}|{sender}|{content}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:16]


@dataclass
class MessageObject:
    id= str
    contact_name: str
    platform: str
    time_stamp: datetime
    sender: str
    content: str
    id: str 
    media_type: str = "text"
    media_path: str = None
    embedding_id: str = None
    

    def days_ago(self) ->float:
        "How many days old this msg was"
        return (datetime.now() - self.time_stamp).total_seconds() / 86400.0
    

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "contact_name": self.contact_name,
            "platform": self.platform,
            "time_stamp": self.time_stamp,
            "sender": self.sender,
            "content": self.content,
            "media_type": self.media_type,
            "media_path": self.media_path,
            "embedding_id": self.embedding_id,
        }

