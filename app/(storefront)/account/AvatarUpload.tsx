"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Providers";
import { Camera, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// Center-crop a file to a square and compress to a small JPEG data URL.
function compress(file: File, size = 256, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no ctx"));
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function AvatarUpload({ initialImage, fallback }: { initialImage?: string | null; fallback: string }) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [image, setImage] = useState(initialImage || "");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Зураг сонгоно уу");
    setUploading(true);
    try {
      const dataUrl = await compress(file);
      const r = await fetch("/api/account/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        toast.error(j.error || "Алдаа гарлаа");
        return;
      }
      setImage(dataUrl);
      toast.success("Профайл зураг шинэчлэгдлээ");
      await refresh();
      router.refresh();
    } catch {
      toast.error("Зураг боловсруулахад алдаа гарлаа");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative w-24 h-24 mx-auto">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-white ring-4 ring-white/40 shadow-lg flex items-center justify-center">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="font-serif text-4xl text-brand-pink">{fallback}</span>
        )}
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/35 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-brand-pink shadow-md flex items-center justify-center border-2 border-white hover:scale-105 transition"
        aria-label="Зураг солих"
      >
        <Camera className="w-4 h-4" strokeWidth={1.9} />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
