import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

export const ItemTypes = {
  PICTURE: "PICTURE",
};

const PreviewPicture = ({ picture, index, removeImage, moveImage }) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.PICTURE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveImage(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PICTURE,
    item: () => ({ picture, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;
  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      <div className='deleteImage' onClick={removeImage}>
        X
      </div>
      <img src={picture} className='uploadPicture' alt='preview' />
    </div>
  );
};

export default PreviewPicture;
