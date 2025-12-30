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
  const stored = localStorage.getItem("restaurant_menu");
  if (!stored) return;

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
    const token = localStorage.getItem("accessToken");

    const response = await fetch(link, 
        {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
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
      <GlassBrandBar topheight={60} />

      <div className="max-w-5xl mx-auto relative top-20">
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
