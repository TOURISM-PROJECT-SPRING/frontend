import { useEffect, useRef, useState } from "react";
import { Upload, X, Star, Loader2 } from "lucide-react";

const DEFAULT_MAX_FILES = 8;
const DEFAULT_MAX_SIZE_MB = 5;

function formatSize(bytes) {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
}

/**
 * Reusable image input.
 *
 * - `existingImages`: already-saved images, e.g. [{ id, url, isPrimary }]
 * - `files` + `onFilesChange`: newly picked File objects (parent uploads them)
 * - `onRemoveExisting`: optional; called when an existing image is removed
 */
export default function ImageUpload({
  label = "Images",
  helperText,
  existingImages = [],
  onRemoveExisting,
  files = [],
  onFilesChange,
  multiple = true,
  maxFiles = DEFAULT_MAX_FILES,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  accept = "image/*",
  disabled = false,
  uploading = false,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const next = (files || []).map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviews(next);
    return () => next.forEach((item) => URL.revokeObjectURL(item.url));
  }, [files]);

  const isDisabled = disabled || uploading;
  const total = existingImages.length + files.length;

  const addFiles = (incoming) => {
    if (isDisabled) return;
    const list = Array.from(incoming || []);
    if (!list.length) return;

    const problems = [];
    const valid = [];
    list.forEach((file) => {
      if (file.type && !file.type.startsWith("image/")) {
        problems.push(`${file.name} is not an image`);
      } else if (file.size > maxSizeMB * 1024 * 1024) {
        problems.push(`${file.name} is larger than ${maxSizeMB}MB`);
      } else {
        valid.push(file);
      }
    });

    let next;
    if (multiple) {
      const remaining = maxFiles - total;
      if (remaining <= 0) {
        setError(`You can upload up to ${maxFiles} images.`);
        return;
      }
      if (valid.length > remaining) {
        problems.push(`Only ${maxFiles} images allowed`);
      }
      next = [...files, ...valid.slice(0, remaining)];
    } else {
      next = valid.slice(0, 1);
    }

    setError(problems.join(". "));
    if (next.length !== files.length || next.some((f, i) => f !== files[i])) {
      onFilesChange?.(next);
    }
  };

  const removeFile = (index) => {
    setError("");
    onFilesChange?.(files.filter((_, i) => i !== index));
  };

  const openPicker = () => {
    if (!isDisabled) inputRef.current?.click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    if (isDisabled) return;
    addFiles(event.dataTransfer?.files);
  };

  const handleSelect = (event) => {
    addFiles(event.target.files);
    event.target.value = "";
  };

  const images = [
    ...existingImages.map((image) => ({
      key: `existing-${image.id}`,
      url: image.url,
      existingImage: image,
    })),
    ...previews.map((preview, index) => ({
      key: `new-${preview.file.name}-${preview.file.lastModified}-${index}`,
      url: preview.url,
      index,
      file: preview.file,
    })),
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-[11px] text-gray-400">{total}/{multiple ? maxFiles : 1}</span>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
          {images.map((item, i) => (
            <div
              key={item.key}
              className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
            >
              <img src={item.url} alt="" className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute top-1 left-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary text-white text-[9px] font-bold">
                  <Star className="w-2.5 h-2.5 fill-white" /> PRIMARY
                </span>
              )}
              {item.file && (
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px]">
                  {formatSize(item.file.size)}
                </span>
              )}
              {!isDisabled && (item.existingImage ? onRemoveExisting : true) && (
                <button
                  type="button"
                  onClick={() =>
                    item.existingImage ? onRemoveExisting?.(item.existingImage) : removeFile(item.index)
                  }
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition"
                  aria-label="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!isDisabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg px-4 py-6 text-center transition ${
          dragging ? "border-primary bg-primary/5" : "border-gray-200 dark:border-gray-700"
        } ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-primary/50"}`}
      >
        {uploading ? (
          <Loader2 className="w-7 h-7 text-primary mx-auto mb-2 animate-spin" />
        ) : (
          <Upload className="w-7 h-7 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {uploading
            ? "Uploading images..."
            : `Click to upload or drag and drop${multiple ? " (multiple)" : ""}`}
        </p>
        <p className="text-xs text-gray-300 dark:text-gray-500 mt-1">
          PNG, JPG, WEBP up to {maxSizeMB}MB
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleSelect}
        disabled={isDisabled}
        className="hidden"
      />

      {error ? (
        <p className="text-xs text-red-500 mt-1.5">{error}</p>
      ) : (
        helperText && <p className="text-xs text-gray-400 mt-1.5">{helperText}</p>
      )}
    </div>
  );
}
