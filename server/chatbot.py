import os
from model import the_agent
from dotenv import load_dotenv
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from google.cloud import firestore
from langchain_google_firestore import FirestoreChatMessageHistory


def chat(user_id):

    PROJECT_ID = "personal-project-1d32b"
    SESSION_ID = "user" + user_id + "_session"
    COLLECTION_NAME = "chatbot_conversations"



    client = firestore.Client(project=PROJECT_ID)


    chat_history = FirestoreChatMessageHistory(
        session_id=SESSION_ID,
        collection=COLLECTION_NAME,
        client=client
    )

