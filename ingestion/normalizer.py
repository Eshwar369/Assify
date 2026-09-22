import uuid
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class MessageObject:
    contact_name: str
    platform: str
    timestamp: datetime
    sender: str
    content: str
    id: str = field(default_factory=uuid.uuid4)
    media_type: str = "text"
    media_path: str = None
    embedding_id: str = None
    

    def days_ago(self) ->float:
        "How many days old this msg was"
        return (datetime.now() - self.timestamp).total_seconds() / 86400.0
    

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "contact_name": self.contact_name,
            "platform": self.platform,
            "timestamp": self.timestamp,
            "sender": self.sender,
            "content": self.content,
            "media_type": self.media_type,
            "media_path": self.media_path,
            "embedding_id": self.embedding_id,
        }