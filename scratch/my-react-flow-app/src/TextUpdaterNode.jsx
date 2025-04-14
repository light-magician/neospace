import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import clsx from 'clsx';

function TextUpdaterNode({ id, data, isConnectable, selected }) {
  const reactFlowInstance = useReactFlow();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resizeTextarea();
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [input, messages]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e) => e.stopPropagation();
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        setMessages((prev) => [...prev, { role: 'user', content: input }]);
        setInput('');
      }
    }
  };

  const startResize = (corner) => (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const node = reactFlowInstance.getNode(id);
    const startWidth = node.style?.width || 500;
    const startHeight = node.style?.height || 200;
    const startXPos = node.position?.x || 0;
    const startYPos = node.position?.y || 0;

    const onMouseMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startXPos;
      let newY = startYPos;

      if (corner.includes('right')) {
        newWidth = Math.max(300, startWidth + dx);
      }
      if (corner.includes('left')) {
        newWidth = Math.max(300, startWidth - dx);
        newX = startXPos + dx;
      }
      if (corner.includes('bottom')) {
        newHeight = Math.max(100, startHeight + dy);
      }
      if (corner.includes('top')) {
        newHeight = Math.max(100, startHeight - dy);
        newY = startYPos + dy;
      }

      reactFlowInstance.setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                position: { x: newX, y: newY },
                style: { ...node.style, width: newWidth, height: newHeight },
              }
            : node,
        ),
      );
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className={clsx('react-flow__node-textUpdater', { selected })}>
      {selected && (
        <>
          <Handle
            type='source'
            position={Position.Top}
            className='blue-handle'
            isConnectable={isConnectable}
          />
          <Handle
            type='source'
            position={Position.Right}
            className='blue-handle'
            isConnectable={isConnectable}
          />
          <Handle
            type='source'
            position={Position.Bottom}
            className='blue-handle'
            isConnectable={isConnectable}
          />
          <Handle
            type='source'
            position={Position.Left}
            className='blue-handle'
            isConnectable={isConnectable}
          />
        </>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}
      >
        <div className='chat-history' ref={containerRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className='chat-message'>
              {msg.content}
            </div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          className='chat-input nodrag'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Message...'
        />
      </div>

      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(
        (corner) => (
          <div
            key={corner}
            className={`resize-corner ${corner} nodrag`}
            onMouseDown={startResize(corner)}
          />
        ),
      )}
    </div>
  );
}

export default TextUpdaterNode;
