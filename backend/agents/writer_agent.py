from langchain_core.output_parsers import StrOutputParser

from services.llm import llm
from services.prompts import writer_prompt


writer_chain = (
    writer_prompt
    | llm
    | StrOutputParser()
)