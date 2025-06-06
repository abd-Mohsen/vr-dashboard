import "./Users.scss";
import { useState } from "react";

// Sample data - replace with your actual model data
const sampleModels = [
  {
    id: 1,
    name: "VR Headset",
    thumbnail: "/path/to/thumbnail1.jpg", // Replace with actual paths
    modelPath: "/path/to/model1.glb",
    description: "High-quality VR headset model",
    lastUpdated: "2023-05-15"
  },
  {
    id: 2,
    name: "Game Controller",
    thumbnail: "/path/to/thumbnail2.jpg",
    modelPath: "/path/to/model2.glb",
    description: "Next-gen game controller",
    lastUpdated: "2023-06-20"
  },
  {
    id: 3,
    name: "Smart Watch",
    thumbnail: "/path/to/thumbnail3.jpg",
    modelPath: "/path/to/model3.glb",
    description: "Modern smartwatch design",
    lastUpdated: "2023-04-10"
  },
];

const Users = () => {
  const [open, setOpen] = useState(false);
  const [models, setModels] = useState(sampleModels);

  // Function to handle viewing a model
  const handleView = (modelPath : string) => {
    // Implement your model viewer logic here
    console.log("Viewing model:", modelPath);
  };

  // Function to handle downloading a model
  const handleDownload = (modelPath : string) => {
    // Implement download logic here
    console.log("Downloading model:", modelPath);
  };

  return (
    <div className="objects">
      <div className="info">
        <h1>3D Objects</h1>
        <button onClick={() => setOpen(true)}>Add New Object</button>
      </div>

      <div className="model-grid">
        {models.map((model) => (
          <div key={model.id} className="model-card">
            <div className="model-preview">
              {model.thumbnail ? (
                <img src={model.thumbnail} alt={model.name} />
              ) : (
                <div className="placeholder">No Preview Available</div>
              )}
            </div>
            <div className="model-info">
              <h3>{model.name}</h3>
              <p>{model.description}</p>
              <p>Last updated: {model.lastUpdated}</p>
              <div className="actions">
                <button 
                  className="view" 
                  onClick={() => handleView(model.modelPath)}
                >
                  View
                </button>
                <button 
                  className="download" 
                  onClick={() => handleDownload(model.modelPath)}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;