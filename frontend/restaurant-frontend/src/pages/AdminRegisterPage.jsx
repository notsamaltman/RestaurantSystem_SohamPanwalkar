import * as React from "react";
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Divider,
} from "@mui/material";
import { LocalizationProvider} from "@mui/x-date-pickers";
import Alert from '@mui/material/Alert';
import {Stack} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import GlassBrandBar from "@/components/GlassBrandBar";
import { serverLink } from "@/utils/links";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAuthenticated } from "@/utils/auth";

export default function AdminRegister() {

  useEffect(()=>{
      if(isAuthenticated()) navigate('/dashboard');
    }, []);

  const link = serverLink+'signup/';
  const navigate = useNavigate();

  const [username, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Frontend validation (exit early)
  if (!username || !firstName || !lastname || !email || !password || !confirmpassword) {
    createError("No fields can be empty!");
    return;
  }

  if (password !== confirmpassword) {
    createError("Passwords do not match!");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username:username,
        first_name: firstName,
        last_name: lastname,
        email:email,
        password:password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      createError(data.detail || "Signup failed");
      return;
    }
    setSuccess(true);

    localStorage.setItem("adminName", username);
    localStorage.setItem("first_name", firstName);
    localStorage.setItem("last_name", lastname);
    localStorage.setItem("email", email);
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);

    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);

    console.log("Admin created", data);

  } catch (error) {
    createError("Network error. Try again.");
  } finally {
    setLoading(false);
  }
};

  const createError = (error)=>{
    setError(error);
      setTimeout(()=>{
        setError("");
      }, 4000);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          minHeight: "110vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GlassBrandBar topheight={50}/>
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h5" fontWeight={500}>
              Upgrading your restaurant!
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={3}>
              Administrator account setup
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box display="flex" flexDirection="column" gap={2.5}>
              
              <TextField fullWidth label="Username" onChange={(e)=>{setUserName(e.target.value)}}/>

              <Box display="flex" gap={2}>
                  
                <TextField fullWidth label="First Name" onChange={(e)=>{setFirstName(e.target.value)}}/>
                  
                <TextField fullWidth label="Last Name" onChange={(e)=>{setLastName(e.target.value)}}/>
              </Box>

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                onChange={(e)=>{setEmail(e.target.value)}}
              />

              <Divider />

              <TextField
                fullWidth
                label="Password"
                type="password"
                onChange={(e)=>{setPassword(e.target.value)}}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                onChange={(e)=>{setConfirmPassword(e.target.value)}}
              />

                {error && (
                <Stack sx={{ mb: 2 }}>
                  <Alert severity="error">{error}</Alert>
                </Stack>
              )}

              <Button onClick={()=>{navigate("/login")}}>Already have an account?</Button>

              <Button
                fullWidth
                size="large"
                variant="outlined"
                color={success?"success":""}
                loading={loading}
                
                sx={{
                  mt: 1,
                  py: 1.2,
                  textTransform: "none",
                }}
                onClick={(e)=>{handleSubmit(e)}}
              >
                Create Account
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
}
