import { useState } from "react"
// axious is used to make http request  form broswer to node js
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const AuthModal = ({ setShowModal,isSignUp}) => {

    const [email, setemail]= useState(null)
    const [password,setpassword]= useState(null)
    const [confirmPassword, setconfirmPassword]= useState(null)
    const [error, setError]=useState(null)
    const [ cookies, setCookie, removeCookie] = useCookies(['user'])

    let navigate=useNavigate()

    console.log(email,password,confirmPassword)
    const handleClick = () => {
        setShowModal(false)
    }
// async function complete his task without blocking excution of program
    const handlesubmit = async(e) =>
    {
        e.preventDefault()
        try{
            if( isSignUp && (password !== confirmPassword)){
                setError('Password need to match!')
                return
            }
            console.log('posting',email,password)
            const response = await axios.post(`http://localhost:8000/${isSignUp ? 'signup' : 'login'}`, {email, password })
            
            setCookie('Authtoken', response.data.token)
            setCookie('UserId', response.data.userId)
        
        const sucess = response.status === 201

        if (sucess && isSignUp) navigate('/onboard');
        if (sucess && !isSignUp) navigate('/dashboard');
        window.location.reload()
        }
        catch(error)
        {
            console.log(error)
        }
    }
    return (

        <div className="auth-modal">
            <div className="close-icon" onClick={handleClick}>X</div>

            <h2>{isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'}</h2>
            <p>By clicking Log In, you agree to our terms. Learn how we process your data in our Privacy Policy and Cookie Policy</p>

            <form onSubmit={handlesubmit}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email"
                    required={true}
                    onChange={(e)=> setemail(e.target.value)}
                />
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    required={true}
                    onChange={(e)=> setpassword(e.target.value)}
                />
                {isSignUp && <input
                    type="password-check"
                    id="password-check"
                    name="password-check"
                    placeholder="confirm password"
                    required={true}
                    onChange={(e)=> setconfirmPassword(e.target.value)}
                />}
                <input className="secondary-button" type="submit"/>
                <p>{error}</p>
            </form>
            <hr/>
            <h2>GET THE APP</h2>
        </div>
    )
}
export default AuthModal