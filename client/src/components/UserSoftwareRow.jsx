import { TableRow, TableCell, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import "../styles/website.css";
import { isVersionAffected } from '../utils/versionCompare';

const UserSoftwareRow = (props) => {
    const {software, masterSoftware, vulnerabilities} = props;
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ ...software });
    const [trackedVersion, setTrackedVersion] = useState("");
// Function to fetch the latest version from WordPress API
async function getLatestVersionFromWPAPI(software) {
    try {
        const identifier = software.slug;
        if(!identifier) {
            return null;
        }
        
        const endpoint = software.type === 'plugin' 
        ? `https://api.wordpress.org/plugins/info/1.2/?action=plugin_information&slug=${identifier}&fields=version`
        : `https://api.wordpress.org/themes/info/1.2/?action=theme_information&slug=${identifier}&fields=version`;
        const response = await fetch(endpoint);
        
        // Check if response is ok before parsing
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Return the version or null if not found
        setTrackedVersion(data.version || null);
    } catch (error) {
        console.error('Error fetching from WordPress API:', error.message);
        return null; // Return null if API request fails
    }
}
useEffect(()=> {
    getLatestVersionFromWPAPI(software);
}, [software])

// Updated version comparison logic
let rowClass = '';
if (!trackedVersion && !software.software_id) {
    rowClass = 'untracked'; // Custom software, or just software not yet in the master software list
} else{    
    if (trackedVersion) {
        // Compare with the version from the API if available
        if (software.installed_version === trackedVersion) {
            rowClass = 'matched'; // Software seems to be up to date
        } else {
            rowClass = 'mismatched'; // Warning, the software is likely out of date
        }
    } else {
        // If the API call fails, fallback to master software list
        const masterEntry = masterSoftware.find(
            (ms) => (software.slug && ms.slug === software.slug) || (ms.name === software.name && ms.type === software.type)
        );
        
        if (masterEntry && software.installed_version === masterEntry.latest_version) {
            rowClass = 'matched'; // Software seems to be up to date from the master list
        } else {
            rowClass = 'mismatched'; // Software is out of date according to the master list
        }
    }
}
    // let rowClass = '';
    // if (!software.software_id) {
    //     rowClass = 'untracked'; // Custom software, or just software not yet in the master software list
    // } else {
    //     const masterEntry = masterSoftware.find(
    //         (ms) => ms.name === software.name && ms.type === software.type
    //     );

    //     if (masterEntry && software.installed_version === masterEntry.latest_version) {
    //         rowClass = 'matched'; // Software seems to be up to date
    //     } else {
    //         rowClass = 'mismatched'; // Warning, the software is likely out of date
    //     }
    
    // }

    let vulnerabilityApplies = false;
    vulnerabilities.forEach(vuln => {
    if (vuln.software_name.toLowerCase() === software.name.toLowerCase()) {
            // Hopefully we can compare via semver
            console.log(software.name);
            console.log(vuln.affected_versions);
            console.log(software.installed_version);
            if (isVersionAffected(software.installed_version, vuln.affected_versions)) {
                vulnerabilityApplies = true;
            }
        }
    });

    if(vulnerabilityApplies) {
        rowClass += ' vulnerable';
    }

    const handleEdit = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        props.handleDeleteSoftware(software.ws_id);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSubmit = () => {
        props.handleUpdateSoftware(formData);
        handleClose();
    };
    return (
        <>
            <TableRow className={rowClass}>
                <TableCell>
                    {software.ws_id}
                </TableCell>
                <TableCell  sx={{ textTransform: 'capitalize' }}>
                    {software.name}
                </TableCell>
                <TableCell  sx={{ textTransform: 'capitalize' }}>
                    {software.type}
                </TableCell>
                <TableCell>
                    {software.installed_version}
                </TableCell>
                <TableCell>
                    {software.installed_version_date}
                </TableCell>
                <TableCell>
                    {software.software_id}
                </TableCell>
                <TableCell>
                    {software.slug}
                </TableCell>
                <TableCell>
                    <Button onClick={handleDelete} variant="contained" color="warning">
                        Delete
                    </Button>
                    <Button onClick={handleEdit} variant="contained" color="secondary">
                        Edit
                    </Button>
                </TableCell>
            </TableRow>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Software</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Installed Version"
                        name="installed_version"
                        value={formData.installed_version}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Installed Version Date"
                        name="installed_version_date"
                        type="date" 
                        InputLabelProps={{ shrink: true }}
                        value={formData.installed_version_date}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        fullWidth
                        slotProps={{
                            input: {readOnly: true}
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
export default UserSoftwareRow;