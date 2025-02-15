import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/userAuth';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated, user } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${apiBaseUrl}/api/users/logout`,
        {},
        { withCredentials: true }
      );
      logout();
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  const buttonStyle = {
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      color: '#FFD700', // Gold color
    },
  };

  return (
    <AppBar position="static"
        sx={{
            width: '90vw', // 90% of the viewport width
            margin: '0 auto', // Center horizontally
        }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          WP Tracker
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {!isAuthenticated && (
            <>
              <Button
                component={RouterLink}
                to="/login"
                sx={buttonStyle}
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                sx={buttonStyle}
              >
                Register
              </Button>
            </>
          )}
          {isAuthenticated && (
            <>
              <Button
                component={RouterLink}
                to="/dashboard"
                sx={buttonStyle}
              >
                Dashboard
              </Button>
              {user.role === 'admin' && (
                <Button
                  component={RouterLink}
                  to="/admin"
                  sx={buttonStyle}
                >
                  Admin
                </Button>
              )}
              <Button
                onClick={handleLogout}
                sx={buttonStyle}
              >
                Logout
              </Button>
            </>
          )}
          <Button
            component={RouterLink}
            to="/profile"
            sx={buttonStyle}
          >
            Profile
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;