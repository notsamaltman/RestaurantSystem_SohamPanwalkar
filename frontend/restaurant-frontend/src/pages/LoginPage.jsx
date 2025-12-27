import { Box, Container, Paper, Typography, TextField, Button, Alert, Stack } from "@mui/material";
import GlassBrandBar from "@/components/GlassBrandBar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/utils/auth";
import { serverLink } from "@/utils/links";


export default function LoginPage() {
  const navigate = useNavigate();
  const link = serverLink+'login/';

  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[error, setError] = useState('');
  const[loading, setLoading] = useState(false);

  useEffect(()=>{
    if(isAuthenticated()) navigate("/dashboard");
  }, []);

  const createError = (error)=>{
    setError(error);
      setTimeout(()=>{
        setError("");
      }, 4000);
  }

    const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
        createError("No fields can be empty!");
        setLoading(false);
        return;
    }

    try {
        const response = await fetch(link, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
        });

        const data = await response.json();

        if (!response.ok) {
        createError(data.detail || "Login failed");
        return;
        }

        // ✅ Store auth
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        // ✅ Store user info
        localStorage.setItem("adminName", data.user.username);
        localStorage.setItem("first_name", data.user.first_name);
        localStorage.setItem("last_name", data.user.last_name);
        localStorage.setItem("email", data.user.email);

        navigate("/dashboard");

    } catch (err) {
        createError("Network error. Try again.");
        setLoading(false);
    }
    };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, #020617 50%, #020617 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Top Glass Bar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <GlassBrandBar topheight={100}/>
      </div>

      {/* Login Card */}
      <Container
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            backgroundColor: "rgba(2,6,23,0.85)",
            border: "1px solid #1e293b",
            borderRadius: 4,
            p: 5,
            width: "100%",
            maxWidth: 420,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Welcome back
          </Typography>
          <Typography sx={{ color: "#94a3b8", mb: 4 }}>
            Sign in
          </Typography>

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            sx={{ mb: 3 }}
            onChange={(e)=>{setEmail(e.target.value)}}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            sx={{ mb: 4 }}
            onChange={(e)=>{setPassword(e.target.value)}}
          />

          {error && (
                <Stack sx={{ mb: 2 }}>
                  <Alert severity="error">{error}</Alert>
                </Stack>
            )}

          <Button
            fullWidth
            size="large"
            loading={loading}
            onClick={handleLogin}
            sx={{
              borderRadius: 3,
              py: 1.5,
              fontSize: "1rem",
              backgroundColor: "#020617",
              border: "1px solid #334155",
              ":hover": {
                backgroundColor: "#020617",
                borderColor: "white",
              },
            }}
          >
            Login
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
