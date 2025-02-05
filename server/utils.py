import os
from model import the_agent
from dotenv import load_dotenv
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from google.cloud import firestore
from langchain_google_firestore import FirestoreChatMessageHistory

load_dotenv()

def chatbot_call(uid, input):

    project_id = os.getenv("PROJECT_ID")

    COLLECTION_NAME = "chatbot_conversations"
    SESSION_ID = uid + "_session"

    prompt_temp = ChatPromptTemplate.from_template(
        ("system", "You are an expert financial advisor. Answer the following question to the best of your abilities {question}")
    )

    client = firestore.Client(project=project_id)

    chat_history = FirestoreChatMessageHistory(
        session_id=SESSION_ID,
        collection=COLLECTION_NAME,
        client=client
    )

    chat_history.add_user_message(input)

    chat_chain = prompt_temp | the_agent | StrOutputParser

    response = chat_chain.invoke({"question" : input})

    chat_history.add_ai_message(response)

    return response

    
print(chatbot_call("user1","What is a mortgage"))

