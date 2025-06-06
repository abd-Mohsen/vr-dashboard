import { AddModelPopup } from "./AddModelPopup";
import { ModelPopup } from "./ModelPopup";
import "./Users.scss";
import { useState, useEffect } from "react";

interface Model {
  id: string;
  name: string;
  thumbnail: string;
  modelPath: string;
  description: string;
  lastUpdated: string;
}

//TODO models take long to load
//TODO try another model extension
//TODO auto refresh after adding
//TODO add adjust lighting and scroll (shift)
//TODO add crop
//TODO add edit
//TODO add delete
//TODO add id
//TODO add max lines to desciption in card

const Users = () => {
  const [open, setOpen] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<null | {
    name: string
    description: string
    lastUpdated: string
    thumbnail: string
    modelPath: string
  }>(null)

  const [showAddPopup, setShowAddPopup] = useState(false);

  const handleAddModel = async (formData: FormData) => {
    try {
      const response = await fetch('http://localhost:8000/api/models', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to add model');
      }
      
      // Refresh your models list
      // fetchModels();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchModels = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:8000/api/models');
        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }
        const data = await response.json();
        setModels(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);


  if (loading) return <div className="loading">Loading models...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="objects">
      <div className="info">
        <h1>3D Objects</h1>
        <button onClick={() => setShowAddPopup(true)}>Add New Object</button>
      </div>

      {selectedModel && (
        <ModelPopup 
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
        />
      )}

      {showAddPopup && (
        <AddModelPopup 
          onClose={() => setShowAddPopup(false)}
          onAdd={handleAddModel}
        />
      )}


      {models.length === 0 ? (
        <div className="no-models">No 3D models found in the models folder.</div>
      ) : (
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
                <h3 className="title">{model.name}</h3>
                <h6 className="subtitle">{model.description}</h6>
                <div className="actions">
                <button 
                  className="view" 
                  onClick={() => setSelectedModel({
                    name: model.name,
                    description: model.description,
                    lastUpdated: model.lastUpdated,
                    thumbnail: model.thumbnail,
                    modelPath: model.modelPath
                  })}
                >
                    View
                  </button>
                  <button 
                    className="delete"
                    // onClick={() => setShowDeleteDialog(true)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;