import React from 'react';
import {useDroppable} from '@dnd-kit/core';

interface props {
    id: string;
    children: React.ReactNode;
}
export function Droppable({id , children}: props) {
  const {isOver, setNodeRef} = useDroppable({
    id: id,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  
  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}