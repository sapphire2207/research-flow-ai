from langchain_core.output_parsers import StrOutputParser

from services.llm import llm
from services.prompts import critic_prompt


critic_chain = (
    critic_prompt
    | llm
    | StrOutputParser()
)