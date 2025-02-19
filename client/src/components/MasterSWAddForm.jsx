import React, { useState, useEffect } from "react";
import axios from "axios";
import { TableRow, TableCell, TextField, Button, MenuItem, CircularProgress } from "@mui/material";

const MasterSWAddFormRow = ({ handleAddSoftware }) => {
    const [softwareName, setSoftwareName] = useState("");
    const [softwareType, setSoftwareType] = useState("plugin");
    const [latestVersion, setLatestVersion] = useState("");
    const [updateDate, setUpdateDate] = useState("");
    const [updateNotes, setUpdateNotes] = useState("");
    const [updateURL, setUpdateURL] = useState("");

    const [suggestions, setSuggestions] = useState([]);
    const [debouncedName, setDebouncedName] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingChangelog, setLoadingChangelog] = useState(false);

    const decodeHtmlEntities = (str) => {
        const doc = new DOMParser().parseFromString(str, 'text/html');
        return doc.documentElement.textContent || doc.body.textContent;
    }
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedName(softwareName);
        }, 1000);
        return () => clearTimeout(handler);
    }, [softwareName]);

    useEffect(() => {
        if (!debouncedName) {
            setSuggestions([]);
            return;
        }
        searchWordPressRepo(debouncedName);
    }, [debouncedName, softwareType]);

    const searchWordPressRepo = async (searchTerm) => {
        const apiUrl = softwareType === "plugin"
            ? `https://wptrackapi.rysrdev.com/wp-json/custom/v1/plugin-search/?s=${searchTerm}&include_details=true`
            : `https://wptrackapi.rysrdev.com/wp-json/custom/v1/theme-search/?s=${searchTerm}&include_details=true`;

        setLoading(true);

        try {
            const response = await axios.get(apiUrl);
            const data = softwareType === "plugin" ? response.data.plugins || [] : response.data.themes || [];
            setSuggestions(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchChangelog = async (slug) => {
        const apiUrl = softwareType === "plugin"
            ? `https://wptrackapi.rysrdev.com/wp-json/custom/v1/plugin-details/${slug}`
            : `https://wptrackapi.rysrdev.com/wp-json/custom/v1/theme-details/${slug}`;

        setLoadingChangelog(true);
        setUpdateNotes("Loading changelog..."); // Show loading state in the update notes field

        try {
            const response = await axios.get(apiUrl);
            console.log(response);
            if (response.data.sections?.changelog) {
                setUpdateNotes(decodeHtmlEntities(response.data.sections.changelog));
            } else {
                setUpdateNotes("No changelog available");
            }
        } catch (error) {
            console.error("Error fetching changelog:", error);
            setUpdateNotes("Error loading changelog");
        } finally {
            setLoadingChangelog(false);
        }
    };

    const selectSoftware = async (software) => {
        setSoftwareName(decodeHtmlEntities(software.name));
        setLatestVersion(software.version);
        setUpdateDate(
            software.last_updated
                ? new Date(software.last_updated.split(" ")[0]).toISOString().split("T")[0]
                : "Unknown"
        );
        setUpdateURL(software.homepage)
        // Fetch and set changelog directly into update notes
        if (software.slug) {
            await fetchChangelog(software.slug);
        }
        
        setTimeout(() => setSuggestions([]), 0);
        setDebouncedName("");
    };

    const clearState = () => {
        setSoftwareName("");
        setSoftwareType("plugin");
        setLatestVersion("");
        setUpdateDate("");
        setUpdateNotes("");
        setUpdateURL("");
    };

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
        <>
            <TableRow>
                <TableCell>New</TableCell>
                <TableCell>
                    <TextField
                        label="Software Name"
                        value={softwareName}
                        onChange={(e) => setSoftwareName(e.target.value)}
                        fullWidth
                        required
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        select
                        label="Type"
                        value={softwareType}
                        onChange={(e) => setSoftwareType(e.target.value)}
                        fullWidth
                        required
                    >
                        <MenuItem value="plugin">Plugin</MenuItem>
                        <MenuItem value="theme">Theme</MenuItem>
                    </TextField>
                </TableCell>
                <TableCell>
                    <TextField
                        label="Version"
                        value={latestVersion}
                        onChange={(e) => setLatestVersion(e.target.value)}
                        fullWidth
                        required
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        label="Updated"
                        type="date"
                        value={updateDate}
                        onChange={(e) => setUpdateDate(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        label="Update Notes"
                        value={updateNotes}
                        onChange={(e) => setUpdateNotes(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        disabled={loadingChangelog}
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        label="Update URL"
                        value={updateURL}
                        onChange={(e) => setUpdateURL(e.target.value)}
                        fullWidth
                    />
                </TableCell>
                <TableCell>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        color="primary"
                        disabled={loading || loadingChangelog}
                    >
                        Add
                    </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={8}>
                    {loading && <CircularProgress size={24} />}
                    {suggestions.length > 0 && (
                        <TableCell>
                            {suggestions.map((software, index) => (
                                <Button 
                                    key={index} 
                                    variant="outlined" 
                                    onClick={() => selectSoftware(software)}
                                    disabled={loadingChangelog}
                                >
                                    {software.name} (Version: {software.version})
                                </Button>
                            ))}
                        </TableCell>
                    )}
                </TableCell>
            </TableRow>
        </>
    );
};

export default MasterSWAddFormRow;