import GlassBrandBar from '../components/GlassBrandBar';
import { Button, TextField, Divider, Stack, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function RestaurantPageOne() {

    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem("stage-1")==="true") navigate("/register/restaurant-2");
    }, [])

  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    tables:10,
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const setDetails = () => {
    if(!form.name || !form.description || !form.address || !form.tables){
        setError("No field's can be empty")
        setTimeout(()=>{setError("")}, 4000);
        return;
    }

    localStorage.setItem("restaurant_name", form.name);
    localStorage.setItem("restaurant_description", form.description);
    localStorage.setItem("restaurant_address", form.address);
    localStorage.setItem("restaurant_tables", form.tables);
    localStorage.setItem("stage-1", "true");

    navigate("/register/restaurant-2");
  }

  return (
    <div className="relative h-screen bg-[#08090a]/95 flex justify-center items-center">
      <GlassBrandBar topheight={70} />

      {/* Glass Card */}
      <div className="w-[130] rounded-3xl bg-blue-900/5 backdrop-blur-xl border border-white/10 shadow-xl p-10">
        
        <h1 className="text-3xl text-white font-semibold mb-2">
          Register your restaurant
        </h1>

        <p className="text-white/60 mb-8 text-sm">
          Basic details — you can refine everything later.
        </p>

        <div className="space-y-6">
          <TextField
            fullWidth
            name="name"
            label="Restaurant Name"
            variant="outlined"
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            name="description"
            label="Short Description"
            multiline
            rows={3}
            value={form.description}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            name="address"
            label="Address"
            multiline
            rows={2}
            value={form.address}
            onChange={handleChange}
          />

          <div className="pt-5">
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
          </div>


            <TextField
                fullWidth
                type="number"
                name="tables"
                label="Number of tables"
                value={form.tables}
                onChange={handleChange}
            />

            {error && (
                <Stack sx={{ mb: 2 }}>
                  <Alert severity="error">{error}</Alert>
                </Stack>
            )}

        </div>

        <Button
          fullWidth
          onClick={setDetails}
          variant="outlined"
          sx={{
            mt: 5,
            py: 1.8,
            fontSize: '1rem',
            fontWeight: 700,
            borderRadius: '16px',
            textTransform: 'none',
            color: 'white',
            borderColor: 'rgba(255,255,255,0.25)',
            backgroundColor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderColor: 'rgba(255,255,255,0.4)',
            },
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
