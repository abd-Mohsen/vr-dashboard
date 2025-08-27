import React, { type ChangeEvent } from "react";
import "../pages/generate/GeneratePage.scss";

interface ImagePickerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ images, onChange }) => {
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const previews = files.map((file) => URL.createObjectURL(file));
    onChange(previews);
  };

  return (
    <div className="image-picker">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
      />
      <div className="preview-container">
        {images.map((src, idx) => (
          <img key={idx} src={src} alt={`preview-${idx}`} />
        ))}
      </div>
    </div>
  );
};

export default ImagePicker;
