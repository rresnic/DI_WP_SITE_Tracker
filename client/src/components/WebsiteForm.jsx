import { useState } from "react";
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

const WebsiteForm = (props) => {
    const [siteUrl, setSiteUrl] = useState("");
    const [error, setError] = useState("");
    const handleSubmit = async (e) => { 
        e.preventDefault();
        console.log("adding site");
        setError("");
        console.log(apiBaseUrl)
        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/sites/new`,
                {url: siteUrl},
                {withCredentials: true}
            );
            if(response.status === 201) props.tracker(prev=> prev + 1);
            const {message} = response.data;
            setError(message);
            setSiteUrl(''); 

        } catch (error) {
            setError(error.response?.data?.message || "failed to add site")
        }
    };
    return (
        <>
            <div className='auth-form-container'>
                <h2>Add Website</h2>
                <form className='auth-form' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='url' style={{paddingRight:".5em"}}>URL</label>
                        <input
                            id='url'
                            name='url'
                            type='text'
                            required
                            value={siteUrl}
                            onChange={(e) => setSiteUrl(e.target.value)}
                        />
                        <button type="submit">Add Site</button>
                    </div>
                </form>
                {error && <div className="error-message">{error}</div>}
            </div>
        </>
    )
}
export default WebsiteForm;