/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Manga } from '@server-actions/manga-list';
import { TypedOmit } from '@utils/type-maps/type-maps';
import { MouseEventHandler, useRef, useState } from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';

type SwipeItemProps = {
  hasDraggedItem: boolean;
  manga: TypedOmit<Manga, 'usersMangaId'>;
};
export default function SwipeItem(props: SwipeItemProps): JSX.Element {
  const [isDrag, setIsDrag] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [percent, setPercent] = useState(0);
  const [left, setLeft] = useState(0);

  const itemRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  const handleStart: DraggableEventHandler = (e, data) => {
    setIsDrag(true);
  };

  const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    console.log(event);
    console.log(isDrag, left);
    if (left !== 0) {
      setIsActionOpen(false);
      setLeft(0);
    } else {
      console.log('click');
    }
  };

  const handleStop: DraggableEventHandler = (e) => {
    if (percent > 30) {
      setIsActionOpen(true);
      if (actionRef.current === null) {
        throw new Error('actionRef.current is null');
      }
      const w = actionRef.current.offsetWidth;
      const leftWithAction = left > 0 ? w : w * -1;
      setLeft(leftWithAction);
    } else {
      setLeft(0);
    }

    setIsDrag(false);
  };

  const handleDrag: DraggableEventHandler = (e, data) => {
    if (itemRef.current === null) {
      throw new Error('itemRef.current is null');
    }
    const w = itemRef.current.offsetWidth;

    // console.log(itemRef.current.offsetWidth);
    const x = data.x < 0 ? data.x * -1 : data.x;
    const p = (x / w) * 100;
    if (p >= 30 && p <= 33) {
      console.log(data);
    }

    setPercent(p);
    setLeft(data.x);
  };

  return (
    <div style={{ position: 'relative', border: '1px solid #ddd' }}>
      <div
        ref={actionRef}
        style={{
          position: 'absolute',
          right   : '0',
        }}
      >
        Delete
      </div>
      <div
        style={{
          overflow       : 'hidden',
          backgroundColor: '#ccc',
        }}
      >
        <Draggable
          axis="x"
          handle=".item"
          defaultPosition={{ x: 0, y: 0 }}
          position={{ x: left, y: 0 }}
          onStart={handleStart}
          onDrag={handleDrag}
          onStop={handleStop}
        >
          <div
            ref={itemRef}
            className="item"
            style={{ transform: `translate3d(${left}px, 0, 0px)` }}
            onClick={handleClick}
          >
            Item
          </div>
        </Draggable>
      </div>
    </div>
  );
}
