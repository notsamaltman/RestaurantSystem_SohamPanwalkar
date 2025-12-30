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

  const normalizeAIMenu = (parsed) => {
  if (!parsed || !parsed.categories) return [];

  return parsed.categories.flatMap(category =>
    category.dishes.map(dish => ({
      name: dish.name,
      price: dish.price ?? "",
      description:
        dish.description ||
        dish.ai_suggested_description ||
        "",
      category: category.name,
      veg: !/chicken|prawns|fish|mutton|egg/i.test(dish.name),
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

    const res = await fetch(link, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    const normalizedMenu = normalizeAIMenu(data.result);

    localStorage.setItem(
      "restaurant_menu",
      JSON.stringify(normalizedMenu)
    );

    navigate("/register/restaurant-3");
  } catch (err) {
    console.error("Menu upload failed:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative h-screen bg-[#08090a]/95 flex justify-center items-center">
      <GlassBrandBar topheight={100} />

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
