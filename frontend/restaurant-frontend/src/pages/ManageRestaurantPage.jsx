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
import { motion } from "framer-motion";
import { useNavigate} from "react-router-dom";
import { serverLink } from "@/utils/links";

export default function OrderManagementPage() {
  const navigate = useNavigate();
  const restaurantId = localStorage.getItem("restaurant_id");
  const link = serverLink+`currentorders/${restaurantId}/`

  const [darkMode, setDarkMode] = useState(true);
  const [stage, setStage] = useState(0);
  const [ordersData, setOrdersData] = useState({
    pending: [],
    completed: [],
  });

  /* -------------------- THEME -------------------- */
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#1976d2" },
    },
    typography: { fontFamily: "Roboto, sans-serif" },
  });

  /* -------------------- FETCH ORDERS -------------------- */
  useEffect(() => {
  let isMounted = true;

  async function fetchOrders() {
    try {
      const res = await fetch(link, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();

      if (!isMounted) return;

      setOrdersData({
        pending: data.pending_orders.map(normalizeOrder),
        completed: data.served_orders.map(normalizeOrder),
      });
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  }

  // 🔹 initial fetch
  fetchOrders();

  // 🔹 poll every 5 seconds
  const interval = setInterval(fetchOrders, 5000);

  // 🔹 cleanup
  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, [link]);


  /* -------------------- NORMALIZE BACKEND DATA -------------------- */
  function normalizeOrder(order) {
    const total = order.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    return {
      id: order.order_id,
      table: order.table_number,
      status: order.status,
      items: order.items,
      total,
    };
  }

  /* -------------------- STATUS CHANGE -------------------- */
  async function handleStatusChange(orderId, newStatus) {
    const link = serverLink+`updateorder/${orderId}/`;
    try {
      await fetch(link, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // Optimistic UI update
      setOrdersData((prev) => {
        const order = prev.pending.find((o) => o.id === orderId);
        if (!order) return prev;

        if (newStatus === "served") {
          return {
            pending: prev.pending.filter((o) => o.id !== orderId),
            completed: [...prev.completed, { ...order, status: "served" }],
          };
        }

        return {
          ...prev,
          pending: prev.pending.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          ),
        };
      });
    } catch (err) {
      console.error("Status update failed:", err);
    }
  }

  const stageKey = stage === 0 ? "pending" : "completed";
  const orders = ordersData[stageKey];

  const totalOrders =
    ordersData.pending.length + ordersData.completed.length;

  const totalRevenue = ordersData.completed.reduce(
    (sum, o) => sum + o.total,
    0
  );

  /* -------------------- UI -------------------- */
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box minHeight="100vh">

        {/* TOP BAR */}
        <Box
          sx={{
            height: 72,
            px: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={() => navigate("/dashboard")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" fontWeight={800}>
              Dinely
            </Typography>
          </Box>

          <IconButton onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>

        <Box display="flex" height="calc(100vh - 72px)">

          {/* SIDEBAR */}
          <Box sx={{ width: 260, p: 3, borderRight: 1, borderColor: "divider" }}>
            <Typography fontWeight={700}>Orders</Typography>
            <Divider sx={{ my: 3 }} />
            <Tabs
              orientation="vertical"
              value={stage}
              onChange={(_, v) => setStage(v)}
            >
              <Tab icon={<PendingActionsIcon />} iconPosition="start" label="Pending" />
              <Tab icon={<DoneAllIcon />} iconPosition="start" label="Completed" />
            </Tabs>
          </Box>

          {/* MAIN */}
          <Box flex={1} p={4} overflow="auto">

            {/* STATS */}
            <Stack direction="row" spacing={3} mb={4}>
              <StatCard label="Total Orders" value={totalOrders} />
              <StatCard label="Revenue" value={`₹${totalRevenue}`} />
            </Stack>

            {/* ORDERS */}
            <Grid container spacing={3}>
              {orders.map((order) => (
                <Grid item xs={12} md={6} key={order.id}>
                  <motion.div layout>
                    <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
                      <CardContent>

                        <Box display="flex" justifyContent="space-between">
                          <Typography fontWeight={700}>
                            Order #{order.id}
                          </Typography>

                          {stage === 0 && (
                            <Select
                              size="small"
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value)
                              }
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="preparing">Preparing</MenuItem>
                              <MenuItem value="ready">Ready</MenuItem>
                              <MenuItem value="served">Served</MenuItem>
                            </Select>
                          )}
                        </Box>

                        <Typography variant="body2" color="text.secondary">
                          Table {order.table}
                        </Typography>

                        <Divider sx={{ my: 1 }} />

                        {order.items.map((item, i) => (
                          <Box
                            key={i}
                            display="flex"
                            justifyContent="space-between"
                          >
                            <Typography variant="body2">
                              {item.name} × {item.quantity}
                            </Typography>
                            <Typography variant="body2">
                              ₹{item.price * item.quantity}
                            </Typography>
                          </Box>
                        ))}

                        <Divider sx={{ my: 1 }} />

                        <Box display="flex" justifyContent="space-between">
                          <Typography fontWeight={700}>Total</Typography>
                          <Typography fontWeight={700}>
                            ₹{order.total}
                          </Typography>
                        </Box>
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

/* -------------------- SMALL COMPONENT -------------------- */
function StatCard({ label, value }) {
  return (
    <Card sx={{ minWidth: 160, textAlign: "center", borderRadius: 4 }}>
      <CardContent>
        <Typography color="text.secondary">{label}</Typography>
        <Typography variant="h4" fontWeight={800}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
