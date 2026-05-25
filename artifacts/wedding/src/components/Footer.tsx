import { Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/20 bg-gradient-to-t from-card/60 to-card/20 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div className="text-center md:text-right">
            <h3 className="font-display-ar text-xl font-bold text-gold mb-4">حكاية حب</h3>
            <p className="font-body-ar text-muted-foreground text-sm leading-relaxed">
              موقع مخصص لتخليد ذكريات يوم الفرح والحب الأبدي بين أميرة وعلاء.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="font-display-ar text-xl font-bold text-gold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 font-body-ar text-sm">
              <li>
                <a href="#gallery" className="text-gold/80 hover:text-gold transition-colors">
                  معرض الصور
                </a>
              </li>
              <li>
                <a href="#messages" className="text-gold/80 hover:text-gold transition-colors">
                  الرسائل
                </a>
              </li>
              <li>
                <a href="#share" className="text-gold/80 hover:text-gold transition-colors">
                  شارك ذكرى
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="font-display-ar text-xl font-bold text-gold mb-4">معلومات</h3>
            <p className="font-body-ar text-muted-foreground text-sm">
              <span className="block">📅 ١٤ مايو ٢٠٢٦</span>
              <span className="block mt-2">💍 يوم الفرح والحب الأبدي</span>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body-ar text-sm text-gold/60 flex items-center gap-2">
            صُنع بـ <Heart size={16} className="text-red-500 fill-red-500" /> لأميرة وعلاء
          </p>
          <p className="font-display tracking-widest text-xs text-gold/40">
            © {currentYear} ETERNAL LOVE · AMIRA & ALAA
          </p>
          <p className="font-body-ar text-xs text-gold/60">
            جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}
