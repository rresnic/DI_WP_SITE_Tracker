import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/userAuth";
import Website from "./Website";
import { Collapse } from "@mui/material";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

const WebsiteList = (props) => {
    const [mysites, setMysites] = useState([]);
    const [masterSoftware, setMasterSoftware] = useState([]);
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

        const fetchMasterSoftware = async () => {
            try {
                const response = await axios.get(
                    `${apiBaseUrl}/api/mastersoftware/all`,
                    { withCredentials: true }
                );
                setMasterSoftware(response.data);
            } catch (error) {
                console.log("Failed to fetch master software", error.message || error);
            }
        };

        console.log("fetching master software list");
        fetchMasterSoftware();
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
                    <p>🟩 - Up to date with master list<br/>
                    🟧 - Untracked in master list<br/>
                    🟥 - Requires updating (version and/or name) </p>
                    {mysites.map(site =>{
                        return (<div key={site.uw_id}><Website id={site.uw_id} url={site.website_url} masterSoftware={masterSoftware} /></div>)
                    })}
                </div>
            </Collapse>
        </>
    )
}

export default WebsiteList;