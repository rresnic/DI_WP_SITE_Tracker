import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/userAuth";
import Website from "./Website";
import { Collapse } from "@mui/material";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

const WebsiteList = (props) => {
    const [mysites, setMysites] = useState([]);
    const [open, setOpen] = useState(true);
    const {user} = useAuth();
    const toggleSites = () => setOpen(!open);
    useEffect(()=> {
        const fetchSites = async (id) => {
            console.log("loading sites");
            console.log("base URL", apiBaseUrl);
            try {
                const response = await axios.get(
                    `${apiBaseUrl}/api/sites/${id}`,
                    {withCredentials: true}
                );
                console.log(response.data);
                setMysites(response.data);
            } catch (error) {
                console.log("failed to fetch software", error.message || error)
            }
        }
        console.log("fetching user's sites", user.userid);
        fetchSites(user.userid);
    }, [props.tracked])

    return (
        <>
            <h2 onClick={toggleSites} style={{ cursor: 'pointer' }}>
                Websites {open ? '▲' : '▼'}
            </h2>
            <Collapse in={open}>
                <div>
                    {mysites.map(site =>{
                        return (<div key={site.uw_id}><Website id={site.uw_id} url={site.website_url} /></div>)
                    })}
                </div>
            </Collapse>
        </>
    )
}

export default WebsiteList;