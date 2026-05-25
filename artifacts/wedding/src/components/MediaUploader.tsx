import { useRef, useState } from "react";
import { Upload, Loader2, ImagePlus, Globe, Lock, CheckCircle2, X } from "lucide-react";
import { uploadFile, createMedia } from "@/lib/media";

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

export function MediaUploader({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploader, setUploader] = useState("");
  const [caption, setCaption] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [overallDone, setOverallDone] = useState(false);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newItems: FileItem[] = Array.from(fileList).map((f) => ({
      file: f,
      id: crypto.randomUUID(),
      progress: 0,
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...newItems]);
    setOverallDone(false);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const isUploading = files.some((f) => f.status === "uploading");

  const handleUpload = async () => {
    const pending = files.filter((f) => f.status === "pending");
    if (pending.length === 0) return;

    for (const item of pending) {
      setFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "uploading" } : f))
      );

      try {
        const objectPath = await uploadFile(item.file, (pct) => {
          setFiles((prev) =>
            prev.map((f) => (f.id === item.id ? { ...f, progress: pct } : f))
          );
        });

        const isVideo = item.file.type.startsWith("video/");
        await createMedia({
          objectPath,
          type: isVideo ? "video" : "image",
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

    setOverallDone(true);
    onUploaded?.();
    setTimeout(() => {
      setFiles([]);
      setOverallDone(false);
      setCaption("");
    }, 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="rounded-3xl border-2 border-dashed border-gold/35 glass p-6 md:p-8 shadow-elegant">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center">
          <ImagePlus className="h-5 w-5 text-gold" />
        </div>
        <h4 className="font-display-ar text-2xl font-bold text-gold">شارك ذكرى</h4>
        <p className="mt-1 font-body-ar text-sm text-muted-foreground">
          ارفع صورك وفيديوهاتك لتُضاف لألبوم العرس
        </p>
      </div>

      {/* Fields */}
      <div className="grid gap-3 md:grid-cols-2 mb-4">
        <input
          type="text"
          value={uploader}
          onChange={(e) => setUploader(e.target.value)}
          placeholder="اسمك (اختياري)"
          className="rounded-xl border border-gold/30 bg-background/60 px-4 py-2.5 font-body-ar text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold transition-colors"
          disabled={isUploading}
          dir="rtl"
        />
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="تعليق على الذكرى (اختياري)"
          className="rounded-xl border border-gold/30 bg-background/60 px-4 py-2.5 font-body-ar text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold transition-colors"
          disabled={isUploading}
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
            disabled={isUploading}
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

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
          isDragging ? "border-gold bg-gold/10" : "border-gold/25 hover:border-gold/50 hover:bg-gold/5"
        }`}
      >
        <Upload className="mx-auto h-6 w-6 text-gold/60 mb-2" />
        <p className="font-body-ar text-sm text-muted-foreground">
          اضغط أو اسحب وأفلت الصور والفيديوهات هنا
        </p>
        <p className="font-display text-xs text-gold/40 mt-1">PNG, JPG, MP4, MOV…</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-xl border border-gold/20 bg-background/40 px-4 py-2.5">
              {/* Icon */}
              <span className="text-base shrink-0">
                {item.file.type.startsWith("video/") ? "🎬" : "🖼"}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs text-foreground truncate">{item.file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-display text-[10px] text-muted-foreground">
                    {formatSize(item.file.size)}
                  </p>
                  {item.status === "uploading" && (
                    <div className="flex-1 h-1 bg-gold/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold transition-all duration-300 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                  {item.status === "done" && (
                    <span className="text-[10px] font-body text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> تم
                    </span>
                  )}
                  {item.status === "error" && (
                    <span className="text-[10px] font-body text-destructive">{item.error}</span>
                  )}
                </div>
              </div>

              {/* Remove */}
              {item.status !== "uploading" && item.status !== "done" && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(item.id); }}
                  className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {files.some((f) => f.status === "pending") && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="mt-4 w-full inline-flex items-center justify-center gap-3 rounded-full bg-gold px-6 py-3 font-display-ar text-base text-primary-foreground transition-all hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> جارٍ الرفع…</>
          ) : (
            <><Upload className="h-5 w-5" /> رفع {files.filter((f) => f.status === "pending").length} ملف</>
          )}
        </button>
      )}

      {overallDone && (
        <p className="mt-4 text-center font-body-ar text-sm text-gold flex items-center justify-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> تمّت إضافة ذكرياتك بنجاح ✦
        </p>
      )}
    </div>
  );
}
