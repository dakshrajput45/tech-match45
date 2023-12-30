import TinderCard from 'react-tinder-card'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import ChatContainer from '../component/ChatContainer'
import axios from 'axios'
//import { dblClick } from "@testing-library/user-event/dist/click"


const Dashboard =()=>{
    
    const[user,setUser] = useState(null)
    const [Seekusers,setSeekusers]= useState(null)
    const [lastdirection, setLastDirection]=useState()
    const[cookies,setCookie,removeCookie]=useCookies(['user'])

    const userId = cookies.UserId

    

    const getuser = async() =>{
        try{
            const response = await axios.get('http://localhost:8000/user', {
                params: {userId}
            })
            setUser(response.data)
            await getSeekuser(response.data?.seek)
        }catch(error){
            console.log(error)
        }
    }

    console.log(user)
    console.log(user?.seek)
    const getSeekuser = async(seek) =>
    {
        try{
            const response = await axios.get('http://localhost:8000/seek-user', {
                params:{seeked: seek}
            })
            setSeekusers(response.data) 
        }catch(error)
        {
            console.log(error)
        }
    }

    //console.log(seeked)
    useEffect(()=>{
        getuser()
    },[])


    const updateMatches = async(matchedUserId) =>
    {
        try{
            await axios.put('http://localhost:8000/addmatch',{
                userId,
                matchedUserId
            }) 
            getuser()
        }catch(error){
            console.log(error)
        }
    }

    const swiped = (direction, swipedUserId) => {

        if(direction === 'right')
        {
            updateMatches(swipedUserId)
        }
        setLastDirection(direction)
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    const matchedUserIds = user?.matches?.map(({user_id})=> user_id).concat(userId)
    const filteredSeekedUser = Seekusers?.filter(character => !matchedUserIds.includes(character.user_id)) || []

    return (
        <>
        {user &&
        <div className="dash">
            <ChatContainer user={user}/>
            <div className="swipe-container">
            <div className="card-container">
            {filteredSeekedUser?.map((character) =>
                <TinderCard
                    className="swipe"
                    key={character.user_id }
                    onSwipe={(dir) => swiped(dir, character.user_id)}
                    onCardLeftScreen={() => outOfFrame(character.first_name)}>
                    <div
                        style={{backgroundImage: "url(" + character.url + ")"}}
                        className="card">
                        <div className="bottom-left">
                        <p>{character.first_name.charAt(0).toUpperCase() + character.first_name.slice(1)}</p>

                        {character?.haveproject === 'NO' && (
                            <div>
                            <p>Skills: {character.skills}</p>
                            <p>Interests: {character.interests}</p>
                            </div>
                        )}
                        {character?.haveproject === 'YES' && (
                            <div>
                            <p>Project Name: {character.projectName}</p>
                            <p>Project Description: {character.projectDescription}</p>
                            <p>Skills Required: {character.skillRequired}</p>
                            </div>
                        )}
                        </div>
                        </div>
                </TinderCard>
            )}
            <div className='swipe-info'>
                {lastdirection ? <p>You Swiped {lastdirection}</p>:<p/>}
            </div>
            </div>
            </div>
        </div>}
        </>
    )
}
export default Dashboard