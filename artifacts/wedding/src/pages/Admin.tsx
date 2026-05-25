import { useState, useEffect, useCallback } from 'react';
import { Upload, LogOut, Trash2, Eye, EyeOff, Plus, Save, X, Edit2, Lock, Layout, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { Link, useLocation } from 'wouter';

interface MediaItem {
  id: string;
  objectPath: string;
  externalUrl: string | null;
  type: "image" | "video";
  caption: string | null;
  uploader: string | null;
  visibility: "public" | "private";
  createdAt: string;
}

interface MessageItem {
  id: string;
  author: string;
  content: string;
  color: string;
  isVisible: boolean;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [activeTab, setActiveTab] = useState<'media' | 'messages' | 'settings'>('media');
  const [, setLocation] = useLocation();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // New message state
  const [newMsgAuthor, setNewMsgAuthor] = useState('');
  const [newMsgContent, setNewMsgContent] = useState('');
  const [newMsgColor, setNewMsgColor] = useState('#e8b4a8');

  const fetchData = useCallback(async () => {
    try {
      const [mediaRes, msgRes] = await Promise.all([
        fetch('/api/media').then(r => r.json()),
        fetch('/api/admin-api/messages?all=true').then(r => r.json())
      ]);
      setMedia(mediaRes);
      setMessages(msgRes);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin-api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        alert('كلمة المرور خاطئة');
      }
    } catch (error) {
      alert('خطأ في الاتصال بالخادم');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLocation('/');
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;
    await fetch(`/api/media/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleAddMessage = async () => {
    await fetch('/api/admin-api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: newMsgAuthor, content: newMsgContent, color: newMsgColor })
    });
    setNewMsgAuthor('');
    setNewMsgContent('');
    fetchData();
  };

  const handleUpdateMessage = async (id: string, updates: Partial<MessageItem>) => {
    await fetch(`/api/admin-api/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    fetchData();
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    await fetch(`/api/admin-api/messages/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('كلمة المرور غير متطابقة');
      return;
    }
    const res = await fetch('/api/admin-api/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (res.ok) {
      alert('تم تغيير كلمة المرور بنجاح');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      const data = await res.json();
      alert(data.error || 'فشل تغيير كلمة المرور');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]" dir="rtl">
        <div className="w-full max-w-md p-8 rounded-2xl border border-gold/30 bg-card/40 backdrop-blur">
          <h1 className="text-3xl font-bold text-center mb-8 text-gradient-gold font-display-ar">
            لوحة التحكم
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-black/40 text-white focus:border-gold/60 outline-none transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-3.5 text-gold/60">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button type="submit" className="w-full py-3 rounded-xl font-bold bg-gold text-primary-foreground hover:shadow-glow transition-all">
              دخول
            </button>
            <Link href="/" className="block text-center text-gold/60 hover:text-gold text-sm">العودة للموقع</Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground" dir="rtl">
      {/* Header */}
      <div className="border-b border-gold/20 bg-card/20 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-gradient-gold font-display-ar">لوحة التحكم</h1>
            <nav className="hidden md:flex gap-2">
              <button onClick={() => setActiveTab('media')} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'media' ? 'bg-gold text-primary-foreground' : 'text-gold/60 hover:text-gold'}`}>
                الصور والوسائط
              </button>
              <button onClick={() => setActiveTab('messages')} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'messages' ? 'bg-gold text-primary-foreground' : 'text-gold/60 hover:text-gold'}`}>
                الرسائل
              </button>
              <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-gold text-primary-foreground' : 'text-gold/60 hover:text-gold'}`}>
                الإعدادات
              </button>
            </nav>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-all flex items-center gap-2">
            <LogOut size={18} /> خروج
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {activeTab === 'media' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gold flex items-center gap-2"><ImageIcon /> إدارة الصور</h2>
              <Link href="/#share" className="px-4 py-2 bg-gold text-primary-foreground rounded-lg font-bold">إضافة صور جديدة</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {media.map((item) => (
                <div key={item.id} className="group relative aspect-square rounded-xl border border-gold/20 overflow-hidden bg-card/40">
                  <img src={`/api/storage${item.objectPath}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => handleDeleteMedia(item.id)} className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-8">
            <div className="p-8 rounded-2xl border border-gold/20 bg-card/40 backdrop-blur">
              <h2 className="text-2xl font-bold text-gold mb-6 flex items-center gap-2"><MessageSquare /> إضافة رسالة جديدة</h2>
              <div className="space-y-4">
                <input value={newMsgAuthor} onChange={e => setNewMsgAuthor(e.target.value)} placeholder="اسم المرسل" className="w-full p-3 rounded-xl border border-gold/20 bg-black/40 text-white outline-none focus:border-gold/60" />
                <textarea value={newMsgContent} onChange={e => setNewMsgContent(e.target.value)} placeholder="محتوى الرسالة" className="w-full p-3 rounded-xl border border-gold/20 bg-black/40 text-white h-32 outline-none focus:border-gold/60" />
                <div className="flex gap-4 items-center">
                  <input type="color" value={newMsgColor} onChange={e => setNewMsgColor(e.target.value)} className="h-10 w-20 bg-black/40 border border-gold/20 rounded cursor-pointer" />
                  <button onClick={handleAddMessage} className="px-8 py-2 rounded-xl bg-gold text-primary-foreground font-bold hover:shadow-glow transition-all">إضافة الرسالة</button>
                </div>
              </div>
            </div>
            <div className="grid gap-6">
              {messages.map((msg) => (
                <div key={msg.id} className="p-6 rounded-2xl border border-gold/20 bg-card/40 backdrop-blur">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: msg.color }}>{msg.author}</h3>
                      <p className="text-xs text-gold/40 mt-1">{msg.isVisible ? 'عامة' : 'مخفية'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdateMessage(msg.id, { isVisible: !msg.isVisible })} className="p-2 rounded-lg border border-gold/20 text-gold hover:bg-gold/10">
                        {msg.isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button onClick={() => handleDeleteMessage(msg.id)} className="p-2 rounded-lg border border-red-900/50 text-red-400 hover:bg-red-900/20">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gold/80 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-md mx-auto p-8 rounded-2xl border border-gold/20 bg-card/40 backdrop-blur">
            <h2 className="text-2xl font-bold text-gold mb-8 flex items-center gap-2"><Lock /> تغيير كلمة المرور</h2>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="كلمة المرور الحالية" className="w-full p-3 rounded-xl border border-gold/20 bg-black/40 text-white outline-none focus:border-gold/60" required />
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="كلمة المرور الجديدة" className="w-full p-3 rounded-xl border border-gold/20 bg-black/40 text-white outline-none focus:border-gold/60" required />
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="تأكيد كلمة المرور" className="w-full p-3 rounded-xl border border-gold/20 bg-black/40 text-white outline-none focus:border-gold/60" required />
              <button type="submit" className="w-full py-3 rounded-xl bg-gold text-primary-foreground font-bold hover:shadow-glow transition-all">حفظ التغييرات</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
