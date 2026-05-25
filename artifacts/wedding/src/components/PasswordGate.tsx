import { useState } from "react";
import { Lock, KeyRound } from "lucide-react";
import { tryUnlock } from "@/lib/media";

interface Props {
  onUnlocked: () => void;
}

export function PasswordGate({ onUnlocked }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tryUnlock(value)) {
      setError(null);
      onUnlocked();
    } else {
      setError("كلمة المرور غير صحيحة");
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  return (
    <form
      onSubmit={submit}
      className={`rounded-3xl border-2 border-dashed border-gold/40 glass p-8 md:p-10 text-center shadow-elegant transition-all ${shaking ? "shake" : ""}`}
    >
      <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center">
        <Lock className="h-6 w-6 text-gold" />
      </div>
      <h4 className="font-display-ar text-2xl font-bold text-gold">
        مساحة خاصة بالعائلة
      </h4>
      <p className="mt-2 font-body-ar text-sm text-muted-foreground leading-relaxed">
        أدخل كلمة المرور لرفع وإدارة الذكريات
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-sm mx-auto">
        <input
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(null); }}
          placeholder="••••••••••"
          dir="ltr"
          className="flex-1 rounded-xl border border-gold/30 bg-background/60 px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors text-center tracking-widest"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 font-display-ar text-base text-primary-foreground transition-all hover:shadow-glow hover:scale-105 active:scale-95"
        >
          <KeyRound className="h-4 w-4" />
          فتح
        </button>
      </div>

      {error && (
        <p className="mt-3 font-body-ar text-sm text-destructive flex items-center justify-center gap-1">
          <span>✕</span> {error}
        </p>
      )}

      <style>{`
        .shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-2px, 0, 0); }
          20%, 80% { transform: translate3d(4px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
          40%, 60% { transform: translate3d(6px, 0, 0); }
        }
      `}</style>
    </form>
  );
}
