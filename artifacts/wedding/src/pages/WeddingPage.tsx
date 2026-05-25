import { useCallback, useEffect, useRef, useState } from "react";
import { Trash2, Lock, Globe, Play, Settings, Eye, EyeOff, MessageSquare } from "lucide-react";
import { Link } from "wouter";

import heroBg from "@/assets/hero-bg.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

import vogue from "@assets/Screenshot_2026-05-16_023241_1779688398562.png";
import p1 from "@assets/WhatsApp_Image_2026-05-15_at_02.47.53_1779688398570.jpeg";
import p2 from "@assets/WhatsApp_Image_2026-05-14_at_16.08.18_(4)_1779688398571.jpeg";
import p3 from "@assets/WhatsApp_Image_2026-05-14_at_16.08.18_(3)_1779688398572.jpeg";
import p4 from "@assets/WhatsApp_Image_2026-05-14_at_16.08.18_(2)_1779688398573.jpeg";
import p5 from "@assets/WhatsApp_Image_2026-05-14_at_16.08.18_(1)_1779688398573.jpeg";
import p6 from "@assets/WhatsApp_Image_2026-05-14_at_16.08.18_1779688398574.jpeg";
import p7 from "@assets/WhatsApp_Image_2026-05-14_at_16.08.17_(4)_1779688398575.jpeg";
import p8 from "@assets/WhatsApp_Image_2026-05-14_at_16.08.17_(3)_1779688398576.jpeg";
import p9 from "@assets/WhatsApp_Image_2026-05-14_at_16.08.17_(2)_1779688398576.jpeg";
import p10 from "@assets/WhatsApp_Image_2026-05-14_at_16.08.17_(1)_1779688398577.jpeg";
import p11 from "@assets/WhatsApp_Image_2026-05-14_at_16.08.17_1779688398578.jpeg";
import p12 from "@assets/WhatsApp_Image_2026-05-14_at_16.08.16_(1)_1779688398579.jpeg";
import p13 from "@assets/WhatsApp_Image_2026-05-14_at_16.08.16_1779688398581.jpeg";

import { BackgroundMusic, type BackgroundMusicRef } from "@/components/BackgroundMusic";
import { SplashScreen } from "@/components/SplashScreen";
import { FloatingPetals } from "@/components/FloatingPetals";
import { PasswordGate } from "@/components/PasswordGate";
import { MediaUploader } from "@/components/MediaUploader";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MemorySidebar } from "@/components/MemorySidebar";
import { Fireworks } from "@/components/Fireworks";
import { useReveal } from "@/hooks/useReveal";
import {
  type MediaItem,
  fetchMedia,
  deleteMedia,
  updateMedia,
  mediaUrl,
  resolveVideoUrl,
  buildEmbedUrl,
  isExternalEmbedUrl,
  isUnlocked,
} from "@/lib/media";

interface MessageItem {
  id: string;
  author: string;
  content: string;
  color: string;
  isVisible: boolean;
}

