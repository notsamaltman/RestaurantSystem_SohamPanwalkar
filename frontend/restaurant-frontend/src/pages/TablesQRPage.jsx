import { Box, Typography, Container, Grid, Paper, Button } from "@mui/material";
import { serverLink } from "@/utils/links";
import { useNavigate } from "react-router-dom";

export default function TablesQRPage() {
  const tablesCount = parseInt(localStorage.getItem("restaurant_tables")) || 0;
  const restaurantId = localStorage.getItem("restaurant_id");
  const navigate = useNavigate();

  const getQrUrl = (table) =>
    `${serverLink}media/qrcodes/restaurant_${restaurantId}_table_${table}.png`;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, #020617 50%, #020617 100%)",
        color: "white",
        py: 8,
      }}
    >
    
    <div
        style={{top:0}}
          className="
            mx-auto
            max-w-6xl
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

          <Button
          variant="outlined"
          onClick={() => {
            navigate("/dashboard");
          }}
          sx={{
            mb: 3,
            px: 3,
            py: 1,
            borderRadius: '14px',
            textTransform: 'none',
            color: 'rgba(255,255,255,0.85)',
            borderColor: 'rgba(255,255,255,0.25)',
            backgroundColor: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(10px)',
            alignSelf: 'flex-start',
            alignItems:'center',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderColor: 'rgba(255,255,255,0.45)',
            },
          }}
        >
          ← Back
        </Button>

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
            making your restaurant faster!
          </div>
        </div>

      <Container maxWidth="lg" sx={{
        position:"relative",
        top:"50px",
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Table QR Codes
        </Typography>
        <Typography sx={{ color: "#94a3b8", mb: 5 }}>
          Print and place these QR codes on tables.
        </Typography>

        <Grid container spacing={3}>
          {Array.from({ length: tablesCount }, (_, i) => i + 1).map((table) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={table}>
              <Paper
                sx={{
                  backgroundColor: "rgba(2,6,23,0.9)",
                  border: "1px solid #1e293b",
                  borderRadius: 4,
                  p: 3,
                  textAlign: "center",
                }}
              >
                <Typography sx={{ mb: 2, fontWeight: 600 }}>
                  Table {table}
                </Typography>

                <Box
                  component="img"
                  src={getQrUrl(table)}
                  alt={`QR for table ${table}`}
                  sx={{
                    width: "100%",
                    maxWidth: 180,
                    borderRadius: 2,
                    mb: 2,
                    backgroundColor: "white",
                    p: 1,
                  }}
                />

                <Button
                  fullWidth
                  variant="outlined"
                  href={getQrUrl(table)}
                  download
                  sx={{
                    borderRadius: 3,
                    borderColor: "#334155",
                    color: "white",
                    ":hover": { borderColor: "white" },
                  }}
                >
                  Download QR
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
