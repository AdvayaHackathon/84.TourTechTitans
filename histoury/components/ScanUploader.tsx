"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import Image from "next/image";

export default function ScanUploader({
  onDetect,
}: {
  onDetect: (landmark: string, coords: { lat: number; lng: number }) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [landmark, setLandmark] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    uploadToBackend(file);
  };

  const uploadToBackend = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:8000/detect_landmark/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.name && data.lat && data.lng) {
        setLandmark(data.name);
        const coordData = { lat: data.lat, lng: data.lng };
        setCoords(coordData);
        onDetect(data.name, coordData); // Pass to parent
      } else {
        setLandmark("Could not detect landmark");
        setCoords(null);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setLandmark("Error contacting backend");
    } finally {
      setLoading(false);
    }
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

      {loading && (
        <p className="text-center mt-4 text-amber-600">🔍 Detecting landmark...</p>
      )}

      {landmark && (
        <div className="mt-6 bg-amber-50 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg">📍 Detected Landmark:</h3>
          <p className="text-amber-800">{landmark}</p>
          {coords && (
            <p className="text-sm text-amber-600">
              Latitude: {coords.lat}, Longitude: {coords.lng}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
