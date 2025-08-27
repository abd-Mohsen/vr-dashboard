import React, { useState, type ChangeEvent } from "react";
import "../pages/generate/GeneratePage.scss";

interface ImagePickerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ images, onChange }) => {
  // const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const previews = files.map((file) => URL.createObjectURL(file));
    onChange([...images, ...previews]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  // const handleImageClick = (src: string) => {
  //   setPreviewSrc(src);
  // };

  // const handleClosePreview = () => {
  //   setPreviewSrc(null);
  // };

  return (
    <>
      <div className="image-picker">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />
        <div className="preview-container">
          {images.map((src, idx) => (
            <div key={idx} className="image-wrapper">
              <img
                src={src}
                alt={`preview-${idx}`}
                // onClick={() => handleImageClick(src)}
              />
              <button
                className="remove-btn"
                onClick={() => handleRemoveImage(idx)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Image Preview Modal */}
      {/* {previewSrc && (
        <div className="image-preview-modal" onClick={handleClosePreview}>
          <img src={previewSrc} alt="Preview" />
          <button className="close-btn" onClick={handleClosePreview}>
            ×
          </button>
        </div>
      )} */}
    </>
  );
};

export default ImagePicker;
