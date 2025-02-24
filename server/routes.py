import os
from model import the_agent
from dotenv import load_dotenv
from google.cloud import firestore
from google.cloud import storage
from langchain_google_firestore import FirestoreChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()
client = storage.Client()

# Chatbot call for conversations
def chatbot_call(uid, input):

    project_id = os.getenv("PROJECT_ID")

    COLLECTION_NAME = "chatbot_conversations"
    SESSION_ID = uid + "_session"

    client = firestore.Client(project=project_id)

    chat_history = FirestoreChatMessageHistory(
        session_id=SESSION_ID,
        collection=COLLECTION_NAME,
        client=client
    )


    chat_history.add_user_message(input)

    prompt_temp = ChatPromptTemplate.from_messages(
        [
            ("system", """You are an expert financial advisor. Answer the question to 
            the best of your abilities: {question}. 
            If you are asked about previous conversations 
            or are asked questions related to previous conversations,
            your action will be to search this chat history: {chat_history}
            Then answer the user's question to the best of your ability.""")
        ]
    )

    chat_chain = prompt_temp | the_agent 
    response = chat_chain.invoke({"question": input, "chat_history": "\n".join([msg.content for msg in chat_history.messages])})

    chat_history.add_ai_message(response['output'])


    return response['output']
        

    


