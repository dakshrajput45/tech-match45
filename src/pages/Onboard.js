import { useState } from "react"
import Nav from "../component/Nav"
import { useCookies } from "react-cookie"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Onboard = () => {

    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [formData, setformData] = useState({
        user_id: cookies.UserId,
        first_name: '',
        dob_day: '',
        dob_month: '',
        dob_year: '',
        haveproject: 'NO',
        seek: 'both',
        url: '',
        skills: '',
        matches: [],
        projectName: '',
        projectDescription: '',
        skillRequired: '',
        interests: ''
    })

    let navigate = useNavigate()

    const handlesubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.put('http://localhost:8000/user', { formData })
            const sucess = response.status === 200

            if (sucess) navigate('/dashboard')
        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        console.log('e', e)
        const value = e.target.value === 'checkbox' ? e.target.checked : e.target.value
        const name = e.target.name
        console.log('value' + value, 'name' + name)

        setformData((prevState) => ({
            ...prevState,
            [name]: value
        }))

    }

    return (
        <>
            <Nav
                minimal={true}
                setShowModal={() => { }}
                showModal={false}
            />
            <div className="Onboard">
                <h2>CREATE ACCOUNT</h2>

                <form onSubmit={handlesubmit}>
                    <section>
                        <label htmlFor="first_name">Name</label>
                        <input
                            id="first_name"
                            type="text"
                            name="first_name"
                            placeholder="Name"
                            required={true}
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                        <label>Date Of Birth</label>
                        <div className="multiple-input-container">
                            <input
                                id="dob_day"
                                type="number"
                                name="dob_day"
                                placeholder="DD"
                                required={true}
                                value={formData.dob_day}
                                onChange={handleChange}
                            />
                            <input
                                id="dob_month"
                                type="number"
                                name="dob_month"
                                placeholder="MM"
                                required={true}
                                value={formData.dob_month}
                                onChange={handleChange}
                            />
                            <input
                                id="dob_year"
                                type="number"
                                name="dob_year"
                                placeholder="YYYY"
                                required={true}
                                value={formData.dob_year}
                                onChange={handleChange}
                            />
                        </div>

                        <label >Do You Have Project</label>
                        <div className="multiple-input-container">
                            <input
                                id="yes_project"
                                type="radio"
                                name="haveproject"
                                value="YES"
                                onChange={handleChange}
                                checked={formData.haveproject === 'YES'}
                            />

                            <label htmlFor="yes_project">YES</label>
                            <input
                                id="no_project"
                                type="radio"
                                name="haveproject"
                                value="NO"
                                onChange={handleChange}
                                checked={formData.haveproject === 'NO'}
                            />
                            <label htmlFor="no_project">NO</label>
                        </div>

                        {formData.haveproject === 'NO' && (
                            <div className="skills">

                                <div>
                                    <label htmlFor="skills">Skills</label>
                                    <input
                                        id="skills"
                                        type="text"
                                        name="skills"
                                        required={true}
                                        placeholder="Technical Skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="interests">Interests</label>
                                    <input
                                        id="interests"
                                        type="text"
                                        name="interests"
                                        required={true}
                                        placeholder="Interests"
                                        value={formData.interests}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}
                        {formData.haveproject === 'YES' && (
                            <div className="project">
                                <div>
                                    <label htmlFor="projectName">Project Name</label>
                                    <input
                                        id="projectName"
                                        type="text"
                                        name="projectName"
                                        required={true}
                                        placeholder="Project Name"
                                        value={formData.projectName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="projectDescription">Project Description</label>
                                    <input
                                        id="projectDescription"
                                        type="text"
                                        name="projectDescription"
                                        required={true}
                                        placeholder="Project Description"
                                        value={formData.projectDescription}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="skillRequired">Skill Required</label>
                                    <input
                                        id="skillRequired"
                                        type="text"
                                        name="skillRequired"
                                        required={true}
                                        placeholder="Skill Required"
                                        value={formData.skillRequired}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}
                        <label>Seek</label>
                        <div className="multiple-input-container">
                            <input
                                id="project"
                                type="radio"
                                name="seek"
                                value="project"
                                onChange={handleChange}
                                checked={formData.seek === 'project'}
                                disabled={formData.haveproject === 'YES'}
                            />
                            <label htmlFor="project">PROJECT</label>

                            <input
                                id="partner"
                                type="radio"
                                name="seek"
                                value="partner"
                                onChange={handleChange}
                                checked={formData.seek === 'partner'}
                                disabled={formData.haveproject === 'NO'}
                            />
                            <label htmlFor="partner">PARTNER</label>

                            <input
                                id="both"
                                type="radio"
                                name="seek"
                                value="both"
                                onChange={handleChange}
                                checked={formData.seek === 'both'}
                            />
                            <label htmlFor="both">BOTH</label>
                        </div>
                        <input type="submit" />
                    </section>
                    
                    <section>

                        <label htmlFor="url">Profile Photo</label>
                        <input
                            type="url"
                            name="url"
                            id="url"
                            onChange={handleChange}
                            required={true}
                        />
                        <div className="photo-container">
                            {formData.url && <img src={formData.url} alt="profile pic preview" />}
                        </div>


                    </section>

                </form>

            </div>
        </>
    )
}
export default Onboard