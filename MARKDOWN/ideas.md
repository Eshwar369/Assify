 
## income for the assify
- we can earn money through ads displaying in app , but this is not good architecture
- secondly we can charge for using the app
    which is also not of my liking , i wnat the app to be free
- we can give insites of what the person is going to buy and run targeted ads onthem , i mean give that info to who runs the ads.





## new features ideas
- we can remeber what type of gift the other person likes
- we can suggest those gifts by telling , and also run customised adds
- we can similarly tell about the dresses that the ohter person mentions that she likes, and save that for reference and suggest him to buy,
- maybe she said once she liked bangles, or earrings form some link etc

## modifications
- whatsapp messages are broken into 4-5 small messages like "hey", "you awake?", so vector search might miss full context. we can find the matching message using vector search, and then pull 5 messages before and after it from sql using timestamp so the llm gets the full chat.
- embedding 14k messages takes 5 mins. instead we can just embed the latest 500 messages first so user can start chatting in 2 seconds, and embed the old messages in the background.
- filter out 1-2 word useless messages like "ok", "k", "hmmm", "👍" so we dont waste time embedding them.
- cache all vectors in RAM (40mb numpy matrix) on startup so we dont read from sqlite disk on every search, making searches take 1-2ms.
