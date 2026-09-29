import numpy as np 
import ollama

def cosine_sim(v1,v2) -> float:
    v1 = np.array(v1)
    v2 = np.array(v2)
    dot= np.dot(v1,v2)
    norm1= np.linalg.norm(v1)
    norm2= np.linalg.norm(v2)
    if norm1==0 or norm2==0:
        return 0
    return dot/(norm1*norm2)

def get_real_embeddings(sentence):
    #gets the embedding of the words using ollama nomic-embed-text:v1.5
    return ollama.embeddings(model="nomic-embed-text:v1.5",prompt=sentence)

def cosine_sim_text(text1,text2):
    return cosine_sim(get_real_embeddings(text1).embedding,get_real_embeddings(text2).embedding)


# print(cosine_sim_text("i am sorry","i love you , i was extremely wrong , i didn't mean that"))
