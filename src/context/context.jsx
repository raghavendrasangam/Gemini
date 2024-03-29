import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) =>{
    ///get input from user and display the prompt message
    const [input,setInput] = useState("");
    const [recentPrompt,setRecentPrompt] = useState("");
    const [prevPrompts,setPrevPrompts] = useState([]);
    const [showResult,setShowResult] = useState(false);
    const [loading,setLoading] = useState(false);
    const [resultData,setResultData] = useState("");

    //text display with typing effect
    const delayPara = (index,nextWord) => {
            setTimeout(function () {
                setResultData(prev =>prev+nextWord);
            },75*index)
    }

    //newchat
    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }
    

    const onSent = async (prompt) =>{

        setResultData("") //result data will be reset
        setLoading(true)  //display loading animation
        setShowResult(true)
        let response;
        if(prompt !== undefined) {
            response =await runChat(prompt);
            setRecentPrompt(prompt)
        }
        else
        {
            setPrevPrompts(prev=>[...prev,input])   
            setRecentPrompt(input)
            response = await runChat(input)
        }
        // setRecentPrompt(input)
    //     setPrevPrompts(prev=>[...prev,input])
    //    const response = await runChat(input) //takes input from the user and stores in response variable

       // adding bold and removing start
       let responseArray = response.split("**");
       let newResponse = "";
       for(let i=0; i < responseArray.length; i++)
       {
            if (i===0 || i%2 !== 1){
                newResponse += responseArray[i];
            }
            else {
                newResponse += "<b>" + responseArray[i] +"</b>"
            }
       }

       //adding new line
       let newResponse2 = newResponse.split("*").join("</br>")

       //setResultData(newResponse2)
       let newResponseArray = newResponse2.split(" ");
       for(let i=0; i<newResponseArray.length; i++)
       {
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ")
       }
       setLoading(false)
       setInput("") //input field will be reset
    }

    const contextValue ={
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider