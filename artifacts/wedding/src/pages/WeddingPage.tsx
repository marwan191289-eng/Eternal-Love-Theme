import { useCallback, useRef, useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import { BackgroundMusic, type BackgroundMusicRef } from "@/components/BackgroundMusic";
import { SplashScreen } from "@/components/SplashScreen";
import { FloatingPetals } from "@/components/FloatingPetals";
import { useReveal } from "@/hooks/useReveal";

const seedImages = [
  { id: "seed-1", src: g1, caption: "لحظات أنيقة" },
  { id: "seed-2", src: g6, caption: "حفل ملكي" },
  { id: "seed-3", src: g2, caption: "خاتم العمر" },
  { id: "seed-4", src: g3, caption: "ضوء الشموع" },
  { id: "seed-5", src: g5, caption: "حلاوة اليوم" },
  { id: "seed-6", src: g4, caption: "زخرفة الفرح" },
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

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display tracking-[0.45em] text-xs text-gold/75 uppercase">
      {children}
    </p>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 font-display-ar text-4xl font-bold text-gradient-gold md:text-5xl">
      {children}
    </h2>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Divider({ className = "w-24" }: { className?: string }) {
  return <div className={`mx-auto mt-5 h-px gold-divider ${className}`} />;
}

// ─── Reveal wrapper ───────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function WeddingPage() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const musicRef = useRef<BackgroundMusicRef | null>(null);
  const activeVideos = useRef<Set<HTMLVideoElement>>(new Set());

  const handleMusicRef = useCallback((ref: BackgroundMusicRef) => {
    musicRef.current = ref;
  }, []);

  const handleVideoPlay = useCallback((video: HTMLVideoElement) => {
    activeVideos.current.add(video);
    if (activeVideos.current.size === 1) {
      musicRef.current?.pauseForVideo();
    }
  }, []);

  const handleVideoPause = useCallback((video: HTMLVideoElement) => {
    activeVideos.current.delete(video);
    if (activeVideos.current.size === 0) {
      musicRef.current?.resumeAfterVideo();
    }
  }, []);

  const VideoPlayer = ({ src, title }: { src: string; title?: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    return (
      <div className="aspect-video bg-background/80 rounded-t-2xl overflow-hidden">
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
      </div>
    );
  };

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden" dir="rtl">
      {/* Background decorations */}
      <FloatingPetals />

      {/* Splash */}
      <SplashScreen />

      {/* Music player */}
      <BackgroundMusic onRef={handleMusicRef} />

      {/* ═══════════════════════════ HERO ═══════════════════════════════════ */}
      <header className="relative isolate overflow-hidden min-h-screen flex items-center justify-center">
        {/* Background image */}
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          style={{ opacity: 0.35 }}
        />

        {/* Veil gradient */}
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-veil)" }}
        />

        {/* Decorative arcs */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, color-mix(in oklab, oklch(0.82 0.13 75) 6%, transparent), transparent 70%)",
          }}
        />

        {/* Hero content */}
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
              ابدأ الرحلة
              <span className="text-lg">↓</span>
            </a>
            <a
              href="#messages"
              className="inline-flex items-center gap-3 rounded-full bg-gold px-8 py-3.5 font-body-ar text-base text-primary-foreground transition-all duration-300 hover:shadow-glow hover:scale-105"
            >
              <span className="heartbeat">❦</span> رسائل من القلب
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 fade-in-up-delay-5 flex flex-col items-center gap-2 opacity-50">
            <div className="w-px h-10 gold-divider" style={{ width: "1px", height: "40px" }} />
            <p className="font-display text-[10px] tracking-widest text-gold/60 uppercase">Scroll</p>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════ CELEBRATION ════════════════════════════ */}
      <section className="mx-auto max-w-4xl px-6 py-28 text-center relative z-10">
        <Reveal>
          <SectionLabel>Celebration</SectionLabel>
          <SectionHeading>احتفالٌ بالأميرة أميرة</SectionHeading>
          <Divider />
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-8 font-body-ar text-lg leading-[2.2] text-muted-foreground md:text-xl">
            في هذا اليوم المبارك، نجتمع — ولو من بعيد — لنحتفي بكِ يا أميرة، وبشريك
            عمركِ علاء. هذا الموقع هديّة من القلب: مرجعٌ تعودين إليه دائماً لترَيْ
            كم أنتِ محبوبة، وكم كانت لحظات يومكِ ساحرة.
          </p>
        </Reveal>

        {/* Stats row */}
        <Reveal delay={0.25}>
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto">
            {[
              { num: "٢٠٢٦", label: "سنة الفرح" },
              { num: "❦", label: "قلبٌ واحد" },
              { num: "∞", label: "حبٌّ أبدي" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-gold/30 bg-card/40 backdrop-blur py-6 px-4 shadow-card"
              >
                <p className="font-display-ar text-2xl font-bold text-gradient-gold">
                  {item.num}
                </p>
                <p className="mt-1 font-body-ar text-xs text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════ GALLERY ════════════════════════════════ */}
      <section id="gallery" className="mx-auto max-w-6xl px-6 py-20 relative z-10">
        <Reveal className="text-center mb-14">
          <SectionLabel>Gallery</SectionLabel>
          <SectionHeading>لحظاتٌ لا تُنسى</SectionHeading>
          <Divider />
          <p className="mt-4 font-body-ar text-sm text-muted-foreground">
            {seedImages.length} لحظة محفورة في الذاكرة ✦
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {seedImages.map((img, i) => (
            <Reveal key={img.id} delay={i * 0.07}>
              <div className="group relative aspect-square overflow-hidden rounded-3xl border border-gold/25 bg-card shadow-card transition-all duration-500 hover:border-gold/60 hover:shadow-glow hover:scale-[1.02]">
                <button
                  type="button"
                  onClick={() => setLightbox(img.src)}
                  className="absolute inset-0 h-full w-full"
                  aria-label="عرض الصورة"
                >
                  <img
                    src={img.src}
                    alt={img.caption ?? "صورة من العرس"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/10 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

                  {/* Caption */}
                  {img.caption && (
                    <div className="absolute bottom-0 right-0 left-0 p-4 text-right opacity-0 transition-all duration-400 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                      <p className="font-display-ar text-sm text-gold drop-shadow-lg">
                        {img.caption}
                      </p>
                    </div>
                  )}

                  {/* Gold corner accent */}
                  <div className="absolute top-3 right-3 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                    <span className="text-gold/60 text-xs">✦</span>
                  </div>
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════ MESSAGES ═══════════════════════════════ */}
      <section id="messages" className="mx-auto max-w-4xl space-y-12 px-6 py-20 relative z-10">
        <Reveal className="text-center">
          <SectionLabel>Letters</SectionLabel>
          <SectionHeading>رسائل من القلب</SectionHeading>
          <Divider />
        </Reveal>

        {/* Marwan's letter */}
        <Reveal delay={0.1}>
          <article className="relative rounded-3xl border-2 border-gold/35 glass p-8 md:p-12 shadow-elegant overflow-hidden">
            {/* Decorative background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 90% 10%, color-mix(in oklab, oklch(0.82 0.13 75) 15%, transparent), transparent 60%)",
              }}
            />
            {/* Label */}
            <div className="absolute -top-4 right-8 rounded-full bg-background px-4 py-1.5 font-display-ar text-sm text-gold border border-gold/50 shadow-card">
              ✉︎ رسالة مروان
            </div>
            <p className="whitespace-pre-wrap font-body-ar text-base leading-[2.3] text-foreground/90 md:text-lg relative z-10">
              {marwanMessage}
            </p>
            <div className="mt-8 h-px gold-divider opacity-50" />
            <p className="mt-6 text-left font-display-ar text-xl text-gold">
              — مروان نجم
            </p>
          </article>
        </Reveal>

        {/* Sara's letter */}
        <Reveal delay={0.15}>
          <article className="relative rounded-3xl border-2 border-gold/35 glass p-8 md:p-12 shadow-elegant overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 10% 90%, color-mix(in oklab, oklch(0.78 0.09 35) 20%, transparent), transparent 60%)",
              }}
            />
            <div className="absolute -top-4 right-8 rounded-full bg-background px-4 py-1.5 font-display-ar text-sm text-gold border border-gold/50 shadow-card">
              ✦ رسالة سارة وحمزة
            </div>
            <p className="whitespace-pre-wrap font-body-ar text-base leading-[2.3] text-foreground/90 md:text-lg relative z-10">
              {saraMessage}
            </p>
            <div className="mt-8 h-px gold-divider opacity-50" />
            <p className="mt-6 text-left font-display-ar text-xl text-gold">
              — سارة نجم &amp; حمزة نجم
            </p>
          </article>
        </Reveal>
      </section>

      {/* ═══════════════════════════ TIMELINE ═══════════════════════════════ */}
      <section className="mx-auto max-w-3xl px-6 py-20 relative z-10">
        <Reveal className="text-center mb-14">
          <SectionLabel>Our Story</SectionLabel>
          <SectionHeading>خطواتٌ نحو الأبد</SectionHeading>
          <Divider />
        </Reveal>

        <div className="relative">
          {/* Center line */}
          <div className="absolute right-1/2 top-0 bottom-0 w-px gold-divider" style={{ width: "1px" }} />

          {[
            { icon: "💍", title: "الخطوبة", desc: "بداية القصة وأول خطوة نحو المستقبل" },
            { icon: "❦", title: "الفرح", desc: "ليلة الزفاف الأسطورية — حفل ملكي لا يُنسى" },
            { icon: "✨", title: "٢٠٢٦", desc: "عام الحب والبركة والبداية الجديدة" },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.15}>
              <div className={`relative flex items-center gap-6 mb-10 ${i % 2 === 0 ? "flex-row-reverse" : ""}`}>
                {/* Dot */}
                <div className="absolute right-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-background border-2 border-gold flex items-center justify-center text-lg shadow-card z-10">
                  {item.icon}
                </div>
                {/* Card */}
                <div className={`w-[calc(50%-2rem)] rounded-2xl border border-gold/30 glass px-5 py-4 shadow-card ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                  <p className="font-display-ar text-lg font-bold text-gold">{item.title}</p>
                  <p className="mt-1 font-body-ar text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════ QUOTE ══════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden z-10">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 90% 70% at 50% 50%, color-mix(in oklab, oklch(0.82 0.13 75) 7%, transparent), transparent 75%)",
          }}
        />
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="font-display-ar text-3xl font-bold text-gradient-gold leading-loose md:text-4xl">
            "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا"
          </p>
          <p className="mt-4 font-display text-sm text-gold/60 tracking-widest">الروم ٢١</p>
        </Reveal>
      </section>

      {/* ═══════════════════════════ FOOTER ═════════════════════════════════ */}
      <footer className="relative mt-10 border-t border-gold/25 bg-card/20 backdrop-blur py-20 text-center z-10">
        <Reveal>
          <p className="font-display-ar text-3xl text-gradient-gold">أميرة ❦ علاء</p>
          <div className="mx-auto my-6 h-px w-28 gold-divider" />
          <p className="font-body-ar text-sm text-muted-foreground">
            مع كل الحب والتمنيات — من العائلة
          </p>
          <p className="mt-6 font-display text-xs tracking-[0.35em] text-gold/50">
            2026 ✦ FOREVER
          </p>
        </Reveal>
      </footer>

      {/* ═══════════════════════════ LIGHTBOX ═══════════════════════════════ */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-background/95 p-6 backdrop-blur-xl fade-in-up"
        >
          <img
            src={lightbox}
            alt="معاينة"
            className="max-h-[90vh] max-w-[92vw] rounded-3xl border-2 border-gold/50 object-contain shadow-glow"
          />
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-6 left-6 rounded-full border border-gold/40 bg-card/60 p-3 text-gold backdrop-blur transition-all hover:bg-gold hover:text-primary-foreground hover:shadow-glow"
            aria-label="إغلاق"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
