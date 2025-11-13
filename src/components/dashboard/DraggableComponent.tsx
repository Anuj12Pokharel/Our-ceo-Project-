import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';

interface DraggableComponentProps {
  id: string;
  children: ReactNode;
}

export const DraggableComponent = ({ id, children }: DraggableComponentProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative"
    >
      {/* Drag handle - only draggable from the top area */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-0 left-0 right-0 h-8 cursor-move z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
      </div>
      {children}
    </div>
  );
}; 