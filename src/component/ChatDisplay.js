import axios from "axios";
import Chat from "./Chat";
import ChatInput from "./ChatInput";
import { useEffect, useState } from "react";

const ChatDisplay = ({user, clickedUser}) => {
    const [userMessages,setuserMessages]=useState(null)
    const [clickedUsermessages,setClickedUserMessages]=useState(null)
    const userId=user?.user_id
    const clickedUserId = clickedUser?.user_id

    const getUserMessages = async()=>
    {
        try{
            const response = await axios.get('http://localhost:8000/messages',{
                params: {userId: userId, correspondingUserId: clickedUserId}
            })
            setuserMessages(response.data)
        }catch(error)
        {
            console.log(error)
        }
    }
    const getClickedUserMessages = async() =>
    {
        try{
            const response = await axios.get('http://localhost:8000/messages',{
                params: {userId: clickedUserId, correspondingUserId: userId}
            })
            setClickedUserMessages(response.data)
        }catch(error)
        {
            console.log(error)
        }
    } 

    useEffect(()=>{
        getUserMessages()
        getClickedUserMessages()
    },[])

    const messages=[]

    userMessages?.forEach(message => {
        const formattedMessages ={}
        formattedMessages['name']= user?.first_name
        formattedMessages['img']= user?.url
        formattedMessages['message']= message.message
        formattedMessages['timestamp']=message.timestamp
        messages.push(formattedMessages)
    })
    clickedUsermessages?.forEach(message => {
        const formattedMessages ={}
        formattedMessages['name']= clickedUser?.first_name
        formattedMessages['img']= clickedUser?.url
        formattedMessages['message']= message.message
        formattedMessages['timestamp']=message.timestamp
        messages.push(formattedMessages)
    })
    const decendingOrderMessages = messages?.sort((a,b) => a.timestamp.localeCompare(b.timestamp)) 

    return (
        <>
        <Chat decendingOrderMessages={decendingOrderMessages}/>
        <ChatInput
        user={user}
        clickedUser={clickedUser}
        getUserMessages={getUserMessages}
        getClickedUsersMessages={getClickedUserMessages}/>
        </>
    )
}
export default ChatDisplay;