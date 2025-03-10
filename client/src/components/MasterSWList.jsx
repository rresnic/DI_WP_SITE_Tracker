import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Collapse, Paper, 
    Button} from "@mui/material";
import MasterSoftwareRow from "./MasterSoftwareRow";
import MasterSWAddFormRow from "./MasterSWAddForm";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

const MasterSWList = () => {
    const [mysoftware, setMysoftware] = useState([]);
    const [open, setOpen] = useState(true);
    const toggleSites = () => setOpen(!open);
    const [changes, setChanges] = useState(0);

    useEffect(()=> {
        const fetchSoftware = async () => {
            console.log("loading software");
            try {
                const response = await axios.get(
                    `${apiBaseUrl}/api/mastersoftware/all`,
                    {withCredentials: true}
                );
                console.log(response.data);
                setMysoftware(response.data);
            } catch (error) {
                console.log("failed to fetch software", error.message || error)
            }
        }
        fetchSoftware();
    }, [changes])


    // Function to download JSON
    const downloadJSON = () => {
        const blob = new Blob([JSON.stringify(mysoftware, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "software_list.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Function to download CSV
    const downloadCSV = () => {
        const csvContent = [
            ["ID", "Name", "Slug", "Type", "Latest Version", "Last Update Date", "Update Notes", "Update URL"], 
            ...mysoftware.map(({ ms_id, name, slug, type, latest_version, last_update_date, update_notes, update_url }) => 
                [ms_id, name, slug, type, latest_version, last_update_date, update_notes, update_url].map(value => `"${value}"`).join(",")
            )
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "software_list.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDeleteSoftware = async (id) => {
        console.log("deleting", id) // TODO 
        try {
            const response = await axios.delete(
                `${apiBaseUrl}/api/mastersoftware/${id}`,
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
                `${apiBaseUrl}/api/mastersoftware/${formData.ms_id}`,
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
    const handleAddSoftware = async (formData) => {
        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/mastersoftware/new`,
                formData,
                {withCredentials: true}
            );
            // After adding, update the software list
            if (response.status === 201){
                console.log(response.data)
                setMysoftware((prevSoftwares) => [...prevSoftwares, response.data.software]);
            }
        } catch (error) {
            console.log("Failed to add software", error.message || error);
        }
    };

    return (
        <>
            <h2 onClick={toggleSites} style={{ cursor: 'pointer' }}>
                Software {open ? '▲' : '▼'}
            </h2>
            <Button onClick={downloadJSON} variant="contained" color="primary" style={{ marginRight: "10px" }}>
                Download JSON
            </Button>
            <Button onClick={downloadCSV} variant="contained" color="secondary">
                Download CSV
            </Button>
            <Collapse in={open}>
                <TableContainer component={Paper}>
                    <Table className="zebra-stripe">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Latest Version</TableCell>
                                <TableCell>Last Update Date</TableCell>
                                <TableCell>Update Notes</TableCell>
                                <TableCell>Update URL</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                <MasterSWAddFormRow handleAddSoftware={handleAddSoftware} />
                                {mysoftware.map((item=> {
                                console.log(item);
                                return (<><MasterSoftwareRow handleDeleteSoftware={handleDeleteSoftware} handleUpdateSoftware={handleUpdateSoftware} software={item}/></>)
                            }))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Collapse>
        </>
    )
}

export default MasterSWList;