import GlassBrandBar from '../components/GlassBrandBar';
import SplitText from '../components/SplitText';
import { Button, LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverLink } from '@/utils/links';

export default function RestaurantPageTwo() {
  const navigate = useNavigate();
  const link = serverLink+'upload/';
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(localStorage.getItem("stage-2")==="true") navigate("/register/restaurant-3");
    if(localStorage.getItem("stage-1")!=="true") navigate("/register/restaurant-1");
  }, []);

  const normalizeAIMenu = (parsed) => {
  if (!parsed || !Array.isArray(parsed.menu)) return null;

  return parsed.menu.flatMap(section =>
    section.dishes.map(dish => ({
      name: dish.name ?? "",
      price: dish.price ?? "",
      description:
        dish.description ||
        dish.ai_suggested_description ||
        "",
      category: section.category,
      veg: !/chicken|prawns|fish|mutton|lamb|egg/i.test(dish.name),
    }))
  );
};

const uploadMenu = async () => {
  setLoading(true);
  if (!file) {
    setLoading(false);
    return;
  }

  try {
    const formData = new FormData();
    formData.append("menu", file);
    const token = localStorage.getItem("accessToken");

    const res = await fetch(link, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data);
    const normalizedMenu = normalizeAIMenu(data.result);

    if (!normalizedMenu || normalizedMenu.length === 0) {
      throw new Error("Menu normalization failed");
    }

    localStorage.setItem(
      "restaurant_menu",
      JSON.stringify(normalizedMenu)
    );
    localStorage.setItem("stage-2", "true");
    console.log(JSON.stringify(normalizedMenu));
    navigate("/register/restaurant-3");
  } catch (err) {
    console.error("Menu upload failed:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative h-screen bg-[#08090a]/95 flex justify-center items-center">
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
            localStorage.setItem("restaurant_name", null);
            localStorage.setItem("restaurant_description", null);
            localStorage.setItem("restaurant_address", null);
            localStorage.setItem("restaurant_tables", null);
            localStorage.setItem("stage-1", "false");
            navigate("/register/restaurant-1");
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

      <div className="w-[140] rounded-3xl bg-blue-900/5 backdrop-blur-xl border border-white/10 shadow-xl p-10">
        
        <SplitText
          text="Upload your menu"
          className="text-3xl text-white font-semibold mb-2"
          delay={50}
        />

        <p className="text-white/60 text-sm mb-8">
          Upload a clear image — we’ll handle the rest.
        </p>
               
        {!file && (
          <label className="flex flex-col items-center justify-center border border-white/15 rounded-2xl h-48 cursor-pointer hover:border-white/30 transition">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />

            <p className="text-white/70">
              {file ? file.name : 'Click to upload menu image'}
            </p>

            <p className="text-white/40 text-sm mt-2">
              JPG / PNG recommended
            </p>
          </label>
        )}

          {file && (
            <div className='flex justify-center items-center max-w-50, max-h-50'>
              <img src={URL.createObjectURL(file)} className='max-w-60, max-h-60' alt="" />
            </div>
          )}
        
          <Button
            fullWidth
            variant="outlined"
            loading={loading}
            onClick={uploadMenu}
            disabled={!file}
            sx={{
              mt: 6,
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
            Start menu scan
          </Button>
        
      </div>
    </div>
  );
}
