import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";

interface ImageUploadProps {
  currentImageUrl?: string;
  onFileSelect: (file: File | null) => void;
  label?: string;
  helperText?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onFileSelect,
  label = "Event Poster / Banner Image",
  helperText = "Supported formats: JPG, PNG, WebP (Max size: 5MB). Image is securely saved locally on the server.",
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateAndHandleFile = (file: File) => {
    setErrorMessage(null);

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage("Invalid file format. Please upload a JPG, PNG, or WebP image.");
      return;
    }

    // Validate size (5MB)
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("File exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    // Create preview
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndHandleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndHandleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileSelect(null);
  };

  const effectivePreview = previewUrl || (currentImageUrl ? getImageUrl(currentImageUrl) : null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#202033]">{label}</label>
        {previewUrl && (
          <span className="text-[11px] font-semibold text-[#6C4CE8]">New image selected</span>
        )}
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative group border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-[#6C4CE8] bg-[#6C4CE8]/5"
            : effectivePreview
            ? "border-[#E9E8F0] hover:border-[#6C4CE8] bg-gray-50/50"
            : "border-gray-200 hover:border-[#6C4CE8] bg-gray-50 hover:bg-[#6C4CE8]/5"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleInputChange}
          className="hidden"
        />

        {effectivePreview ? (
          <div className="relative flex flex-col items-center">
            <div className="relative w-full max-w-md h-48 rounded-xl overflow-hidden shadow-inner border border-gray-200 bg-gray-100">
              <img
                src={effectivePreview}
                alt="Event preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemove}
                title="Remove image"
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <p className="mt-3 text-xs font-semibold text-[#6C4CE8] group-hover:underline flex items-center gap-1.5">
              <ImageIcon size={14} /> Click or drag to replace image
            </p>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-[#6C4CE8]/10 text-[#6C4CE8] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud size={24} />
            </div>
            <p className="text-sm font-bold text-[#202033]">
              Click to upload <span className="font-normal text-[#77778A]">or drag and drop</span>
            </p>
            <p className="text-xs text-[#77778A] mt-1">{helperText}</p>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
