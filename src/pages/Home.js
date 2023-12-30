import Nav from "../component/Nav"
import AuthModal from "../component/AuthModal"
import { useState } from "react"
const Home =()=>{
    
    const[showModal,setShowModal]= useState(false)
    const[isSignUp,setisSignUp]=useState(true)

    const authToken=false

    const handleClick=()=>{
        setShowModal(true)
        setisSignUp(true)
    }
    return (
        <div className="overlay">
        <Nav minimal ={false} 
            setShowModal={setShowModal}
            showModal={showModal}
            setisSignUp={setisSignUp}/>

        <div className="home">
            <h1 className="primary-title">FIND YOUR TECHMATE!!</h1>

            <button className="primary-button" onClick={handleClick}>
                {authToken ?'Signout' : 'Create Account'}
            </button>

            {showModal && (<AuthModal setShowModal={setShowModal} isSignUp={isSignUp}/>)}

        </div>
        </div>
    )
}
export default Home