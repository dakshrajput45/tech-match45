import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Onboard from "./pages/Onboard"
import {BrowserRouter,Routes,Route} from "react-router-dom"
import { useCookies } from 'react-cookie'


const App=()=> {

  const[cookie,setCookie,removeCookie] = useCookies(['user'])

  const authToken = cookie.Authtoken
  console.log('AuthToken:', authToken);

  return (
    <BrowserRouter>
    <Routes>
      <Route path={"/"} element={<Home/>}/>
      {authToken &&<Route path={"/dashboard"} element={<Dashboard/>}/>}
      {authToken &&<Route path={"/onboard"} element={<Onboard/>}/>}
    </Routes>
    </BrowserRouter>
  )
}

export default App
