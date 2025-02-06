from dotenv import load_dotenv
from langchain_community.tools import TavilySearchResults, DuckDuckGoSearchResults
from langchain_openai import ChatOpenAI
from langchain.agents import initialize_agent, AgentType


load_dotenv()

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0
)

ddg_search = DuckDuckGoSearchResults()
ta_search = TavilySearchResults(max_results=2)

tools = [ddg_search, ta_search]

the_agent = initialize_agent(
    tools=tools,
    agent_type= AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
    llm=llm,
    verbose=True,
    handle_parsing_errors=True
)






