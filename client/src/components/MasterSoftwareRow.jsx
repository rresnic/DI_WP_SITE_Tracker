import { TableRow, TableCell, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useState } from 'react';

const MasterSoftwareRow = (props) => {
    const {software} = props;
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ ...software });

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
        props.handleUpdateSoftware(formData);
        handleClose();
    };

    return (
        <>
            <TableRow>
                <TableCell>
                    {software.ms_id}
                </TableCell>
                <TableCell  sx={{ textTransform: 'capitalize' }}>
                    {software.name.toUpperCase()}
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
                    {software.update_notes}
                </TableCell>
                <TableCell>
                    {software.update_url}
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