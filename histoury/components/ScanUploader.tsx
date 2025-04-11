"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import Image from "next/image";

export default function ScanUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div
        className={`border-4 border-dashed rounded-lg p-8 transition ${
          dragging ? "border-amber-700 bg-amber-100" : "border-amber-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Uploaded preview"
            width={400}
            height={300}
            className="mx-auto rounded"
          />
        ) : (
          <div className="text-center text-amber-700">
            <p className="mb-2 font-medium">
              Drag and drop an image here, or click below to upload
            </p>
            <button
              onClick={triggerFileInput}
              className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Upload Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Camera Button (non-functional placeholder) */}
      <div className="mt-6 text-center">
        <button
          onClick={() => alert("Camera feature coming soon!")}
          className="text-amber-700 hover:text-amber-900 underline"
        >
          Or click a photo using your camera
        </button>
      </div>
    </div>
  );
}
