import React from 'react';
import {useDraggable} from '@dnd-kit/core';

interface props {
    id: string;
    children: React.ReactNode;
}
export function Draggable({id , children}: props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: id,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  );
}