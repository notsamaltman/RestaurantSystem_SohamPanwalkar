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
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import Alert from '@mui/material/Alert';
import {Stack} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import GlassBrandBar from "@/components/GlassBrandBar";

export default function AdminRegister() {

  const [username, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(new Date());
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e)=>{
    e.preventDefault();

    if(password!==confirmpassword){
      createError("Password's do not match!");
    }
  }

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

              <DatePicker
                label="Date of Birth"
                disableFuture
                openTo="year"
                views={["year", "month", "day"]}
                slotProps={{
                  textField: { fullWidth: true },
                }}
                onChange={(e)=>{setDate(new Date(e.target.value))}}
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

              <Button
                fullWidth
                size="large"
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
