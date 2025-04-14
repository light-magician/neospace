import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';

function TextUpdaterNode({ data, isConnectable, selected }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        setMessages((prev) => [...prev, { role: 'user', content: input }]);
        setInput('');
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [input, messages]);

  const stopFlowInteraction = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className='react-flow__node-textUpdater'
      onMouseEnter={stopFlowInteraction}
      onMouseMove={stopFlowInteraction}
    >
      {/* Only show handles if node is selected */}
      {selected && (
        <>
          <Handle
            type='source'
            position={Position.Top}
            id='top'
            className='blue-handle'
            isConnectable={isConnectable}
          />
          <Handle
            type='source'
            position={Position.Right}
            id='right'
            className='blue-handle'
            isConnectable={isConnectable}
          />
          <Handle
            type='source'
            position={Position.Bottom}
            id='bottom'
            className='blue-handle'
            isConnectable={isConnectable}
          />
          <Handle
            type='source'
            position={Position.Left}
            id='left'
            className='blue-handle'
            isConnectable={isConnectable}
          />
        </>
      )}

      <div
        className='chat-history nodrag'
        ref={containerRef}
        onMouseDown={stopFlowInteraction}
      >
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
        onMouseDown={stopFlowInteraction}
      />
    </div>
  );
}

export default TextUpdaterNode;
