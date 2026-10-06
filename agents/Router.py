from agents.llm_provider import get_llm

class Router():
    def __init__(self):
        pass

    def Route(self,query:str =""):



        '''
        so first should return
        1. which to call "skip, timed, memory, start-end messages"
        2. this should be the output of the json file of the llm
        3. this decides the logic
        
        '''
        router_prompt="""
        YOU are a llm router, your output is to be like
            {
            "route": ["TIMED", "UNTIMED" , "SQL" , "SKIP","NMESSAGES"],
            "target_query": "cleaned search keywords or null",
            "time_hint": "raw time phrase like 'yesterday' or null",
            "limit": "the number of messages to be capped from the SQL database ",
            "reason": "1-sentence explanation"
            }
            here route should be only choose form those 4 categories
            if none of the categories match then return "SKIP"
            TIMED is when the search depends also on recency of the events happended
            UNTIMED is when the search depends on events more than the time when it took in the messages
            SQL is when the search depends on when the user is asking for or about message in certain time
            NMESSAGES is when the user askes for the last n messages for an agent.
            SKIP is when no retrieval is required and the query is general
            target_query is required for timed adn untimed, it should contain what should be searched in for retrieval , jsut the exact text no extra workds.
        
        """
        llm=get_llm(format="json")
        response =llm.chat([
            {"role":"system", "content":router_prompt},
            {"role":"user", "content":query}
        ])
        return response
        
    
if __name__ == "__main__":
    r=Router()
    exit=["exit","quit"]
    print("type quit or exit to exit")
    print ("-"*20)
    query=input("YOU ")
    while query not in exit:
        print(r.Route(query))
        print("-"*20)
        query=input("YOU ")
