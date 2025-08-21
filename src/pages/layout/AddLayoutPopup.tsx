import { useState, useEffect } from "react";
import "./layouts.scss";

interface AddLayoutPopupProps {
  onClose: () => void;
  onAdd: (name: string, description: string, layoutId?: string) => Promise<void>;
  layout?: {
    id: string;
    name: string;
    description: string;
  } | null;
}

export const AddLayoutPopup = ({ onClose, onAdd, layout }: AddLayoutPopupProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (layout) {
      setName(layout.name);
      setDescription(layout.description);
    }
  }, [layout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Layout name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onAdd(name, description, layout?.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save layout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>{layout ? "Edit Layout" : "Create New Layout"}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Layout Name *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter layout name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter layout description"
              rows={3}
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="popup-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : layout ? "Update Layout" : "Create Layout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};