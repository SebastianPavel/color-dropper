// components/ImageUploader.tsx
import React, { ChangeEvent } from 'react';

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onImageUpload(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="image-upload" className="block mb-2 text-sm font-medium text-gray-900">
        Upload an image
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
      />
    </div>
  );
};

export default ImageUploader;