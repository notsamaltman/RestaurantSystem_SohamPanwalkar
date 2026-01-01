import GlassBrandBar from '../components/GlassBrandBar';
import { Button, TextField, Chip, Switch } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverLink } from '@/utils/links';

export default function RestaurantPageThree() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const link = serverLink+'register/';

  useEffect(() => {
    if(localStorage.getItem("stage-2")!=="true") navigate("/register/restaurant-2");
    const stored = localStorage.getItem("restaurant_menu");
  if (!stored){
    localStorage.setItem("stage-2", "false");
    navigate("/register/restaurant-2");
  }

  if(stored==[]) {
    localStorage.setItem("stage-2", "false");
    navigate("/register/restaurant-2");
  }

  try {
    const cleaned = stored
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    setMenu(JSON.parse(cleaned));
  } catch (err) {
    console.error("Invalid menu JSON:", err);
  }
}, []);

  const updateItem = (index, key, value) => {
    const updated = [...menu];
    updated[index][key] = value;
    setMenu(updated);
  };

  const finalizeMenu =async () => {
    localStorage.setItem('restaurant_menu', JSON.stringify(menu));
    const restaurant_name = localStorage.getItem("restaurant_name");
    const restaurant_description = localStorage.getItem("restaurant_description");
    const restaurant_address = localStorage.getItem("restaurant_address");
    const restaurant_tables = localStorage.getItem("restaurant_tables");
    const token = localStorage.getItem("accessToken");

    const response = await fetch(link, 
        {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        'restaurant_name': restaurant_name,
        'restaurant_description':restaurant_description,
        'restaurant_address':restaurant_address,
        'restaurant_tables':restaurant_tables,
        'restaurant_menu': JSON.stringify(menu)
      }),
    }
    );

    const data = await response.json();
    if(!response.ok){
        return;
    }

    navigate('/dashboard'); 
  };

  return (
    <div className="relative min-h-screen bg-[#08090a]/95 px-6 py-24">

      <div className="fixed top-0 left-0 w-full z-50">

      <div
      style={{top:60}}
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
          localStorage.setItem("restaurant_menu", null);
          localStorage.setItem("stage-2", "false");
          navigate("/register/restaurant-2");
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
    </div>

      <div className="max-w-5xl mx-auto relative top-30">

        <h1 className="text-3xl font-semibold text-white mb-2">
          Review your menu
        </h1>
        <p className="text-white/50 mb-10">
          AI suggested this — tweak anything before going live.
        </p>

        <div className="space-y-6">
          {menu.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Dish name"
                  value={item.name}
                  onChange={(e) => updateItem(i, 'name', e.target.value)}
                  fullWidth
                />

                <TextField
                  label="Price (₹)"
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(i, 'price', e.target.value)}
                  fullWidth
                />

                <TextField
                  label="Description"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(i, 'description', e.target.value)
                  }
                  fullWidth
                  multiline
                />

                <TextField
                  label="Category"
                  value={item.category}
                  onChange={(e) => updateItem(i, 'category', e.target.value)}
                  fullWidth
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-sm">Veg</span>
                  <Switch
                    checked={item.veg}
                    onChange={(e) =>
                      updateItem(i, 'veg', e.target.checked)
                    }
                  />
                </div>

                <Chip
                  label={item.veg ? 'VEG' : 'NON-VEG'}
                  color={item.veg ? 'success' : 'error'}
                  variant="outlined"
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          fullWidth
          variant="outlined"
          onClick={finalizeMenu}
          sx={{
            mt: 10,
            py: 2,
            fontSize: '1.1rem',
            borderRadius: '18px',
            textTransform: 'none',
            color: 'white',
            borderColor: 'rgba(255,255,255,0.25)',
            backgroundColor: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.14)',
              borderColor: 'rgba(255,255,255,0.45)',
            },
          }}
        >
          Finish setup!
        </Button>
      </div>
    </div>
  );
}
