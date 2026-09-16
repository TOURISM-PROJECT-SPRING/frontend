import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

export default function AdminImageField({ value, label = "Image", onChange }) {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(value || null);

  useEffect(() => {
    setPreview(value || null);
    setFile(null);
  }, [value]);

  const onPick = (e) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
    onChange?.(picked);
  };

  const clear = () => {
    setFile(null);
    setPreview(null);
    onChange?.(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
      <div className="flex items-center gap-3">
        <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
          {preview ? (
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-gray-400">
              <ImagePlus className="w-5 h-5" />
              <span className="text-[10px] font-medium">No photo</span>
            </div>
          )}
          {preview && (
            <button
              type="button"
              onClick={clear}
              aria-label="Remove image"
              className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"
          >
            <ImagePlus className="w-4 h-4" />
            {preview ? "Replace photo" : "Upload photo"}
          </button>
          {file && <p className="mt-1.5 truncate text-[11px] text-gray-400">{file.name}</p>}
        </div>
      </div>
    </div>
  );
}