from langchain_ollama import ChatOllama
from langchain_community.document_loaders import TextLoader
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

model=ChatOllama(model="qwen2.5:1.5b")

load_dotenv()

prompt= PromptTemplate(template= 'write a summary for the following messages -n {text}',input_variables=['text'])

parser=StrOutputParser()
'''
loader= WebBaseLoaderLoader(web_path=("https://lilianweng.github.io/posts/2023-06-23-agent/",),
    bs_kwargs=dict(
        parse_only=bs4.SoupStrainer(
            class_=("post-content", "post-title","post-header")
        )
    )
)
'''

loader= TextLoader(file_path="data\\assify_data.txt",encoding="utf-8")

docs= loader.lazy_load()
lis=docs[0].page_content.split("\n")
print(len(lis))
print(lis[:100])

chain= prompt | model | parser

 