// ─── Video player ────────────────────────────────────────────────────────────
function VideoPlayer({
  item,
  onPlay,
  onPause,
}: {
  item: { objectPath: string; externalUrl?: string | null };
  onPlay: (v: HTMLVideoElement) => void;
  onPause: (v: HTMLVideoElement) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [err, setErr] = useState(false);

  const externalUrl = item.externalUrl ?? null;
  const objectPath = item.objectPath;

  useEffect(() => {
    if (externalUrl) {
      if (isExternalEmbedUrl(externalUrl)) {
        setSrc(buildEmbedUrl(externalUrl));
      } else {
        setSrc(externalUrl);
      }
      return;
    }
    if (!objectPath) return;
    let cancelled = false;
    resolveVideoUrl(objectPath)
      .then((url) => { if (!cancelled) setSrc(url); })
      .catch(() => { if (!cancelled) setErr(true); });
    return () => { cancelled = true; };
  }, [externalUrl, objectPath]);

  if (err) {
    return (
      <div className="flex h-full w-full items-center justify-center text-muted-foreground font-body-ar text-sm">
        تعذّر تحميل الفيديو
      </div>
    );
  }
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (externalUrl && isExternalEmbedUrl(externalUrl)) {
    return (
      <iframe
        src={src}
        className="h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="فيديو"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      controls
      className="h-full w-full"
      preload="metadata"
      playsInline
      src={src}
      onPlay={() => videoRef.current && onPlay(videoRef.current)}
      onPause={() => videoRef.current && onPause(videoRef.current)}
      onEnded={() => videoRef.current && onPause(videoRef.current)}
    />
  );
}

// ─── Seed images ──────────────────────────────────────────────────────────────
const seedImages = [
  { id: "s-vogue", src: vogue, caption: "علاء وأميرة — Vogue Edition" },
  { id: "s-p1", src: p1, caption: "العروسان في حديقة الفرح" },
  { id: "s-p12", src: p12, caption: "أجمل يوم في العمر" },
  { id: "s-p13", src: p13, caption: "لحظة خالدة أمام باب المسجد" },
  { id: "s-p11", src: p11, caption: "عقد القران" },
  { id: "s-g1", src: g1, caption: "لحظات أنيقة" },
  { id: "s-g2", src: g6, caption: "حفل ملكي" },
  { id: "s-g3", src: g2, caption: "خاتم العمر" },
  { id: "s-p2", src: p2, caption: "أميرة الجميلة" },
  { id: "s-p3", src: p3, caption: "إطلالة راقية" },
  { id: "s-p4", src: p4, caption: "ملكة الألوان" },
  { id: "s-p5", src: p5, caption: "إطلالة كلاسيكية" },
  { id: "s-p6", src: p6, caption: "أميرة في كل وقت" },
  { id: "s-p7", src: p7, caption: "ابتسامة تفرح القلب" },
  { id: "s-p8", src: p8, caption: "أناقة أصيلة" },
  { id: "s-p9", src: p9, caption: "في أجمل حلة" },
  { id: "s-p10", src: p10, caption: "ذوق رفيع" },
  { id: "s-g4", src: g3, caption: "ضوء الشموع" },
  { id: "s-g5", src: g5, caption: "حلاوة اليوم" },
  { id: "s-g6", src: g4, caption: "زخرفة الفرح" },
];

// ─── Helper components ────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display tracking-[0.45em] text-xs text-gold/75 uppercase">
      {children}
    </p>
  );
}

