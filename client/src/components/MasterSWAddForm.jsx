import { TableRow, TableCell, TextField, Button } from "@mui/material";
import { useState } from "react";

const MasterSWAddFormRow = ({handleAddSoftware}) => {
    const [softwareName, setSoftwareName] = useState("");
    const [softwareType, setSoftwareType] = useState("");
    const [latestVersion, setLatestVersion] = useState("");
    const [updateDate, setUpdateDate] = useState("");
    const [updateNotes, setUpdateNotes] = useState("");
    const [updateURL, setUpdateURL] = useState("");

    const clearState = () => {
        setSoftwareName("");
        setSoftwareType("");
        setLatestVersion("");
        setUpdateDate("");
        setUpdateNotes("");
        setUpdateURL("");
    }
    const handleSubmit = () => {
        const newSoftware = {
            name: softwareName,
            type: softwareType.toLowerCase(),
            latest_version: latestVersion,
            last_update_date: updateDate,
            update_notes: updateNotes,
            update_url: updateURL,
        };
        handleAddSoftware(newSoftware);
        clearState();
    };

    return (
        <TableRow>
            <TableCell>New</TableCell>
            <TableCell><TextField value={softwareName} onChange={(e) => setSoftwareName(e.target.value)} label="Name" fullWidth /></TableCell>
            <TableCell><TextField value={softwareType} onChange={(e) => setSoftwareType(e.target.value)} label="Type" fullWidth /></TableCell>
            <TableCell><TextField value={latestVersion} onChange={(e) => setLatestVersion(e.target.value)} label="Version" fullWidth /></TableCell>
            <TableCell><TextField value={updateDate} onChange={(e) => setUpdateDate(e.target.value)} label="Updated" type="date" InputLabelProps={{ shrink: true }} fullWidth /></TableCell>
            <TableCell><TextField value={updateNotes} onChange={(e) => setUpdateNotes(e.target.value)} label="Update Notes" fullWidth /></TableCell>
            <TableCell><TextField value={updateURL} onChange={(e) => setUpdateURL(e.target.value)} label="Update URL" fullWidth /></TableCell>

            <TableCell>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Add
                </Button>
            </TableCell>
        </TableRow>
    );
};

export default MasterSWAddFormRow;