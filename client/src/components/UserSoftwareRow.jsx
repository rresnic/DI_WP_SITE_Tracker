import {TableRow, TableCell} from "@mui/material"
const UserSoftwareRow = (props) => {
    const {software} = props;
    return (
        <>
            <TableRow>
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
            </TableRow>
        </>
    )
}
export default UserSoftwareRow;