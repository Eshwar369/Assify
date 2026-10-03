from ingestion.normalizer import blobed_obj
import datetime

#inputs are message objects from parse

def classify_burst(msgs):
    blobs=[]
    active_episode=[]
    prev_time=None
    for msg in msgs:
        if (prev_time is not None and (msg.time_stamp-prev_time) >datetime.timedelta(minutes=20)) :
            blobs.append(active_episode)
            active_episode=[]
        elif  len(active_episode) > 20:
            blobs.append(active_episode)
            active_episode=active_episode[-3:]
        active_episode.append(msg)
        prev_time=msg.time_stamp
    
    if active_episode:
        blobs.append(active_episode)
    return blobs


def blob_creation(burst_id: str,blob: str=""):
    start_time = blob[0].time_stamp
    end_time = blob[-1].time_stamp

    content_lines = []
    msg_ids=[]
    platform=blob[0].platform or "Whatsapp"
    contact_name=blob[0].contact_name or "Sleepless Zombiee"
    for msg in blob:
        msg_ids.append(msg.id)
        line = f"{msg.sender}: {msg.content}\n"
        content_lines.append(line)
    
    full_content = "".join(content_lines)
    return blobed_obj(id=burst_id,full_content=full_content,msg_ids=msg_ids,platform=platform,contact_name=contact_name,start_time=start_time,end_time=end_time)
