import "./layouts.scss";

interface LayoutCardProps {
  layout: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    lastUpdated: string;
    modelCount?: number;
  };
  onView: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onSelect: () => void;
}

export const LayoutCard = ({ layout, onView, onDelete, onEdit, onSelect: onSelect }: LayoutCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="layout-card">
      <div className="layout-info">
        <h3>{layout.name}</h3>
        <p className="description">{layout.description || "No description"}</p>
        <div className="layout-meta">
          <span>Models: {layout.modelCount || 0}</span>
          <span>Created: {formatDate(layout.createdAt)}</span>
        </div>
      </div>
      
      <div className="layout-actions">
        {/* <button onClick={onView} className="btn-view">View Details</button> */}
        {/* <button onClick={onSetDefault} className="btn-default">Set Default</button> */}
        <button onClick={onEdit} className="btn-edit">Edit</button>
        <button onClick={onDelete} className="btn-delete">Delete</button>
      </div>
    </div>
  );
};