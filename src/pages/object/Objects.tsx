//TODO models take long to load
//TODO try another model extension
//TODO add adjust lighting and scroll (shift)
//TODO add crop
//TODO add edit

import { AddObjectPopup } from "./AddObjectPopup";
import { ObjectDetailsPopup } from "./ObjectDetailsPopup";
import { ObjectCard } from "./ObjectCard";
import "./objects.scss";
import { useState, useEffect } from "react";
import LoadingIndicator from "../../components/loadingIndicator/LoadingIndicator";

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
  const [filteredObjects, setFilteredObjects] = useState<Object[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedObject, setSelectedObject] = useState<null | {
    name: string;
    description: string;
    lastUpdated: string;
    thumbnail: string;
    modelPath: string;
  }>(null);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editObject, setEditObject] = useState<Object | null>(null);

  const handleAddObject = async (formData: FormData, modelId?: string) => {
    try {
      const url = modelId 
        ? `http://localhost:8000/api/models/${modelId}`
        : 'http://localhost:8000/api/models';
      
      const method = modelId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to save model');
      }
      
      // Refresh models after adding/updating
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

  const fetchModels = async (query: string = "") => {
    try {
      setLoading(true);
      const url = query 
        ? `http://localhost:8000/api/models/search?query=${encodeURIComponent(query)}`
        : 'http://localhost:8000/api/models/search';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      const data = await response.json();
      setObjects(data);
      setFilteredObjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query) {
      const filtered = objects.filter(obj => 
        obj.name.toLowerCase().includes(query.toLowerCase()) || 
        obj.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredObjects(filtered);
    } else {
      setFilteredObjects(objects);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  if (loading) return <LoadingIndicator/>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="objects">
      <div className="info">
        <h1>3D Objects</h1>
        <div className="actions">
          <input
            type="text"
            placeholder="Search objects..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          <button onClick={() => setShowAddPopup(true)}>Add New Object</button>
        </div>
      </div>

      {selectedObject && (
        <ObjectDetailsPopup 
          object={selectedObject}
          onClose={() => setSelectedObject(null)}
        />
      )}

      {showAddPopup && (
        <AddObjectPopup 
          onClose={() => {
            setShowAddPopup(false)
            setEditObject(null)
          }}
          onAdd={handleAddObject}
          model={editObject}
        />
      )}

      {filteredObjects.length === 0 ? (
        <div className="no-objects">
          {searchQuery ? "No matching objects found" : "No 3D objects found in the objects folder"}
        </div>
      ) : (
        <div className="object-grid">
          {filteredObjects.map((object) => (
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
              onEdit={()=>{
                setEditObject(object);
                setShowAddPopup(true);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Objects;