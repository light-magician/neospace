import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';

import './index.css';

function TextUpdaterNode({ data, isConnectable }) {
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

  return (
    <div className='react-flow__node-textUpdater'>
      <Handle
        type='target'
        position={Position.Top}
        isConnectable={isConnectable}
      />

      <div className='chat-history' ref={containerRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className='chat-message'>
            {msg.content}
          </div>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        className='chat-input'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Message...'
      />

      <Handle
        type='source'
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default TextUpdaterNode;
