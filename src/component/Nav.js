import small from '../images/main_small.png'
//import big from  '../images/main_large.png'
const Nav =({minimal,setShowModal,showModal,setisSignUp})=>{

        const handleClick = ()=>
        {
            setShowModal(true)
            setisSignUp(false)
        }
        const authToken=false
    return (
        <nav>
            <div className="logo-container">
                <img className="logo" src={minimal ? small : small}
                style={{ width: '150px', height: 'auto' }}/>
            </div>

                {!authToken && !minimal &&(<button className="nav-button" 
                onClick={handleClick}
                disabled={showModal}>Log in</button>)}
        </nav>
    );
};
export default Nav;