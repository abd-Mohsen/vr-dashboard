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
  isSelected: boolean;
}

export const LayoutCard = ({ layout, onDelete, onEdit, onSelect, isSelected }: LayoutCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Prevents triggering selection when clicking Edit/Delete
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return; 
    onSelect();
  };

  return (
    <div
      className={`layout-card ${isSelected ? "selected" : ""}`}
      onClick={handleCardClick}
    >
      <div className="layout-info">
        <h3>{layout.name}</h3>
        <p className="description">{layout.description || "No description"}</p>
        <div className="layout-meta">
          <span>Models: {layout.modelCount || 0}</span>
          <span>Created: {formatDate(layout.createdAt)}</span>
        </div>
      </div>
      
      <div className="layout-actions">
        <button onClick={onEdit} className="btn-edit">Edit</button>
        <button onClick={onDelete} className="btn-delete">Delete</button>
      </div>
    </div>
  );
};
