import { TableRow, TableCell, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useState } from 'react';
import "../styles/website.css";

const UserSoftwareRow = (props) => {
    const {software, masterSoftware} = props;
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ ...software });


    let rowClass = '';
    if (!software.software_id) {
        rowClass = 'untracked'; // Custom software, or just software not yet in the master software list
    } else {
        const masterEntry = masterSoftware.find(
            (ms) => ms.name === software.name && ms.type === software.type
        );

        if (masterEntry && software.installed_version === masterEntry.latest_version) {
            rowClass = 'matched'; // Software seems to be up to date
        } else {
            rowClass = 'mismatched'; // Warning, the software is likely out of date
        }

        console.log('class', rowClass)
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
                    {software.name.toUpperCase()}
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
                    <Button onClick={handleDelete} variant="contained" color="danger">
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