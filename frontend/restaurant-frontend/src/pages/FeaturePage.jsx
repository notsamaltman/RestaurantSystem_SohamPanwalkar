import SplitText from '../components/SplitText';
import RotatingText from '../components/RotatingText';
import GlassBrandBar from '../components/GlassBrandBar';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';
import { useEffect } from 'react';

export default function FeaturePage() {
  const navigate = useNavigate();

  useEffect(()=>{
    if(isAuthenticated()) navigate('/dashboard');
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-[#08090a]/95 flex justify-center items-center">
    
      <div ><GlassBrandBar topheight={100}/></div>
      
      {/* Glass card */}
      <div className="w-200 h-120 relative rounded-3xl bg-blue-900/3 backdrop-blur-xl border border-white/10 shadow-xl p-3 flex flex-col justify-around items-center top-10">
        <div>
          <div className='flex justify-center items-center'> 
            <RotatingText
              texts={['Modernize', 'Digitize']}
              mainClassName="p-6 bg-blue-900/40 font-semibold overflow-hidden  justify-center rounded-3xl text-white text-5xl m-4 border-cyan-600/95"
              staggerFrom={"first"}
              initial={{ y: "100%" }}
              animate={{ y: 0}}
              exit={{ y: "-120%" }}
              staggerDuration={0}
              splitLevelClassName="overflow-hidden pb-3 sm:pb-3 md:pb-3"
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              rotationInterval={3000}
            />
            <SplitText
              text=" your restaurant!"
              className="text-5xl text-white font-semibold text-center"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </div>
          <div className='flex justify-center items-center'>

            <SplitText
              text="Make your orders "
              className="text-5xl text-white font-semibold text-center"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />

            <RotatingText
              texts={['Faster!', 'Easier!', 'Tastier!']}
              mainClassName="p-6 bg-blue-900/40 font-semibold overflow-hidden  justify-center rounded-3xl text-white text-5xl m-4 border-cyan-600/95"
              staggerFrom={"first"}
              initial={{ y: "100%" }}
              animate={{ y: 0}}
              exit={{ y: "-120%" }}
              staggerDuration={0}
              splitLevelClassName="overflow-hidden pb-3 sm:pb-3 md:pb-3"
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              rotationInterval={3000}
            />
          </div>
        </div>

        <div>
          <Button
            variant="outlined"
            onClick={()=>{
              navigate("/register")
            }}
            sx={{
              mt: 4,
              px: 4,
              py: 2.2,
              fontSize: '1rem',
              fontWeight: 1000,
              fontFamily: 'Roboto, sans-serif',
              borderRadius: '16px',
              textTransform: 'none',
              color: 'white',
              borderColor: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(12px)',
              backgroundColor: 'rgba(255,255,255,0.05)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderColor: 'rgba(255,255,255,0.4)',
              },
              transition: 'all 0.25s ease',
            }}
          >
            Get started
          </Button>

        </div>

      </div>      

    </div>
  );
}





