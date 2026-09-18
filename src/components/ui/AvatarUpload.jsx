import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";

const DEFAULT_MAX_SIZE_MB = 5;

/**
 * Compact round avatar picker.
 *
 * - `currentUrl`: URL of the already-saved avatar (optional)
 * - `file`: newly picked File object (optional)
 * - `onFileChange(file | null)`: called with the picked File, or null to clear
 * - `onRemoveExisting`: called when the saved avatar should be deleted
 * - `fallback`: text shown when there is no image (e.g. initials)
 */
export default function AvatarUpload({
  currentUrl,
  file,
  onFileChange,
  onRemoveExisting,
  fallback = "",
  uploading = false,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  helperText = "PNG or JPG up to 5MB.",
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const shown = preview || currentUrl || "";
  const disabled = uploading;
  const hasImage = Boolean(shown);

  const handleSelect = (event) => {
    const picked = event.target.files?.[0];
    event.target.value = "";
    if (!picked) return;
    if (picked.type && !picked.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (picked.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be smaller than ${maxSizeMB}MB.`);
      return;
    }
    setError("");
    onFileChange?.(picked);
  };

  const handleRemove = () => {
    setError("");
    if (file) {
      onFileChange?.(null);
      return;
    }
    onRemoveExisting?.();
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-primary/10 flex items-center justify-center">
            {shown ? (
              <img src={shown} alt="Avatar preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-primary">{fallback}</span>
            )}
          </div>
          {uploading && (
            <span className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition disabled:opacity-60 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              {hasImage ? "Change photo" : "Upload photo"}
            </button>
            {hasImage && !disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            )}
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{helperText}</p>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleSelect}
        disabled={disabled}
        className="hidden"
      />
    </div>
  );
}
