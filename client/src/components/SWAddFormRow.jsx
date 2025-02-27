import React, { useState, useEffect } from "react";
import axios from "axios";
import { TableRow, TableCell, TextField, Button, MenuItem, CircularProgress } from "@mui/material";

const SWAddFormRow = ({ site_id, handleAddSoftware }) => {
    const [name, setName] = useState("");
    const [type, setType] = useState("plugin");
    const [slug, setSlug] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [version, setVersion] = useState("");
    const [lastUpdated, setLastUpdated] = useState("");
    const [debouncedName, setDebouncedName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedName(name);
        }, 1000);
        return () => clearTimeout(handler);
    }, [name]);

    useEffect(() => {
        if (!debouncedName) {
            setSuggestions([]);
            return;
        }
        searchWordPressRepo(debouncedName);
    }, [debouncedName, type]);

    const searchWordPressRepo = async (searchTerm) => {
        const apiUrl = type === "plugin"
            ? `https://wptrackapi.rysrdev.com/wp-json/custom/v1/plugin-search/?s=${searchTerm}&include_details=true`
            : `https://wptrackapi.rysrdev.com/wp-json/custom/v1/theme-search/?s=${searchTerm}&include_details=true`;

        setLoading(true);

        try {
            const response = await axios.get(apiUrl, {
                params: {
                    action: type === "plugin" ? "query_plugins" : "query_themes",
                    request: JSON.stringify({ search: searchTerm, per_page: 10 })
                }
            });

            const data = type === "plugin" ? response.data.plugins || [] : response.data.themes || [];
            console.log(data);
            setSuggestions(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const selectSoftware = (software) => {
        setName(software.name);
        setVersion(software.version);
        setSlug(software.slug);
        setLastUpdated(new Date(software.last_updated.split(" ")[0]).toISOString().split('T')[0] || "Unknown");
        setTimeout(()=>setSuggestions([]), 0);
        setDebouncedName("");
    };

    const handleSubmit = () => {
        const newSoftware = {
            name,
            type,
            installed_version: version,
            installed_version_date: lastUpdated,
            website_id: site_id,
            slug
        };
        handleAddSoftware(newSoftware);
        setTimeout(()=> setName(""), 500);
    };

    return (
        <>
        <TableRow>
            <TableCell>New</TableCell>
            <TableCell>
                <TextField 
                    label="Software Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                />
            </TableCell>
            <TableCell>
                <TextField
                    select
                    label="Type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
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
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    fullWidth
                    required
                />
            </TableCell>
            <TableCell>
                <TextField
                    label="Last Updated"
                    type="date"
                    value={lastUpdated}
                    onChange={(e) => setLastUpdated(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                />
            </TableCell>
            <TableCell>
                <TextField
                    label="Slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    fullWidth
                    required
                    slotProps={{
                        input: { readOnly: true }, 
                    }}                />
            </TableCell>
            <TableCell>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Add
                </Button>
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell colSpan={6}>
            {loading && <CircularProgress size={24} />}
            {suggestions.length > 0 && (
                <TableCell>
                    {suggestions.map((software, index) => (
                        <Button key={index} variant="outlined" onClick={() => selectSoftware(software)}>
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

export default SWAddFormRow;