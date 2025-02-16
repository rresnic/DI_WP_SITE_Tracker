import axios from "axios";
import { useEffect, useState } from "react";
import UserSoftwareRow from "./UserSoftwareRow";
import "../styles/website.css";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Collapse, Paper, Button } from '@mui/material';
import SWAddFormRow from "./SWAddFormRow";

// import { isVersionAffected } from "../utils/versionCompare";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

const Website = (props) => {
    const {id: site_id, url: site_url, masterSoftware, vulnerabilities} = props;    
    const [open, setOpen] = useState(true);
    const [softwares, setSoftwares] = useState([]);
    const [changes, setChanges] = useState(0);
    // const [myVulnerabilities, setMyVulnerabilities] = useState([])

    useEffect( ()=>{
        const fetchSoftware = async (id) => {
            console.log("loading site");
            try {
                const response = await axios.get(
                    `${apiBaseUrl}/api/usersoft/${id}`,
                    {withCredentials: true}
                );
                setSoftwares(response.data);
            } catch (error) {
                console.log("failed to fetch software", error.message || error)
            }
        }
        fetchSoftware(site_id);
    }, [changes])

    const handleAddSoftware = async (newSoftware) => {
        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/usersoft/new`,
                newSoftware,
                {withCredentials: true}
            );
            // After adding, update the software list
            if (response.status === 201){
            setSoftwares((prevSoftwares) => [...prevSoftwares, response.data.software]);
            }
        } catch (error) {
            console.log("Failed to add software", error.message || error);
        }
    };

    const handleDeleteSoftware = async (id) => {
        console.log("deleting", id) // TODO 
        try {
            const response = await axios.delete(
                `${apiBaseUrl}/api/usersoft/software/${id}`,
                {withCredentials: true}
            );
            // After deleting, update list TODO
            if (response.status === 202){
                console.log(response.data);
                setChanges(prev => prev + 1);
            }
        } catch (error) {
            console.log("Failed to delete software", error.message || error);
        }
    }

    const handleUpdateSoftware = async (formData) => {
        console.log("updating")
        console.log(formData); // TODO
        try {
            const response = await axios.put(
                `${apiBaseUrl}/api/usersoft/software/${formData.ws_id}`,
                formData,
                {withCredentials: true}
            );
            // After adding, update the software list
            if (response.status === 201){
                console.log(response.data)
                setChanges(prev => prev + 1);
            }
        } catch (error) {
            console.log("Failed to add software", error.message || error);
        }
    }

    return (
        <>
            <Button onClick={() => setOpen(!open)} variant="contained" color="primary" sx={{mt:2, mb:1}}>
            {open ? `Hide ${site_url}` : `Show ${site_url}`}
            </Button>
            <Collapse in={open}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Version</TableCell>
                                <TableCell>Updated</TableCell>
                                <TableCell>Software ID</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                {softwares.map((item=> {
                                return (<><UserSoftwareRow key={item.ws_id} software={item} handleDeleteSoftware={handleDeleteSoftware} handleUpdateSoftware={handleUpdateSoftware} vulnerabilities={vulnerabilities} masterSoftware={masterSoftware} /></>)
                            }))}
                             <SWAddFormRow site_id={site_id} handleAddSoftware={handleAddSoftware} />
                        </TableBody>
                    </Table>
                </TableContainer>
            </Collapse>
            
            
        </>
    )
}
export default Website;