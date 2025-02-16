import { Grid2 } from "@mui/material";
import MasterSWList from "./MasterSWList";
import VulnerabilitiesList from "./VulnerabilityList";
import VulnerabilityRefreshButton from "./VulnerabilityRefreshButton";

const AdminDash = () => {
    return (
        <>
            <h2>
                Admin dashboard
            </h2>
            <VulnerabilityRefreshButton />
            <Grid2 container spacing={2}>
                <Grid2 size={{xs: 12, md: 12}}>
                    <MasterSWList />
                </Grid2>
                <Grid2 size={{xs: 12, md: 12}}>
                    <VulnerabilitiesList />
                </Grid2>
            </Grid2>
        </>
    )
}
export default AdminDash;