import { TableRow, TableCell, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import '../styles/software.css';
const MasterSoftwareRow = (props) => {
    const {software} = props;
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ ...software });
    const [latestAPIVersion, setLatestAPIVersion] = useState("");
    const [latestAPIUpdateDate, setLatestAPIUpdateDate] = useState("");
    const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

    async function getLatestVersionFromWPAPI() {
        try {
            const identifier = software.slug;
            if(!identifier) {
                return null;
            }
            // WordPress.org Plugin API v1.2 with proper parameters
            const endpoint = software.type === 'plugin'
            ? `https://api.wordpress.org/plugins/info/1.2/?action=plugin_information&slug=${identifier}&fields=version`
            : `https://api.wordpress.org/themes/info/1.2/?action=theme_information&slug=${identifier}&fields=version`;
            const response = await fetch(endpoint);
            
            // Check if response is ok before parsing
            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }
            
            const data = await response.json();
            
            // Set the latest API version
            setLatestAPIVersion(data.version || null);
            setLatestAPIUpdateDate(data.last_updated)
        } catch (error) {
            console.error('Error fetching from WordPress API:', error.message);
            setLatestAPIVersion(null);
        }
    }

    useEffect(() => {
        if (software.slug) {
            getLatestVersionFromWPAPI();
        }
    }, [software]);

    const handleEdit = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        props.handleDeleteSoftware(software.ms_id);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSubmit = () => {
        setIsReadyToSubmit(false);
        props.handleUpdateSoftware(formData);
        handleClose();
    };

    const handleUpdateAPIVersion = () => {
        if (latestAPIVersion) {
            setFormData((prevFormData) => {
                const updatedData = {
                    ...prevFormData,
                    latest_version: latestAPIVersion,
                    last_update_date: new Date(latestAPIUpdateDate.split(" ")[0]).toISOString().split("T")[0],
                };
    
                setIsReadyToSubmit(true); 
                return updatedData;
            });
        }
    };

    useEffect(()=>{
        if(isReadyToSubmit) {
            handleSubmit();
        }
    }, [isReadyToSubmit])

    // Determine if there's a newer version available from the API
    const hasNewerAPIVersion = latestAPIVersion && 
        software.latest_version !== latestAPIVersion;


    return (
        <>
            <TableRow className={hasNewerAPIVersion ? 'api-newer' : ''}>
                <TableCell>
                    {software.ms_id}
                </TableCell>
                <TableCell  sx={{ textTransform: 'capitalize' }}>
                    {software.name.toLowerCase()}
                </TableCell>
                <TableCell  sx={{ textTransform: 'capitalize' }}>
                    {software.type}
                </TableCell>
                <TableCell>
                    {software.latest_version}
                </TableCell>
                <TableCell>
                    {software.last_update_date}
                </TableCell>
                <TableCell>
                    <p style={{ maxHeight: '150px', overflow: 'auto' }}>{software.update_notes}</p>
                </TableCell>
                <TableCell>
                    {software.update_url}
                </TableCell>
                <TableCell>
                    <Button onClick={handleDelete} variant="contained" color="warning">
                        Delete
                    </Button>
                    <Button onClick={handleEdit} variant="contained" color="secondary">
                        Edit
                    </Button>
                    {hasNewerAPIVersion && (
                        <Button 
                            onClick={handleUpdateAPIVersion} 
                            variant="contained" 
                            color="success"
                        >
                            Update Version
                        </Button>
                    )}
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
                        label="Latest Version"
                        name="latest_version"
                        value={formData.latest_version}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Last Update Date"
                        name="last_update_date"
                        type="date" 
                        InputLabelProps={{ shrink: true }}
                        value={formData.last_update_date}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Update Notes"
                        name="update_notes"
                        value={formData.update_notes}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Update URL"
                        name="update_url"
                        value={formData.update_url}
                        onChange={handleChange}
                        fullWidth
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
export default MasterSoftwareRow;