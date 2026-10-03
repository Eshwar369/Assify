import ollama
from openai import OpenAI
from config import LLM_PROVIDER
import litellm



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

def get_llm(model:str= None,provider:str=LLM_PROVIDER,format:str=""):
    provider= provider or LLM_PROVIDER
    if provider=="ollama":
        return OllamaLLM(model,format)
    elif provider=="openai":
        return OpenAILLM(model,format)
    else:
        # to integrate litellm
        return None