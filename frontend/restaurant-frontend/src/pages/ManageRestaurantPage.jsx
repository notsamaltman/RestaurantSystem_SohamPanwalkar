import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
  Collapse,
  Divider,
  Stack,
  CssBaseline,
  ThemeProvider,
  createTheme
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";

const INITIAL_ORDERS = {
  pending: [
    {
      id: 121,
      table: 5,
      guests: 2,
      items: ["Butter Chicken", "Garlic Naan x2", "Coke"],
      total: 840,
      status: "Received"
    },
    {
      id: 122,
      table: 2,
      guests: 3,
      items: ["Paneer Butter Masala", "Roti x3"],
      total: 520,
      status: "Received"
    }
  ],
  completed: []
};

const ORDER_STATUSES = ["Received", "Preparing", "On the Way", "Served"];

export default function OrderManagementPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [stage, setStage] = useState(0);
  const [ordersData, setOrdersData] = useState(INITIAL_ORDERS);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const navigate = useNavigate();

  useEffect(()=>{
    async function getOrders(){
      const response = await fetch('', {});
    }
  }, []);


  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#f50057' },
    },
    typography: { fontFamily: 'Roboto, sans-serif' },
  });

  const stageKey = stage === 0 ? "pending" : "completed";
  const orders = ordersData[stageKey];
  const totalRevenue = ordersData.completed.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = ordersData.completed.length + ordersData.pending.length;

  const handleStatusChange = (orderId, newStatus) => {
    setOrdersData((prev) => {
      const newPending = prev.pending.map(o => {
        if (o.id === orderId) {
          const updated = { ...o, status: newStatus };
          if(newStatus === "Served") return null;
          return updated;
        }
        return o;
      }).filter(Boolean);

      const servedOrders = prev.pending.filter(o => o.id === orderId && newStatus === "Served");

      return {
        pending: newPending,
        completed: [...prev.completed, ...servedOrders]
      };
    });
    if(newStatus === "Served") setExpandedOrder(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: 'background.default', color: 'text.primary' }}>

        {/* Top Navbar */}
        <Box sx={{ height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", px: 4, borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={()=>{navigate("/dashboard")}}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" fontWeight={800}>Dinely</Typography>
            <Typography variant="body2" color="text.secondary">Making your restaurant faster</Typography>
          </Box>
          <IconButton onClick={() => setDarkMode(!darkMode)}>{darkMode ? <LightModeIcon /> : <DarkModeIcon />}</IconButton>
        </Box>

        <Box sx={{ display: "flex", height: "calc(100vh - 72px)" }}>

          {/* Sidebar */}
          <Box sx={{ width: 260, borderRight: 1, borderColor: 'divider', p: 3 }}>
            <Typography fontWeight={700}>Spice Route</Typography>
            <Typography variant="body2" color="text.secondary">Bandra West, Mumbai</Typography>
            <Divider sx={{ my: 3 }} />
            <Tabs orientation="vertical" value={stage} onChange={(_, v) => setStage(v)} sx={{ alignItems: "flex-start" }}>
              <Tab icon={<PendingActionsIcon />} iconPosition="start" label="Pending Orders" />
              <Tab icon={<DoneAllIcon />} iconPosition="start" label="Completed Orders" />
            </Tabs>
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1, p: 4, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Centered Stats */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mb={4} justifyContent="center" alignItems="center">
              <Card sx={{ borderRadius: 4, minWidth: 150, textAlign: 'center', boxShadow: 6, p:2 }}>
                <CardContent>
                  <Typography color="text.secondary">Total Orders</Typography>
                  <Typography variant="h4" fontWeight={800}>{totalOrders}</Typography>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 4, minWidth: 150, textAlign: 'center', boxShadow: 6, p:2 }}>
                <CardContent>
                  <Typography color="text.secondary">Total Revenue</Typography>
                  <Typography variant="h4" fontWeight={800}>₹{totalRevenue}</Typography>
                </CardContent>
              </Card>
            </Stack>

            {/* Orders List */}
            <Grid container spacing={3} justifyContent="center" maxWidth={900}>
              {orders.map(order => (
                <Grid item xs={12} md={6} key={order.id}>
                  <motion.div layout transition={{ duration: 0.3 }}>
                    <Card sx={{ borderRadius: 4, boxShadow: 8, overflow: 'hidden', '&:hover': { boxShadow: 12 }, p:1 }}>
                      <CardContent onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} sx={{ cursor: 'pointer' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography fontWeight={700}>Order #{order.id}</Typography>
                          <Select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            size="small"
                          >
                            {ORDER_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                          </Select>
                        </Box>
                        <Divider sx={{ mb:1 }} />
                        <Typography variant="body2" color="text.secondary">Table {order.table} • {order.guests} Guests</Typography>

                        <Collapse in={expandedOrder === order.id} timeout="auto" unmountOnExit>
                          <Box mt={2}>
                            {order.items.map(i => (<Typography key={i} variant="body2" sx={{ mb:0.5 }}>• {i}</Typography>))}
                            <Divider sx={{ my:1 }} />
                            <Typography mt={1} fontWeight={700} variant="body2">Total: ₹{order.total}</Typography>
                          </Box>
                        </Collapse>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
