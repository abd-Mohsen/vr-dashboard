import { AddLayoutPopup } from "./AddLayoutPopup";
import { LayoutDetailsPopup } from "./LayoutDetailsPopup";
import { LayoutCard } from "./LayoutCard";
import "./layouts.scss";
import { useState, useEffect } from "react";
import LoadingIndicator from "../../components/loadingIndicator/LoadingIndicator";

interface Layout {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  lastUpdated: string;
  modelCount?: number;
}

const Layouts = () => {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [filteredLayouts, setFilteredLayouts] = useState<Layout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(
    localStorage.getItem("selectedLayoutId")
  );
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editLayout, setEditLayout] = useState<Layout | null>(null);

  const handleAddLayout = async (name: string, description: string, layoutId?: string) => {
    try {
      const url = layoutId
        ? `http://localhost:8000/api/scenes/${layoutId}`
        : 'http://localhost:8000/api/scenes';
      
      const method = layoutId ? 'PUT' : 'POST';
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      
      const response = await fetch(url, { method, body: formData });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save layout');
      }
      fetchLayouts();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleDeleteLayout = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this layout? All models in this layout will also be deleted.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/scenes/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete layout');

      // Clear localStorage if deleted layout is selected
      if (id === selectedLayoutId) {
        localStorage.removeItem("selectedLayoutId");
        localStorage.removeItem("selectedLayoutName");
        setSelectedLayoutId(null);
      }

      fetchLayouts();
    } catch (error) {
      console.error('Error deleting layout:', error);
      throw error;
    }
  };

  const handleSelectLayout = (layout: Layout) => {
    localStorage.setItem("selectedLayoutId", layout.id);
    localStorage.setItem("selectedLayoutName", layout.name);
    setSelectedLayoutId(layout.id);
  };

  const fetchLayouts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/scenes');
      if (!response.ok) throw new Error('Failed to fetch layouts');
      const layoutsData: Layout[] = await response.json();

      const layoutsWithCounts = await Promise.all(
        layoutsData.map(async (layout) => {
          try {
            const modelsResponse = await fetch(`http://localhost:8000/api/models/search?scene_id=${layout.id}`);
            if (modelsResponse.ok) {
              const models = await modelsResponse.json();
              return { ...layout, modelCount: models.length };
            }
          } catch (e) {
            console.error(`Failed to fetch models for layout ${layout.id}:`, e);
          }
          return { ...layout, modelCount: 0 };
        })
      );
      
      setLayouts(layoutsWithCounts);
      setFilteredLayouts(layoutsWithCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredLayouts(
      query
        ? layouts.filter(layout =>
            layout.name.toLowerCase().includes(query.toLowerCase()) ||
            layout.description.toLowerCase().includes(query.toLowerCase())
          )
        : layouts
    );
  };

  useEffect(() => {
    fetchLayouts();
  }, []);

  if (loading) return <LoadingIndicator />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="layouts">
      <div className="info">
        <h1>Layouts</h1>
        <div className="actions">
          <input
            type="text"
            placeholder="Search layouts..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          <button onClick={() => setShowAddPopup(true)}>Create New Layout</button>
        </div>
      </div>

      {selectedLayout && (
        <LayoutDetailsPopup
          layout={selectedLayout}
          onClose={() => setSelectedLayout(null)}
          onSetDefault={() => handleSelectLayout(selectedLayout)}
        />
      )}

      {showAddPopup && (
        <AddLayoutPopup
          onClose={() => {
            setShowAddPopup(false);
            setEditLayout(null);
          }}
          onAdd={handleAddLayout}
          layout={editLayout}
        />
      )}

      {filteredLayouts.length === 0 ? (
        <div className="no-layouts">
          {searchQuery ? "No matching layouts found" : "No layouts found. Create your first layout!"}
        </div>
      ) : (
        <div className="layout-grid">
          {filteredLayouts.map((layout) => (
            <LayoutCard
              key={layout.id}
              layout={layout}
              onView={() => setSelectedLayout(layout)}
              onDelete={() => handleDeleteLayout(layout.id)}
              onEdit={() => {
                setEditLayout(layout);
                setShowAddPopup(true);
              }}
              onSelect={() => handleSelectLayout(layout)}
              isSelected={layout.id === selectedLayoutId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Layouts;
