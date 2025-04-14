// src/Flow.jsx

import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';

import TextUpdaterNode from './TextUpdaterNode';

const initialNodes = [
  {
    id: 'node-1',
    type: 'textUpdater',
    position: { x: 100, y: 100 },
    data: { value: 123 },
    style: { width: 500, height: 200 }, // 🔧 size from here!
  },
];

const nodeTypes = { textUpdater: TextUpdaterNode };

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [],
  );

  const isNodeSelected = nodes.some((node) => node.selected);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        panOnScroll={!isNodeSelected}
        zoomOnScroll={!isNodeSelected}
        panOnDrag={!isNodeSelected}
      >
        <Background variant='dots' gap={16} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default Flow;
