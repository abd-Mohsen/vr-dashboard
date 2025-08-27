import React, { useState } from "react";
import ModelViewer from "../../components/ModelViewer";
import ImagePicker from "../../components/ImagePicker";
import ParametersPanel from "../../components/ParameterPanel";
import type { Parameters } from "../../types/Parameters";
import "../generate/GeneratePage.scss";

const GeneratePage: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [params, setParams] = useState<Parameters>({
    checkbox1: false,
    dropdown1: "",
    dropdown2: "",
  });

  const handleImageChange = (newImages: string[]) => {
    setImages(newImages);
  };

  const handleParamsChange = (name: keyof Parameters, value: string | boolean) => {
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Selected Images:", images);
    console.log("Parameters:", params);
    alert("Form Submitted!");
  };

  return (
    <div className="generate-container">
      
      <div className="images-container">
        <ImagePicker images={images} onChange={handleImageChange} />
      </div>

      <div className="params-container">
        <ParametersPanel params={params} onChange={handleParamsChange} />
      </div>

      <div className="viewer-container">
        <ModelViewer />
      </div>      

      <div className="submit-section">
        <p>Make sure to review your selections before submitting.</p>
        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default GeneratePage;
