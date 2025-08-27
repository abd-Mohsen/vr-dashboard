import React, { useState, type ChangeEvent } from "react";
import "../pages/generate/GeneratePage.scss";

interface ImagePickerProps {
  files: File[];               // <-- was 'images: string[]'
  onChange: (files: File[]) => void; // <-- match File[]
}

const ImagePicker: React.FC<ImagePickerProps> = ({ files, onChange }) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    onChange([...files, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className="image-picker">
      <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
      <div className="preview-container">
        {files.map((file, idx) => {
          const src = URL.createObjectURL(file); // generate preview from File
          return (
            <div key={idx} className="image-wrapper">
              <img src={src} alt={`preview-${idx}`} />
              <button className="remove-btn" onClick={() => handleRemoveImage(idx)}>×</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default ImagePicker;
