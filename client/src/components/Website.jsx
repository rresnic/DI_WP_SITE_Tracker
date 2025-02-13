import axios from "axios";
import { useEffect, useState } from "react";
import UserSoftwareRow from "./UserSoftwareRow";
import "../styles/website.css";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Collapse, Box, Paper,
    Button
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

const Website = (props) => {
    const site_id = props.id;
    const site_url = props.url || "site";
    const [open, setOpen] = useState(true);
    const [softwares, setSoftwares] = useState([])
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
    }, [])
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                {softwares.map((item=> {
                                console.log(item);
                                return (<><UserSoftwareRow software={item}/></>)
                            }))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Collapse>
            
            
        </>
    )
}
export default Website;