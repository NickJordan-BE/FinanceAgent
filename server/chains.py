import os
from model import the_agent
from dotenv import load_dotenv
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate

load_dotenv()

output_parser = StrOutputParser()

def categorize_spending(amount, company):

    prompt = PromptTemplate.from_template("""Categorize this transaction into a spending category based on this amount: 
                                          {amount}, and this company: {company}. Only return the category.""")

    chain = prompt | the_agent

    try:
        result = chain.invoke({"amount": amount, "company": company})
    except Exception as e:
        return e

    return result['output']

def analyze_spending(logs):
    research_prompt = PromptTemplate.from_template("""Search on good and bad spending habits. Provide an in-depth analysis of what constitutes good spending habits and what are considered bad spending habits in terms of financial management. Make sure to highlight specific examples of good practices and common pitfalls. The output should focus on financial behaviors that help individuals improve their financial health and avoid costly mistakes. This will serve as the foundation for analyzing individual spending habits.""")
    
    analysis_prompt = PromptTemplate.from_template("""Analyze the user's spending habits based on the provided spending logs {logs}. Use this research: {research} to compare and evaluate the user's behavior. Return the results as a Python dictionary with the following fields: feedback (a detailed explanation of the user's spending habits with suggestions for improvement), good_habits (a dictionary listing the user's good spending habits, or an explanation on how to create good habits based on the categories in the logs if none are found), ratings (a dictionary with the following fields: investing (a rating from 1 to 5 for the user's investment habits with an explanation for the rating), saving (a rating from 1 to 5 for the user's saving habits with an explanation for the rating), spending (a rating from 1 to 5 for the user's spending habits with an explanation for the rating)), and spending_stats (a dictionary with the following fields: least_spent (the least amount of money spent in a day), most_spent (the most money spent in a day), and total (the total amount of money spent)). Do not include any extra formatting or code block markings. Only provide the Python dictionary without any markdown or other extra formatting. Output when finished.""")
    log_string = ""
    
    for index, log in logs:
        add = "LOG: " + "Amount: " + str(log["amount"]) + " Category: " + log["category"] + " Company: " + log["company"]
        log_string += add

    
    research_chain = research_prompt | the_agent
    analysis_chain = analysis_prompt | the_agent

    try:
        research = research_chain.invoke({"input": ""})['output']
        analysis = analysis_chain.invoke({"logs": log_string, "research": research})
    except Exception as e:
        return e

    return analysis["output"]
