import { useRef, useState } from "react";
import {
  Upload, Loader2, ImagePlus, Globe, Lock,
  CheckCircle2, X, Link2, Film,
} from "lucide-react";
import { uploadFile, createMedia, buildEmbedUrl, detectEmbedKind } from "@/lib/media";

interface Props {
  onUploaded?: () => void;
}

type FileItem = {
  file: File;
  id: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

type Tab = "file" | "url";

const URL_PLACEHOLDER: Record<string, string> = {
  youtube: "https://www.youtube.com/watch?v=…",
  vimeo: "https://vimeo.com/…",
  gdrive: "https://drive.google.com/file/d/…/view",
  direct: "https://example.com/video.mp4",
};

const PLATFORM_LABELS: Record<string, string> = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  gdrive: "Google Drive",
  direct: "رابط مباشر",
};

function detectIconEmoji(url: string) {
  const k = detectEmbedKind(url);
  if (k === "youtube") return "▶️";
  if (k === "vimeo") return "🎬";
  if (k === "gdrive") return "☁️";
  return "🔗";
}

export function MediaUploader({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<Tab>("file");
  const [uploader, setUploader] = useState("");
  const [caption, setCaption] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  // ── file tab state ──
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // ── url tab state ──
  const [urlValue, setUrlValue] = useState("");
  const [urlStatus, setUrlStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [urlError, setUrlError] = useState("");

  const isUploading = files.some((f) => f.status === "uploading");

  // ── helpers ───────────────────────────────────────────────────────────────
  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    setFiles((prev) => [
      ...prev,
      ...Array.from(fileList).map((f) => ({
        file: f,
        id: crypto.randomUUID(),
        progress: 0,
        status: "pending" as const,
      })),
    ]);
  };

  const removeFile = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  // ── file upload ───────────────────────────────────────────────────────────
  const handleFileUpload = async () => {
    const pending = files.filter((f) => f.status === "pending");
    if (!pending.length) return;

    for (const item of pending) {
      setFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "uploading" } : f))
      );
      try {
        const objectPath = await uploadFile(item.file, (pct) =>
          setFiles((prev) =>
            prev.map((f) => (f.id === item.id ? { ...f, progress: pct } : f))
          )
        );
        await createMedia({
          objectPath,
          type: item.file.type.startsWith("video/") ? "video" : "image",
          caption: caption || null,
          uploader: uploader || null,
          visibility,
        });
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id ? { ...f, status: "done", progress: 100 } : f
          )
        );
      } catch (e) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? { ...f, status: "error", error: e instanceof Error ? e.message : "خطأ" }
              : f
          )
        );
      }
    }
    onUploaded?.();
    setTimeout(() => {
      setFiles([]);
      setCaption("");
    }, 2000);
  };

  // ── URL save ──────────────────────────────────────────────────────────────
  const handleUrlSave = async () => {
    const trimmed = urlValue.trim();
    if (!trimmed) { setUrlError("أدخل رابط الفيديو"); return; }

    try { new URL(trimmed); } catch {
      setUrlError("الرابط غير صالح — تأكد أنه يبدأ بـ https://");
      return;
    }

    setUrlStatus("saving");
    setUrlError("");
    try {
      await createMedia({
        objectPath: "",
        externalUrl: trimmed,
        type: "video",
        caption: caption || null,
        uploader: uploader || null,
        visibility,
      });
      setUrlStatus("done");
      onUploaded?.();
      setTimeout(() => {
        setUrlStatus("idle");
        setUrlValue("");
        setCaption("");
      }, 2000);
    } catch {
      setUrlStatus("error");
      setUrlError("تعذّر الحفظ، حاول مجدداً");
    }
  };

  const detectedKind = urlValue ? detectEmbedKind(urlValue) : null;

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-3xl border-2 border-dashed border-gold/35 glass p-6 md:p-8 shadow-elegant">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center">
          <ImagePlus className="h-5 w-5 text-gold" />
        </div>
        <h4 className="font-display-ar text-2xl font-bold text-gold">شارك ذكرى</h4>
        <p className="mt-1 font-body-ar text-sm text-muted-foreground">
          ارفع صورك أو أضف رابط فيديو لألبوم العرس
        </p>
      </div>

      {/* Tab switcher */}
      <div className="mb-5 flex items-center gap-1 rounded-full bg-background/40 p-1 border border-gold/20">
        {([["file", "رفع ملف", ImagePlus], ["url", "رابط فيديو", Link2]] as const).map(([t, label, Icon]) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 font-body-ar text-sm transition-all ${
              tab === t
                ? "bg-gold text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-gold"
            }`}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* Shared fields */}
      <div className="grid gap-3 md:grid-cols-2 mb-4">
        <input
          type="text"
          value={uploader}
          onChange={(e) => setUploader(e.target.value)}
          placeholder="اسمك (اختياري)"
          className="rounded-xl border border-gold/30 bg-background/60 px-4 py-2.5 font-body-ar text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold transition-colors"
          disabled={isUploading || urlStatus === "saving"}
          dir="rtl"
        />
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="تعليق على الذكرى (اختياري)"
          className="rounded-xl border border-gold/30 bg-background/60 px-4 py-2.5 font-body-ar text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold transition-colors"
          disabled={isUploading || urlStatus === "saving"}
          dir="rtl"
        />
      </div>

      {/* Visibility toggle */}
      <div className="mb-5 flex items-center justify-center gap-1 rounded-full bg-background/40 p-1 border border-gold/20">
        {([["public", "عامة — يراها الجميع", Globe], ["private", "خاصة — للعائلة فقط", Lock]] as const).map(([v, label, Icon]) => (
          <button
            key={v}
            type="button"
            onClick={() => setVisibility(v)}
            disabled={isUploading || urlStatus === "saving"}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 font-body-ar text-sm transition-all ${
              visibility === v
                ? "bg-gold text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-gold"
            }`}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* ── FILE TAB ── */}
      {tab === "file" && (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
              isDragging ? "border-gold bg-gold/10" : "border-gold/25 hover:border-gold/50 hover:bg-gold/5"
            }`}
          >
            <Upload className="mx-auto h-6 w-6 text-gold/60 mb-2" />
            <p className="font-body-ar text-sm text-muted-foreground">اضغط أو اسحب وأفلت الصور والفيديوهات هنا</p>
            <p className="font-display text-xs text-gold/40 mt-1">PNG · JPG · MP4 · MOV · …</p>
          </div>
          <input ref={inputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-xl border border-gold/20 bg-background/40 px-4 py-2.5">
                  <span className="text-base shrink-0">{item.file.type.startsWith("video/") ? "🎬" : "🖼"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-foreground truncate">{item.file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-display text-[10px] text-muted-foreground">{formatSize(item.file.size)}</p>
                      {item.status === "uploading" && (
                        <div className="flex-1 h-1 bg-gold/20 rounded-full overflow-hidden">
                          <div className="h-full bg-gold transition-all duration-300 rounded-full" style={{ width: `${item.progress}%` }} />
                        </div>
                      )}
                      {item.status === "done" && <span className="text-[10px] font-body text-green-400 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> تم</span>}
                      {item.status === "error" && <span className="text-[10px] font-body text-destructive">{item.error}</span>}
                    </div>
                  </div>
                  {item.status !== "uploading" && item.status !== "done" && (
                    <button type="button" onClick={() => removeFile(item.id)} className="shrink-0 text-muted-foreground hover:text-destructive transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {files.some((f) => f.status === "pending") && (
            <button
              type="button"
              onClick={handleFileUpload}
              disabled={isUploading}
              className="mt-4 w-full inline-flex items-center justify-center gap-3 rounded-full bg-gold px-6 py-3 font-display-ar text-base text-primary-foreground transition-all hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {isUploading
                ? <><Loader2 className="h-5 w-5 animate-spin" /> جارٍ الرفع…</>
                : <><Upload className="h-5 w-5" /> رفع {files.filter((f) => f.status === "pending").length} ملف</>}
            </button>
          )}
        </>
      )}

      {/* ── URL TAB ── */}
      {tab === "url" && (
        <div className="space-y-4">
          {/* Platform chips */}
          <div className="flex flex-wrap gap-2 justify-center">
            {(["youtube", "vimeo", "gdrive", "direct"] as const).map((k) => (
              <span
                key={k}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-body text-xs transition-all ${
                  detectedKind === k
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-gold/20 text-muted-foreground"
                }`}
              >
                {k === "youtube" && "▶️"}
                {k === "vimeo" && "🎬"}
                {k === "gdrive" && "☁️"}
                {k === "direct" && "🔗"}
                {PLATFORM_LABELS[k]}
              </span>
            ))}
          </div>

          {/* URL input */}
          <div className="relative">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Film className="h-4 w-4" />
            </div>
            <input
              type="url"
              value={urlValue}
              onChange={(e) => { setUrlValue(e.target.value); setUrlError(""); }}
              placeholder={detectedKind ? URL_PLACEHOLDER[detectedKind] : "https://www.youtube.com/watch?v=…"}
              dir="ltr"
              disabled={urlStatus === "saving"}
              className="w-full rounded-xl border border-gold/30 bg-background/60 pr-10 pl-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          {/* Live preview for YouTube/Vimeo/Drive */}
          {urlValue && detectedKind && detectedKind !== "direct" && (
            <div className="relative overflow-hidden rounded-2xl border border-gold/30 shadow-card" style={{ paddingBottom: "56.25%" }}>
              <iframe
                key={urlValue}
                src={buildEmbedUrl(urlValue)}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen"
                allowFullScreen
                title="معاينة الفيديو"
              />
            </div>
          )}
          {urlValue && detectedKind === "direct" && (
            <div className="rounded-2xl border border-gold/30 overflow-hidden shadow-card">
              <video key={urlValue} src={urlValue} controls preload="metadata" className="w-full max-h-52" />
            </div>
          )}

          {urlError && <p className="font-body-ar text-sm text-destructive text-center">{urlError}</p>}

          {urlStatus === "done" && (
            <p className="font-body-ar text-sm text-gold flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> تمّت إضافة الفيديو بنجاح ✦
            </p>
          )}

          <button
            type="button"
            onClick={handleUrlSave}
            disabled={urlStatus === "saving" || !urlValue.trim()}
            className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-gold px-6 py-3 font-display-ar text-base text-primary-foreground transition-all hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {urlStatus === "saving"
              ? <><Loader2 className="h-5 w-5 animate-spin" /> جارٍ الحفظ…</>
              : <><span>{urlValue ? detectIconEmoji(urlValue) : "🔗"}</span> إضافة الفيديو</>}
          </button>

          <p className="font-body-ar text-xs text-muted-foreground text-center leading-relaxed">
            يدعم YouTube · Vimeo · Google Drive · أي رابط فيديو مباشر (MP4/WebM)
          </p>
        </div>
      )}
    </div>
  );
}
