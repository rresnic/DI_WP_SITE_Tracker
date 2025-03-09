import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

const PasswordReset = () => {
    const location = useLocation(); // Used to access URL query parameters
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [expiresAfter, setExpiresAfter] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isExpired, setIsExpired] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Parse query parameters from the URL
        const urlParams = new URLSearchParams(location.search);
        const email = urlParams.get('email');
        const token = urlParams.get('token');
        const expiresAfter = urlParams.get('expires_after');

        // Set the values from the URL
        if (email && token) {
            setEmail(email);
            setToken(token);
            setExpiresAfter(expiresAfter ? new Date(expiresAfter) : null);
        } else {
            setErrorMessage('Invalid link');
            setIsLoading(false);
        }
    }, [location]);

    // Check if the token has expired
    useEffect(() => {
        if (expiresAfter) {
            const now = new Date();
            if (expiresAfter < now) {
                setIsExpired(true);
            }
            setIsLoading(false);
        }
    }, [expiresAfter]);

    // Handle password reset form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPassword) {
            setErrorMessage('Please enter a new password');
            return;
        }
        
        try {
            const response = await axios.post(`${apiBaseUrl}/api/users/confirm-reset`, {
                email,
                token,
                newPassword
            });
            console.log(response.data);
            if(response.status == 200) {
                setOpen(true);
            } else {
                throw new Error ("Something went wrong");
            }
        } catch (error) {
            setErrorMessage('Error resetting password. Please try again.');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleClose = () => {
        setOpen(false);
        navigate("/login");
    }
    return (
        <div className="password-reset">
            {isExpired ? (
                <div className="error-message">
                    <p>The password reset link has expired.</p>
                </div>
            ) : (
                <div>
                    <h2>Reset Your Password</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button type="submit">Submit</button>
                    </form> 
                </div>
            )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Password Reset Successful</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your password has been successfully reset. You can now log in with your new password.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PasswordReset;