import { useCallback, useEffect, useRef, useState } from "react";
import { Trash2, Lock, Globe, Play } from "lucide-react";

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
import { useReveal } from "@/hooks/useReveal";
import {
  type MediaItem,
  fetchMedia,
  deleteMedia,
  updateMedia,
  mediaUrl,
  isUnlocked,
  lock,
} from "@/lib/media";

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

const marwanMessage = `إلى أختي وحبيبتي العروسة، أرقى وأجمل أميرة نجم

عايزك بس تكوني متأكدة أني والله ما منعني عن حضور غير العذر القهري، الخارج عن الإرادة المنفردة، بس أكيد في يوم من الأيام هنتقابل وهقدر أشرحلك الموقف كامل.
سامحيني يا حبيبتي.

وسلامي لعلاء زوجك.
أترككم في رعاية الله وحفظه.
ألف مبروك يا أميرة، وربنا يسعدك ويبارك في عمرك.

مع أطيب التمنيات،
مروان نجم`;

const saraMessage = `تهنئة سارة نجم وحمزة نجم

مبروك يا الأميرة عمتو! أتمنالك السعادة والتوفيق في كل لحظات حياتك الجاية. السلام لحين اللقاء يا حبيبة قلبي أنا وحمزة، أنا بتكلم بلساني وبلسان حمزة علشان هو لسه صغير ومبيعرفش يتكلم.

مروان دايماً يقولي إني نسخة منك وأنا بقوله لأ، هي أجمل كتير بصراحة، بس لما شفت الفيديوهات والصور حسيت إن فعلاً ممكن أكون أنا في يوم من الأيام شبهك، وده أكيد هيكون أكبر ضربة حظ ليا في حياتي إني أكون حتى في نص جمالك يا الأميرة أميرة. بحبك أوي يا عمتو، وحمزة بيقولك "ها اه اه"، أكيد يقصد إنه بيحبك هو كمان. مين يشوفك ومايحبكيش يا عمتو؟

(ملحوظة: متستغربيش إني بناديه باسمه، احنا أصحاب. أنا بقوله "يا بابا" بس لما بيكون زعلان مني، لأننا ساعتها مبنبقاش صحاب.)

السلام لحين اللقاء.
باي باي يا الأميرة عمتو أميرة.

بحبك جداً وحمزة كمان بيحبك جداً.`;

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
  const [unlocked, setUnlocked] = useState(false);

  const musicRef = useRef<BackgroundMusicRef | null>(null);
  const activeVideos = useRef<Set<HTMLVideoElement>>(new Set());

  useEffect(() => {
    setUnlocked(isUnlocked());
  }, []);

  const loadMedia = useCallback(async () => {
    try {
      const items = await fetchMedia();
      setDbMedia(items);
    } catch {
      // API not available yet, ignore
    }
  }, []);

  useEffect(() => {
    loadMedia();
    const interval = setInterval(loadMedia, 8000);
    return () => clearInterval(interval);
  }, [loadMedia]);

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

  const handleDelete = async (item: MediaItem) => {
    if (!confirm("هل أنت متأكد من حذف هذه الذكرى؟")) return;
    try {
      await deleteMedia(item.id);
      setDbMedia((prev) => prev.filter((m) => m.id !== item.id));
    } catch {
      alert("تعذر الحذف، حاول مجدداً");
    }
  };

  const handleToggleVisibility = async (item: MediaItem) => {
    const next: "public" | "private" =
      item.visibility === "public" ? "private" : "public";
    try {
      const updated = await updateMedia(item.id, { visibility: next });
      setDbMedia((prev) => prev.map((m) => (m.id === item.id ? updated : m)));
    } catch {
      alert("تعذر تغيير الحالة");
    }
  };

  const visibleMedia = unlocked
    ? dbMedia
    : dbMedia.filter((m) => m.visibility === "public");

  const uploadedImages = visibleMedia.filter((m) => m.type === "image");
  const uploadedVideos = visibleMedia.filter((m) => m.type === "video");

  // Video player with music integration
  function VideoPlayer({ src }: { src: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    return (
      <video
        ref={videoRef}
        controls
        className="h-full w-full"
        preload="metadata"
        playsInline
        onPlay={() => videoRef.current && handleVideoPlay(videoRef.current)}
        onPause={() => videoRef.current && handleVideoPause(videoRef.current)}
        onEnded={() => videoRef.current && handleVideoPause(videoRef.current)}
      >
        <source src={src} />
      </video>
    );
  }

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden" dir="rtl">
      <FloatingPetals />
      <SplashScreen />
      <BackgroundMusic onRef={handleMusicRef} />

      {/* ═══════════════════════ HERO ═══════════════════════════════════════ */}
      <header className="relative isolate overflow-hidden min-h-screen flex items-center justify-center">
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
          <div className="mt-20 fade-in-up-delay-5 flex flex-col items-center gap-2 opacity-40">
            <div className="w-px h-10 gold-divider" style={{ width: "1px", height: "40px" }} />
            <p className="font-display text-[10px] tracking-widest text-gold/60 uppercase">Scroll</p>
          </div>
        </div>
      </header>

      {/* ═══════════════════════ CELEBRATION ════════════════════════════════ */}
      <section className="mx-auto max-w-4xl px-6 py-28 text-center relative z-10">
        <Reveal>
          <SectionLabel>Celebration</SectionLabel>
          <h2 className="mt-4 font-display-ar text-4xl font-bold text-gradient-gold md:text-5xl">
            احتفالٌ بالأميرة أميرة
          </h2>
          <Divider />
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-8 font-body-ar text-lg leading-[2.2] text-muted-foreground md:text-xl">
            في هذا اليوم المبارك، نجتمع — ولو من بعيد — لنحتفي بكِ يا أميرة، وبشريك
            عمركِ علاء. هذا الموقع هديّة من القلب: مرجعٌ تعودين إليه دائماً لترَيْ
            كم أنتِ محبوبة، وكم كانت لحظات يومكِ ساحرة.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto">
            {[
              { num: "٢٠٢٦", label: "سنة الفرح" },
              { num: "❦", label: "قلبٌ واحد" },
              { num: "∞", label: "حبٌّ أبدي" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-gold/30 glass py-6 px-4 shadow-card pulse-glow" style={{ animationDelay: `${Math.random()}s` }}>
                <p className="font-display-ar text-2xl font-bold text-gradient-gold">{item.num}</p>
                <p className="mt-1 font-body-ar text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════ SHARE / UPLOAD ═════════════════════════════ */}
      <section id="share" className="mx-auto max-w-3xl px-6 py-16 relative z-10">
        <Reveal className="text-center mb-10">
          <SectionLabel>Share a Memory</SectionLabel>
          <h2 className="mt-4 font-display-ar text-4xl font-bold text-gradient-gold md:text-5xl">
            أضف ذكرياتك
          </h2>
          <Divider />
          <p className="mt-4 font-body-ar text-sm text-muted-foreground">
            شارك صورك وفيديوهاتك لتُضاف لألبوم الحفل مباشرة ✦
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          {unlocked ? (
            <>
              <MediaUploader onUploaded={loadMedia} />
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => { lock(); setUnlocked(false); }}
                  className="inline-flex items-center gap-2 text-xs font-body-ar text-muted-foreground hover:text-gold transition-colors"
                >
                  <Lock className="h-3 w-3" /> قفل المساحة
                </button>
              </div>
            </>
          ) : (
            <PasswordGate onUnlocked={() => setUnlocked(true)} />
          )}
        </Reveal>
      </section>

      {/* ═══════════════════════ GALLERY ════════════════════════════════════ */}
      <section id="gallery" className="mx-auto max-w-6xl px-6 py-20 relative z-10">
        <Reveal className="text-center mb-14">
          <SectionLabel>Gallery</SectionLabel>
          <h2 className="mt-4 font-display-ar text-4xl font-bold text-gradient-gold md:text-5xl">
            لحظاتٌ لا تُنسى
          </h2>
          <Divider />
          {uploadedImages.length > 0 && (
            <p className="mt-4 font-body-ar text-sm text-muted-foreground">
              {uploadedImages.length} ذكرى من الضيوف ✦
            </p>
          )}
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {/* Uploaded images first */}
          {uploadedImages.map((img, i) => (
            <Reveal key={img.id} delay={i * 0.04}>
              <div className="group relative aspect-square overflow-hidden rounded-3xl border border-gold/25 bg-card shadow-card transition-all duration-500 hover:border-gold/60 hover:shadow-glow hover:scale-[1.02]">
                <button
                  type="button"
                  onClick={() => setLightbox(mediaUrl(img.objectPath))}
                  className="absolute inset-0 h-full w-full"
                >
                  <img
                    src={mediaUrl(img.objectPath)}
                    alt={img.caption ?? "صورة"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {(img.caption || img.uploader) && (
                    <div className="absolute bottom-0 right-0 left-0 p-3 text-right opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                      {img.caption && <p className="font-display-ar text-xs text-gold">{img.caption}</p>}
                      {img.uploader && <p className="font-body-ar text-[10px] text-muted-foreground">— {img.uploader}</p>}
                    </div>
                  )}
                </button>

                {/* Admin controls */}
                {unlocked && (
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 opacity-0 transition-all group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleDelete(img)}
                      className="rounded-full bg-background/80 p-1.5 text-destructive backdrop-blur transition-all hover:bg-destructive hover:text-white"
                      title="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(img)}
                      className="rounded-full bg-background/80 p-1.5 text-gold backdrop-blur transition-all hover:bg-gold hover:text-primary-foreground"
                      title={img.visibility === "public" ? "عامة — اضغط للإخفاء" : "خاصة — اضغط للإظهار"}
                    >
                      {img.visibility === "public" ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                )}
                {unlocked && img.visibility === "private" && (
                  <div className="absolute top-2 right-2 z-10 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-body-ar text-gold flex items-center gap-1">
                    <Lock className="h-2.5 w-2.5" /> خاصة
                  </div>
                )}
              </div>
            </Reveal>
          ))}

          {/* Seed images */}
          {seedImages.map((img, i) => (
            <Reveal key={img.id} delay={(uploadedImages.length + i) * 0.04}>
              <div className="group relative aspect-square overflow-hidden rounded-3xl border border-gold/25 bg-card shadow-card transition-all duration-500 hover:border-gold/60 hover:shadow-glow hover:scale-[1.02]">
                <button
                  type="button"
                  onClick={() => setLightbox(img.src)}
                  className="absolute inset-0 h-full w-full"
                >
                  <img
                    src={img.src}
                    alt={img.caption ?? "صورة من العرس"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {img.caption && (
                    <div className="absolute bottom-0 right-0 left-0 p-3 text-right opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                      <p className="font-display-ar text-xs text-gold">{img.caption}</p>
                    </div>
                  )}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ VIDEOS ══════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-6 py-20 relative z-10">
        <Reveal className="text-center mb-14">
          <SectionLabel>Memories</SectionLabel>
          <h2 className="mt-4 font-display-ar text-4xl font-bold text-gradient-gold md:text-5xl">
            رسائلٌ بالفيديو
          </h2>
          <Divider />
        </Reveal>

        {uploadedVideos.length === 0 ? (
          <Reveal>
            <div className="rounded-3xl border-2 border-dashed border-gold/35 glass p-14 text-center shadow-card">
              <Play className="mx-auto mb-4 h-10 w-10 text-gold/60" />
              <p className="font-display-ar text-xl text-gold">لا توجد فيديوهات بعد</p>
              <p className="mt-3 font-body-ar text-sm text-muted-foreground leading-relaxed">
                كن أول من يشارك فيديو من الحفل — ارفعه من قسم{" "}
                <a href="#share" className="text-gold underline-offset-4 hover:underline">
                  «أضف ذكرياتك»
                </a>
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {uploadedVideos.map((v, i) => (
              <Reveal key={v.id} delay={i * 0.1}>
                <figure className="overflow-hidden rounded-3xl border-2 border-gold/35 shadow-elegant">
                  <div className="aspect-video bg-background/80">
                    <VideoPlayer src={mediaUrl(v.objectPath)} />
                  </div>
                  <figcaption className="glass border-t border-gold/20 px-6 py-4 text-center">
                    <p className="font-display-ar text-base text-gold">{v.caption ?? "ذكرى من العرس"}</p>
                    {v.uploader && (
                      <p className="mt-1 font-body-ar text-xs text-muted-foreground">— {v.uploader}</p>
                    )}
                    {unlocked && (
                      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(v)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-body-ar text-xs text-gold transition-all hover:bg-gold hover:text-primary-foreground"
                        >
                          {v.visibility === "public" ? <><Globe className="h-3 w-3" /> عامة</> : <><Lock className="h-3 w-3" /> خاصة</>}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(v)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 font-body-ar text-xs text-destructive transition-all hover:bg-destructive hover:text-white"
                        >
                          <Trash2 className="h-3 w-3" /> حذف
                        </button>
                      </div>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════ MESSAGES ════════════════════════════════════ */}
      <section id="messages" className="mx-auto max-w-4xl space-y-12 px-6 py-20 relative z-10">
        <Reveal className="text-center">
          <SectionLabel>Letters</SectionLabel>
          <h2 className="mt-4 font-display-ar text-4xl font-bold text-gradient-gold md:text-5xl">
            رسائل من القلب
          </h2>
          <Divider />
        </Reveal>

        {[
          { label: "✉︎ رسالة مروان", text: marwanMessage, sig: "مروان نجم", accent: "oklch(0.82 0.13 75)" },
          { label: "✦ رسالة سارة وحمزة", text: saraMessage, sig: "سارة نجم & حمزة نجم", accent: "oklch(0.78 0.09 35)" },
        ].map((letter, i) => (
          <Reveal key={letter.label} delay={i * 0.12}>
            <article className="relative rounded-3xl border-2 border-gold/35 glass p-8 md:p-12 shadow-elegant overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                  backgroundImage: `radial-gradient(ellipse at ${i === 0 ? "90% 10%" : "10% 90%"}, color-mix(in oklab, ${letter.accent} 20%, transparent), transparent 60%)`,
                }}
              />
              <div className="absolute -top-4 right-8 rounded-full bg-background px-4 py-1.5 font-display-ar text-sm text-gold border border-gold/50 shadow-card">
                {letter.label}
              </div>
              <p className="whitespace-pre-wrap font-body-ar text-base leading-[2.3] text-foreground/90 md:text-lg relative z-10">
                {letter.text}
              </p>
              <div className="mt-8 h-px gold-divider opacity-40" />
              <p className="mt-6 text-left font-display-ar text-xl text-gold">— {letter.sig}</p>
            </article>
          </Reveal>
        ))}
      </section>

      {/* ═══════════════════════ TIMELINE ════════════════════════════════════ */}
      <section className="mx-auto max-w-3xl px-6 py-20 relative z-10">
        <Reveal className="text-center mb-14">
          <SectionLabel>Our Story</SectionLabel>
          <h2 className="mt-4 font-display-ar text-4xl font-bold text-gradient-gold md:text-5xl">
            خطواتٌ نحو الأبد
          </h2>
          <Divider />
        </Reveal>
        <div className="relative">
          <div className="absolute right-1/2 top-0 bottom-0 w-px gold-divider" style={{ width: "1px" }} />
          {[
            { icon: "💍", title: "الخطوبة", desc: "بداية القصة وأول خطوة نحو المستقبل" },
            { icon: "❦", title: "الفرح", desc: "ليلة الزفاف الأسطورية — حفل ملكي لا يُنسى" },
            { icon: "✨", title: "٢٠٢٦", desc: "عام الحب والبركة والبداية الجديدة" },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.15}>
              <div className={`relative flex items-center gap-6 mb-10 ${i % 2 === 0 ? "flex-row-reverse" : ""}`}>
                <div className="absolute right-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-background border-2 border-gold flex items-center justify-center text-lg shadow-card z-10">
                  {item.icon}
                </div>
                <div className={`w-[calc(50%-2.5rem)] rounded-2xl border border-gold/30 glass px-5 py-4 shadow-card ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                  <p className="font-display-ar text-lg font-bold text-gold">{item.title}</p>
                  <p className="mt-1 font-body-ar text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ QUOTE ════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden z-10">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 90% 70% at 50% 50%, color-mix(in oklab, oklch(0.82 0.13 75) 7%, transparent), transparent 75%)" }} />
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="font-display-ar text-3xl font-bold text-gradient-gold leading-loose md:text-4xl">
            "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا"
          </p>
          <p className="mt-4 font-display text-sm text-gold/60 tracking-widest">الروم ٢١</p>
        </Reveal>
      </section>

      {/* ═══════════════════════ FOOTER ══════════════════════════════════════ */}
      <footer className="relative mt-10 border-t border-gold/25 glass py-20 text-center z-10">
        <Reveal>
          <p className="font-display-ar text-3xl text-gradient-gold">أميرة ❦ علاء</p>
          <div className="mx-auto my-6 h-px w-28 gold-divider" />
          <p className="font-body-ar text-sm text-muted-foreground">مع كل الحب والتمنيات — من العائلة</p>
          <p className="mt-6 font-display text-xs tracking-[0.35em] text-gold/50">2026 ✦ FOREVER</p>
        </Reveal>
      </footer>

      {/* ═══════════════════════ LIGHTBOX ════════════════════════════════════ */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-background/96 p-6 backdrop-blur-2xl fade-in-up"
        >
          <img
            src={lightbox}
            alt="معاينة"
            className="max-h-[90vh] max-w-[92vw] rounded-3xl border-2 border-gold/50 object-contain shadow-glow"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-6 left-6 rounded-full border border-gold/40 bg-card/60 p-3 text-gold backdrop-blur transition-all hover:bg-gold hover:text-primary-foreground hover:shadow-glow"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
