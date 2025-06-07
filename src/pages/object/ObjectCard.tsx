import {useRef } from "react";
import "./ObjectCard.scss";

interface ObjectCardProps {
    object: {
      id: string;
      name: string;
      thumbnail: string;
      description: string;
      lastUpdated: string;
      modelPath: string;
    };
    onView: () => void;
    onDelete: (id: string) => void; // Changed to accept string parameter
}

export const ObjectCard = ({ object, onView, onDelete }: ObjectCardProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      dialogRef.current?.showModal(); // Use showModal() instead of show()
    };
  
    const confirmDelete = () => {
      dialogRef.current?.close();
      onDelete(object.id);
    };

  return (
    <div className="object-card">
      <div className="card-content" onClick={onView}>
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
        </div>
      </div>

      <div className="actions">
        <button className="view" onClick={onView}>
            Edit
        </button>
        <button className="delete" onClick={handleDeleteClick}>
            Delete
        </button>
      </div>

      

      <dialog ref={dialogRef} className="native-dialog">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete "{object.name}"?</p>
        <p>This action cannot be undone.</p>
        <div>
          <button onClick={() => dialogRef.current?.close()}>Cancel</button>
          <button onClick={confirmDelete} className="delete-button">
            Delete
          </button>
        </div>
      </dialog>
    </div>

    
  );
};