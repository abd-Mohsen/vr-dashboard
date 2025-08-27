import React, { useState } from "react";
import ModelViewer from "../../components/ModelViewer";
import ImagePicker from "../../components/ImagePicker";
import ParametersPanel from "../../components/ParameterPanel";
import type { Parameters } from "../../types/Parameters";
import "../generate/GeneratePage.scss";

const GeneratePage: React.FC = () => {
  const [images, setImages] = useState<File[]>([]); // store File objects

  const [params, setParams] = useState<Parameters>({
    checkbox1: false,
    dropdown1: "",
    dropdown2: "",
  });
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (newImages: File[]) => {
    setImages(newImages);
  };  

  const handleParamsChange = (name: keyof Parameters, value: string | boolean) => {
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      alert("Please upload images first!");
      return;
    }
  
    setLoading(true);
    try {
      const formData = new FormData();
      images.forEach((file: File) => {
        formData.append("images", file);
      });
      formData.append("preset", params.dropdown1);
      formData.append("modelType", params.dropdown2);
      formData.append("removeBG", params.checkbox1.toString());
  
      const response = await fetch("http://localhost:53125/create_model", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (data.status !== "success") throw new Error(data.message);
  
      setModelUrl(data.modelUrl); // URL to GLB or OBJ
    } catch (err) {
      console.error(err);
      alert("Failed to generate the model");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="generate-container">
      <div className="images-container">
        {/* <ImagePicker images={images} onChange={handleImageChange} /> */}
        <ImagePicker files={images} onChange={handleImageChange} />
      </div>

      <div className="params-container">
        <ParametersPanel params={params} onChange={handleParamsChange} />
      </div>

      <div className="viewer-container">
        {loading ? <p>Generating model...</p> : <ModelViewer modelUrl={modelUrl} />}
      </div>

      <div className="submit-section">
        <p>Make sure to review your selections before submitting.</p>
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default GeneratePage;
