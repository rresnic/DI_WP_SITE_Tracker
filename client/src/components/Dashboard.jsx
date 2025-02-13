import { useEffect, useState } from "react";
import WebsiteForm from "./WebsiteForm";
import WebsiteList from "./WebsiteList";

const Dashboard = () => {
    const [changes, setChanges] = useState(0);
    useEffect(() => {
        console.log('Changes state updated:', changes);
    }, [changes]);
    return (
        <>
            <h2>Dashboard</h2>
            <section>
                <WebsiteForm tracker={setChanges}/>
            </section>
            <section>
                <WebsiteList tracked={changes}/>
            </section>
        </>
    )
}
export default Dashboard;