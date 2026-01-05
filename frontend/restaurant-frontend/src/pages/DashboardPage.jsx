import { serverLink } from "@/utils/links";
import { Box, Typography, Button, Container, Paper, Grid, Dialog, DialogTitle, DialogActions, Alert, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const hasRestaurant = localStorage.getItem("has_restaurant")==="true";
  const firstName = localStorage.getItem("first_name");
  const restaurantName = localStorage.getItem("restaurant_name");
  const restaurantDescription = localStorage.getItem("restaurant_description");
  const restaurantAddress = localStorage.getItem("restaurant_address");
  const restaurantTables = localStorage.getItem("restaurant_tables");
  const token = localStorage.getItem("accessToken");
  const link = serverLink+'remove/';
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const[loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!token) return;

      try {
        const res = await fetch(serverLink + "dashboard-data/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch dashboard data");

        const data = await res.json();
        const { user, restaurant } = data;

        // --- Set user info ---
        localStorage.setItem("first_name", user.first_name || "");
        localStorage.setItem("last_name", user.last_name || "");
        localStorage.setItem("email", user.email || "");

        // --- Set restaurant info if exists ---
        if (restaurant) {
          localStorage.setItem("has_restaurant", "true");
          localStorage.setItem("restaurant_name", restaurant.name || "");
          localStorage.setItem("restaurant_description", restaurant.description || "");
          localStorage.setItem("restaurant_address", restaurant.address || "");
          localStorage.setItem("restaurant_tables", restaurant.no_of_tables || 0);

          // Optionally store menu, tables, images, orders if needed
          localStorage.setItem("restaurant_menu", JSON.stringify(restaurant.categories || []));
          localStorage.setItem("restaurant_tables_data", JSON.stringify(restaurant.tables || []));
          localStorage.setItem("restaurant_orders", JSON.stringify(restaurant.orders || []));
          localStorage.setItem("restaurant_menu_images", JSON.stringify(restaurant.menu_images || []));
        } else {
          localStorage.setItem("has_restaurant", "false");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      }
    }

    fetchDashboardData();
  }, [token]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogOut = ()=>{
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("adminName");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    localStorage.removeItem("email");

    navigate("/login");
  };

  const removeRestaurant = async ()=>{
    try {
      setLoading(true);
      const response = await fetch(link, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          "user":""
        }),
      });

      if (!response.ok) {
        setError("Incorrect Format. Please try again.");
        setLoading(false);
        return;
      }
      localStorage.setItem("has_restaurant", "false");
      localStorage.removeItem("restaurant_name");
      localStorage.removeItem("restaurant_description");
      localStorage.removeItem("restaurant_address");
      localStorage.removeItem("restaurant_tables");
      localStorage.removeItem("restaurant_menu");
      localStorage.setItem("stage-1", "false");
      localStorage.setItem("stage-2", "false");
      localStorage.setItem("stage-3", "false");
      window.location.reload();

    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Network error. Please try again.");
    }
  }

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
      <div className="fixed top-0 left-0 w-full z-50">
      <div
      style={{top:50}}
        className="
          mx-auto
          max-w-4xl
          rounded-2xl
          px-6
          py-4
          relative
          flex
          items-center
          justify-between
          backdrop-blur-xl
          bg-blue-900/10
          border-b
          border-white/20
          shadow-lg
        "
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center text-lg font-bold">
            🍽️
          </div>
          <span className="text-xl text-white font-semibold tracking-tight">
            Dinely
          </span>
        </div>

        {/* Page Context (not navigation) */}
        <div className="text-sm text-white/70 hidden sm:block">
          <Button variant="outlined" onClick={()=>{handleLogOut()}}>
            Log Out
          </Button>
        </div>
      </div>
    </div>

      {/* Hero Section */}
      <Container
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >

        {error && (
          <Stack sx={{ mb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Stack>
        )}

        <Typography
          variant="h3"
          sx={{ fontWeight: 700, mb: 2 }}
        >
          {!hasRestaurant?("Welcome, "+firstName+" let's get started digitizing your first restaurant"):("Welcome, "+firstName+"!")}
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "#94a3b8", maxWidth: 600, mb: 6 }}
        >
          Digital menus, instant ordering, and real-time operations built for modern restaurants.
        </Typography>

        {!hasRestaurant && (
          <Paper
            elevation={8}
            sx={{
              backgroundColor: "rgba(2,6,23,0.85)",
              border: "1px solid #1e293b",
              borderRadius: 4,
              p: 5,
              maxWidth: 420,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              No restaurant found
            </Typography>
            <Typography sx={{ color: "#94a3b8", mb: 4 }}>
              Create your restaurant to start accepting digital orders and managing tables.
            </Typography>
            <Button
              fullWidth
              size="large"
              onClick={()=>{navigate("/register/restaurant-1")}}
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
              Create Restaurant
            </Button>
          </Paper>
        )}
        {hasRestaurant && (
          <Paper
            sx={{
              backgroundColor: "rgba(2,6,23,0.85)",
              border: "1px solid #1e293b",
              borderRadius: 4,
              p: 4,
              maxWidth: 520,
              width: "100%",
              textAlign: "left",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              {restaurantName}
            </Typography>

            <Typography sx={{ color: "#94a3b8", mb: 1 }}>
              {restaurantDescription}
            </Typography>

            <Typography sx={{ color: "#94a3b8", mb: 0.5 }}>
              📍 {restaurantAddress}
            </Typography>

            <Typography sx={{ color: "#94a3b8", mb: 3 }}>
              🍽️ Tables: {restaurantTables}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  onClick={() => navigate("/dashboard/qrs")}
                >
                  QR Codes
                </Button>
              </Grid>

              <Grid item xs={6}>
                <Button
                  fullWidth
                  onClick={() => navigate("/dashboard/manage")}
                >
                  Manage Orders
                </Button>
              </Grid>

              <Grid item xs={6}>
                <Button
                  fullWidth
                  onClick={() => navigate("/dashboard/history")}
                >
                  Order History
                </Button>
              </Grid>

              <Grid item xs={6}>
                <Button
                  fullWidth
                  color="error"
                  onClick={() => {
                    handleClickOpen();
                  }}
                >
                  Delete Restaurant
                </Button>

                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to delete your restaurant?"}
                  </DialogTitle>
              
                  <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={()=>{
                      removeRestaurant();
                    }} autoFocus loading={loading}>
                      Agree
                    </Button>
                  </DialogActions>
                </Dialog>

              </Grid>
            </Grid>
          </Paper>
        )}

      </Container>
    </Box>
  );
}