function Divider({ className = "w-24" }: { className?: string }) {
  return <div className={`mx-auto mt-5 h-px gold-divider ${className}`} />;
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function WeddingPage() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [dbMedia, setDbMedia] = useState<MediaItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const [showFireworks, setShowFireworks] = useState(true);

  const musicRef = useRef<BackgroundMusicRef | null>(null);
  const activeVideos = useRef<Set<HTMLVideoElement>>(new Set());

  useEffect(() => {
    setUnlocked(isUnlocked());
    // Hide fireworks after 5 seconds
    const timer = setTimeout(() => setShowFireworks(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [mediaRes, msgRes] = await Promise.all([
        fetchMedia(),
        fetch("/api/admin-api/messages").then(r => r.json())
      ]);
      setDbMedia(mediaRes);
      setMessages(msgRes);
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleMusicRef = useCallback((ref: BackgroundMusicRef) => {
    musicRef.current = ref;
  }, []);

  const handleVideoPlay = useCallback((video: HTMLVideoElement) => {
    activeVideos.current.add(video);
    if (activeVideos.current.size === 1) musicRef.current?.pauseForVideo();
  }, []);

  const handleVideoPause = useCallback((video: HTMLVideoElement) => {
    activeVideos.current.delete(video);
    if (activeVideos.current.size === 0) musicRef.current?.resumeAfterVideo();
  }, []);

  const visibleMedia = unlocked
    ? dbMedia
    : dbMedia.filter((m) => m.visibility === "public");

  const uploadedImages = visibleMedia.filter((m) => m.type === "image");
  const uploadedVideos = visibleMedia.filter((m) => m.type === "video");

  const allImages = seedImages.concat(uploadedImages.map(m => ({ id: m.id, src: mediaUrl(m.objectPath), caption: m.caption || "" })));

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden" dir="rtl">
      {/* Fireworks on page load */}
      {showFireworks && <Fireworks />}

      <FloatingPetals />
      <SplashScreen />
      <BackgroundMusic onRef={handleMusicRef} />
      <Header />

      {/* Memory Sidebar */}
      <MemorySidebar images={allImages} position="right" />

      {/* ═══════════════════════ HERO ═══════════════════════════════════════ */}
      <header className="relative isolate overflow-hidden min-h-screen flex items-center justify-center pt-20">
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          style={{ opacity: 0.3 }}
        />
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-veil)" }} />
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, color-mix(in oklab, oklch(0.82 0.13 75) 6%, transparent), transparent 70%)",
          }}
        />

        <div className="mx-auto max-w-5xl px-6 py-32 text-center relative z-10">
          <p className="font-display tracking-[0.5em] text-xs text-gold/80 uppercase fade-in-up">
            A Wedding Tribute · ٢٠٢٦
          </p>

          <div className="mt-10 flex flex-col items-center fade-in-up-delay-1">
            <h1 className="font-display-ar text-7xl font-bold leading-none text-gradient-gold md:text-9xl">
              أميرة
            </h1>
            <span
              className="my-5 font-display text-3xl italic float md:text-4xl"
              style={{ color: "oklch(0.78 0.09 35)" }}
            >
              &amp;
            </span>
            <h1 className="font-display-ar text-7xl font-bold leading-none text-gradient-gold md:text-9xl">
              علاء
            </h1>
          </div>

          <div className="mx-auto mt-10 h-px w-48 gold-divider fade-in-up-delay-2" />

          <p className="ornament mx-auto mt-8 max-w-2xl font-body-ar text-lg text-muted-foreground md:text-xl fade-in-up-delay-3">
            حكاية حب تبدأ، ومرجعٌ خالد لذكرى الفرح
          </p>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-4 fade-in-up-delay-4">
            <a
              href="#gallery"
              className="inline-flex items-center gap-3 rounded-full border border-gold/60 bg-card/40 px-8 py-3.5 font-body-ar text-base text-gold backdrop-blur transition-all duration-300 hover:bg-gold hover:text-primary-foreground hover:shadow-glow hover:scale-105"
            >
              ابدأ الرحلة <span className="text-lg">↓</span>
            </a>
            <a
              href="#share"
              className="inline-flex items-center gap-3 rounded-full bg-gold px-8 py-3.5 font-body-ar text-base text-primary-foreground transition-all duration-300 hover:shadow-glow hover:scale-105"
            >
              <span className="heartbeat">❦</span> شارك ذكرى
            </a>
            <a
              href="#messages"
              className="inline-flex items-center gap-3 rounded-full border border-gold/30 bg-card/20 px-8 py-3.5 font-body-ar text-base text-gold/80 backdrop-blur transition-all duration-300 hover:border-gold/60 hover:text-gold hover:scale-105"
            >
              ✉︎ رسائل من القلب
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-gold/40 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-gold/60 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════ GALLERY ═════════════════════════════════════ */}
      <section id="gallery" className="relative py-32 px-6">
        <div className="mx-auto max-w-7xl text-center">
          <Reveal>
            <SectionLabel>The Gallery</SectionLabel>
            <h2 className="mt-4 font-display-ar text-5xl text-gradient-gold">معرض الصور</h2>
            <Divider />
          </Reveal>

          <div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allImages.map((img, idx) => (
              <Reveal key={img.id} delay={idx * 0.05} className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-card/20">
                <img
                  src={img.src}
                  alt={img.caption}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-6 text-right">
                  <p className="font-body-ar text-sm text-gold/90">{img.caption}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ MESSAGES ════════════════════════════════════ */}
      <section id="messages" className="relative py-32 px-6 bg-card/10">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <SectionLabel>Words of Love</SectionLabel>
            <h2 className="mt-4 font-display-ar text-5xl text-gradient-gold">رسائل من القلب</h2>
            <Divider />
          </Reveal>

          <div className="mt-20 space-y-12">
            {messages.map((msg, idx) => (
              <Reveal key={msg.id} delay={idx * 0.1} className="relative p-8 md:p-12 rounded-2xl border border-gold/20 bg-card/40 backdrop-blur text-right">
                <div className="absolute -top-6 right-10 h-12 w-12 rounded-full bg-gold flex items-center justify-center text-primary-foreground shadow-glow">
                  <MessageSquare size={24} />
                </div>
                <h3 className="font-display-ar text-2xl font-bold mb-6" style={{ color: msg.color }}>{msg.author}</h3>
                <div className="font-body-ar text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {msg.content}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SHARE ═══════════════════════════════════════ */}
      <section id="share" className="relative py-32 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <SectionLabel>Share a Memory</SectionLabel>
            <h2 className="mt-4 font-display-ar text-5xl text-gradient-gold">شاركنا فرحتنا</h2>
            <Divider />
          </Reveal>

          <div className="mt-16">
            {unlocked ? (
              <div className="p-8 rounded-2xl border border-gold/30 bg-card/40 backdrop-blur">
                <MediaUploader onUploaded={loadData} />
              </div>
            ) : (
              <PasswordGate onUnlocked={() => setUnlocked(true)} />
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
