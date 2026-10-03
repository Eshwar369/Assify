import ollama
from openai import OpenAI

import ollama
class OllamaLLM():
    def __init__(self,model:str, format:str=""):

        self.model=model
        self.format=format
    def chat(self, messages:list[dict]):
        response =ollama.chat(model=self.model,messages=messages,format=self.format)
        return response['message']['content']
class OpenAILLM:
    def __init__(self,model,format:str=''):
        self.client =OpenAI()
        self.model=model
        self.format=format
    def chat(self,messages:list[dict]):
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,   response_format={"type": "json_object"} if self.format=="json" else None)
        return response.choices[0].message.content

        