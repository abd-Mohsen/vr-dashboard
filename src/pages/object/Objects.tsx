//TODO models take long to load
//TODO try another model extension
//TODO auto refresh after adding
//TODO add adjust lighting and scroll (shift)
//TODO add crop
//TODO add edit
//TODO add delete
//TODO add id
//TODO add search
//TODO view by clicking on the card itself, not view button

import { AddObjectPopup } from "./AddObjectPopup";
import { ObjectDetailsPopup } from "./ObjectDetailsPopup";
import { ObjectCard } from "./ObjectCard";
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

const Objects = () => {
  const [objects, setObjects] = useState<Object[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<null | {
    name: string;
    description: string;
    lastUpdated: string;
    thumbnail: string;
    modelPath: string;
  }>(null);

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
      
      // Refresh models after adding
      fetchModels();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleDeleteObject = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/models/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete model');
      }
      
      // Refresh models after deletion
      fetchModels();
    } catch (error) {
      console.error('Error deleting model:', error);
      throw error;
    }
  };

  const fetchModels = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
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
            <ObjectCard
              key={object.id}
              object={object}
              onView={() => setSelectedObject({
                name: object.name,
                description: object.description,
                lastUpdated: object.lastUpdated,
                thumbnail: object.thumbnail,
                modelPath: object.modelPath
              })}
              onDelete={() => handleDeleteObject(object.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Objects;