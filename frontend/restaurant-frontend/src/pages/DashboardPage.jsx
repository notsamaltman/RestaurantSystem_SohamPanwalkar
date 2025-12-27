import { Box, AppBar, Toolbar, Typography, Button, Container, Paper } from "@mui/material";

export default function DashboardPage() {
  // TEMP: replace with backend-driven state
  const hasRestaurant = false;
  const firstName = localStorage.getItem("first_name");

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
          <Button variant="outlined">Log Out</Button>
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
        <Typography
          variant="h3"
          sx={{ fontWeight: 700, mb: 2 }}
        >
          {!hasRestaurant?("welcome, "+firstName+" register your first restaurant!!"):("welcome, "+firstName)}
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
      </Container>
    </Box>
  );
}
