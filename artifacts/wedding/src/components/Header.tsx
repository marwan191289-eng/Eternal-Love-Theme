import { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';
import { Link } from 'wouter';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'الصور', href: '#gallery' },
    { label: 'الرسائل', href: '#messages' },
    { label: 'شارك ذكرى', href: '#share' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-gold/20 bg-gradient-to-b from-card/60 to-card/20 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="font-display-ar text-2xl font-bold text-gradient-gold">أميرة & علاء</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-body-ar text-gold/80 hover:text-gold transition-colors duration-300 relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
            </a>
          ))}
          <Link
            href="/admin"
            className="p-2 rounded-lg text-gold/60 hover:text-gold hover:bg-gold/10 transition-all"
          >
            <Settings size={20} />
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gold hover:bg-gold/10 rounded-lg transition-all"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gold/20 bg-card/40 backdrop-blur">
          <nav className="flex flex-col gap-4 p-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-body-ar text-gold/80 hover:text-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/admin"
              className="flex items-center gap-2 text-gold/80 hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings size={18} /> لوحة التحكم
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
