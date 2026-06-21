"use client";

import { useRef, useState } from "react";
import { Upload, X, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Image manager: pick files from the device gallery (compressed to a data URL,
 * so it works with zero storage setup) or paste a URL. Returns string[] of
 * image sources (data URLs or http URLs) via onChange.
 */
export function ImageUploader({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const compress = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.onload = () => {
          const max = 900;
          let { width, height } = img;
          if (width > max || height > max) {
            const r = Math.min(max / width, max / height);
            width = Math.round(width * r);
            height = Math.round(height * r);
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject();
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const added: string[] = [];
      for (const f of Array.from(files)) {
        if (!f.type.startsWith("image/")) continue;
        added.push(await compress(f));
      }
      onChange([...value.filter((v) => v.trim()), ...added]);
      toast.success(`${added.length} зураг нэмэгдлээ`);
    } catch {
      toast.error("Зураг ачаалахад алдаа гарлаа");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const addUrl = () => {
    const url = prompt("Зургийн URL оруулна уу:");
    if (url && url.trim()) onChange([...value.filter((v) => v.trim()), url.trim()]);
  };

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {value.filter((v) => v.trim()).map((img, i) => (
          <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-line bg-bg-secondary group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 text-state-sale flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1.5 left-1.5 bg-ink text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
                Үндсэн
              </span>
            )}
          </div>
        ))}

        {/* Upload tile */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="aspect-square rounded-2xl border-2 border-dashed border-line hover:border-brand-pink hover:bg-bg-soft transition flex flex-col items-center justify-center gap-1.5 text-ink-muted disabled:opacity-50"
        >
          <Upload className="w-5 h-5" strokeWidth={1.7} />
          <span className="text-[11px] font-medium">{busy ? "Ачаалж..." : "Зураг нэмэх"}</span>
        </button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />

      <button type="button" onClick={addUrl} className="mt-3 text-xs font-semibold text-brand-pink flex items-center gap-1.5">
        <LinkIcon className="w-3.5 h-3.5" /> URL-ээр нэмэх
      </button>
    </div>
  );
}
