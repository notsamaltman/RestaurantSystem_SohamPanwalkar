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
  const [jobId, setJobId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('Waiting for menu upload');

  // 🔁 Poll OCR status
  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const res = await fetch(link+`progress/${jobId}/`);
      const data = await res.json();

      setProgress(data.progress);
      setStep(data.step);

      if (data.progress === 100) {
        clearInterval(interval);
        navigate('/register/menu-review');
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [jobId]);

  const uploadMenu = async () => {
    if (!file) return;

    setStep('Uploading menu image...');
    setProgress(5);

    const formData = new FormData();
    formData.append('menu', file);

    const res = await fetch(link, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setJobId(data.job_id);
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

        {/* Upload box */}
        {!jobId && (
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

        {/* Progress */}
        {jobId && (
          <div className="mt-8">
            <p className="text-white/80 text-sm mb-2">
              {step}
            </p>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'rgba(56,189,248,0.9)', // cyan glow
                },
              }}
            />

            <p className="text-white/40 text-xs mt-2">
              {progress}% completed
            </p>
          </div>
        )}

        {/* Actions */}
        {!jobId && (
          <Button
            fullWidth
            variant="outlined"
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
        )}
      </div>
    </div>
  );
}
