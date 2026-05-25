import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface StartOverlayProps {
  onStart: () => void;
}

export function StartOverlay({ onStart }: StartOverlayProps) {
  const [show, setShow] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleStart = () => {
    setShow(false);
    onStart();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center">
      <div
        className={`text-center transform transition-all duration-700 ${
          animate ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        <div className="mb-8 flex justify-center">
          <Heart size={80} className="text-gold animate-pulse fill-gold" />
        </div>

        <h1 className="font-display-ar text-6xl font-bold text-gradient-gold mb-4">
          أميرة & علاء
        </h1>

        <p className="font-body-ar text-xl text-gold/80 mb-8 max-w-md mx-auto">
          حكاية حب تبدأ، ومرجعٌ خالد لذكرى الفرح
        </p>

        <div className="mb-12 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent" />

        <p className="font-body-ar text-sm text-gold/60 mb-8">
          اضغط على الزر لبدء الرحلة الجميلة
        </p>

        <button
          onClick={handleStart}
          className="px-12 py-4 rounded-full bg-gradient-to-r from-gold to-gold/80 text-primary-foreground font-bold text-lg font-body-ar hover:shadow-2xl hover:shadow-gold/50 transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          ابدأ الرحلة 💍
        </button>

        <p className="font-body-ar text-xs text-gold/40 mt-8">
          سيتم تشغيل الموسيقى والألعاب النارية تلقائياً
        </p>
      </div>
    </div>
  );
}
