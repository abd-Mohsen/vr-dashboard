import { AddObjectPopup } from "./AddObjectPopup";
import { ObjectDetailsPopup } from "./ObjectDetailsPopup";
import "./objects.scss";
import { useState, useEffect } from "react";

interface Object {
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

const Objects = () => {
  const [open, setOpen] = useState(false);
  const [objects, setObjects] = useState<Object[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<null | {
    name: string
    description: string
    lastUpdated: string
    thumbnail: string
    modelPath: string
  }>(null)

  const [showAddPopup, setShowAddPopup] = useState(false);

  const handleAddObject = async (formData: FormData) => {
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
        setObjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);


  if (loading) return <div className="loading">Loading objects...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="objects">
      <div className="info">
        <h1>3D Objects</h1>
        <button onClick={() => setShowAddPopup(true)}>Add New Object</button>
      </div>

      {selectedObject && (
        <ObjectDetailsPopup 
          object={selectedObject}
          onClose={() => setSelectedObject(null)}
        />
      )}

      {showAddPopup && (
        <AddObjectPopup 
          onClose={() => setShowAddPopup(false)}
          onAdd={handleAddObject}
        />
      )}


      {objects.length === 0 ? (
        <div className="no-objects">No 3D objects found in the objects folder.</div>
      ) : (
        <div className="object-grid">
          {objects.map((object) => (
            <div key={object.id} className="object-card">
              <div className="object-preview">
                {object.thumbnail ? (
                  <img src={object.thumbnail} alt={object.name} />
                ) : (
                  <div className="placeholder">No Preview Available</div>
                )}
              </div>
              <div className="object-info">
                <h3 className="title">{object.name}</h3>
                <h6 className="subtitle">{object.description}</h6>
                <div className="actions">
                <button 
                  className="view" 
                  onClick={() => setSelectedObject({
                    name: object.name,
                    description: object.description,
                    lastUpdated: object.lastUpdated,
                    thumbnail: object.thumbnail,
                    modelPath: object.modelPath
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

export default Objects;