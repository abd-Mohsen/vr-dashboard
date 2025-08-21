import "./layouts.scss";

interface LayoutDetailsPopupProps {
  layout: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    lastUpdated: string;
    modelCount?: number;
  };
  onClose: () => void;
  onSetDefault: () => void;
}

export const LayoutDetailsPopup = ({ layout, onClose, onSetDefault }: LayoutDetailsPopupProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content layout-details">
        <h2>Layout Details</h2>
        
        <div className="details-grid">
          <div className="detail-item">
            <label>Name:</label>
            <span>{layout.name}</span>
          </div>
          
          <div className="detail-item">
            <label>Description:</label>
            <span>{layout.description || "No description"}</span>
          </div>
          
          <div className="detail-item">
            <label>Model Count:</label>
            <span>{layout.modelCount || 0}</span>
          </div>
          
          <div className="detail-item">
            <label>Created:</label>
            <span>{formatDate(layout.createdAt)}</span>
          </div>
          
          <div className="detail-item">
            <label>Last Updated:</label>
            <span>{formatDate(layout.lastUpdated)}</span>
          </div>
          
          <div className="detail-item">
            <label>Layout ID:</label>
            <span className="layout-id">{layout.id}</span>
          </div>
        </div>

        <div className="popup-actions">
          <button onClick={onSetDefault} className="btn-default">
            Set as Default Layout
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};