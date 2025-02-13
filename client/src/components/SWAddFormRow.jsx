import { TableRow, TableCell, TextField, Button } from "@mui/material";
import { useState } from "react";

const SWAddFormRow = ({ site_id, handleAddSoftware}) => {
    const [softwareName, setSoftwareName] = useState("");
    const [softwareType, setSoftwareType] = useState("");
    const [installedVersion, setInstalledVersion] = useState("");
    const [installedVersionDate, setInstalledVersionDate] = useState("");
    const handleSubmit = () => {
        const newSoftware = {
            name: softwareName,
            type: softwareType.toLowerCase(),
            installed_version: installedVersion,
            installed_version_date: installedVersionDate,
            website_id: site_id
        };
        handleAddSoftware(newSoftware);
    };

    return (
        <TableRow>
            <TableCell>New</TableCell>
            <TableCell><TextField value={softwareName} onChange={(e) => setSoftwareName(e.target.value)} label="Name" fullWidth /></TableCell>
            <TableCell><TextField value={softwareType} onChange={(e) => setSoftwareType(e.target.value)} label="Type" fullWidth /></TableCell>
            <TableCell><TextField value={installedVersion} onChange={(e) => setInstalledVersion(e.target.value)} label="Version" fullWidth /></TableCell>
            <TableCell><TextField value={installedVersionDate} onChange={(e) => setInstalledVersionDate(e.target.value)} label="Updated" type="date" InputLabelProps={{ shrink: true }} fullWidth /></TableCell>
            <TableCell>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Add
                </Button>
            </TableCell>
        </TableRow>
    );
};

export default SWAddFormRow;