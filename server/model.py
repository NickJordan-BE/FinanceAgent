from dotenv import load_dotenv
from langchain_community.tools import TavilySearchResults, DuckDuckGoSearchResults
from langchain_openai import ChatOpenAI
from langchain.agents import initialize_agent, AgentType

# load env files
load_dotenv()

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0
)

ddg_search = DuckDuckGoSearchResults(handle_tool_error=True)
ta_search = TavilySearchResults(max_results=2)
# ask_news_search = AskNewsSearch(k=1)
# fmp_toolkit = FMPDataToolkit(
#     query="Financial Analysis and Financial Knowledge",
#     num_results=2
# )
# fmp_tool = fmp_toolkit.get_tools()


tools = [ddg_search, ta_search]

the_agent = initialize_agent(
    tools=tools,
    agent_type= AgentType.OPENAI_MULTI_FUNCTIONS,
    llm=llm,
    verbose=True,
    handle_parsing_errors=True,
    max_iterations=15
)






