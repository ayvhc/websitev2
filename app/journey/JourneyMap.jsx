"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactFlow, {
  BaseEdge,
  EdgeText,
  getBezierPath,
  Handle,
  MarkerType,
  Position,
  ReactFlowProvider,
} from 'reactflow';
import {
  CircleDot,
  Clock3,
  Compass,
  Copy,
  ExternalLink,
  Flag,
  GitBranch,
  Map,
  Move,
  Route,
  Sparkles,
  X,
} from 'lucide-react';
import { lifeEdges, lifeNodes, viewModes } from './data/lifeMapData';

const nodeTypes = { custom: CustomNode };
const edgeTypes = {
  actualGrid: ActualGridEdge,
  hiddenLowerLabel: HiddenLowerLabelEdge,
  hiddenSideToTop: HiddenSideToTopEdge,
  leftDrop: LeftDropEdge,
};
const nodeOrigin = [0.5, 0];
const layoutGrid = [300, 95];
const standardNodeWidth = 246;
const standardNodeHeight = 128;
const layoutStorageKey = 'journey-layout-draft';
const canvasExtent = [
  [-2100, -700],
  [2200, 4700],
];

function snapToLayoutColumn(x) {
  return Math.round(x / layoutGrid[0]) * layoutGrid[0];
}

function snapToLayoutGrid(position) {
  return {
    x: snapToLayoutColumn(position.x),
    y: Math.round(position.y / layoutGrid[1]) * layoutGrid[1],
  };
}

function resolveNodePosition(node, positionOverrides) {
  if (node.attachedTo) {
    const parentNode = lifeNodes.find((candidate) => candidate.id === node.attachedTo);

    if (parentNode) {
      const parentPosition =
        positionOverrides[parentNode.id] ?? snapToLayoutGrid(parentNode.position);
      const visibleRatio = 1 - (node.overlapRatio ?? 0.3);
      const direction = node.attachedSide === 'right' ? 1 : -1;

      return {
        x: parentPosition.x + direction * standardNodeWidth * visibleRatio,
        y: parentPosition.y,
      };
    }
  }

  return positionOverrides[node.id] ?? snapToLayoutGrid(node.position);
}

const modeIcons = {
  actual: Route,
  possible: GitBranch,
  hidden: Sparkles,
  full: Map,
};

const typeIcons = {
  Milestone: Flag,
  Decision: GitBranch,
  Experience: Compass,
  Unlock: Sparkles,
};

const edgeStyles = {
  actual: {
    stroke: '#626860',
    strokeWidth: 3,
  },
  alternate: {
    stroke: '#979b95',
    strokeWidth: 2,
    strokeDasharray: '7 8',
  },
  hidden: {
    stroke: '#8d9df0',
    strokeWidth: 2.8,
  },
};

const storySections = [
  ['What happened', 'whatHappened'],
  ['Why it mattered at the time', 'whyItMattered'],
  ['Outcome', 'outcome'],
  ['What it secretly unlocked', 'secretUnlock'],
  ['Alternate path', 'alternatePath'],
  ['How I see it now', 'reflection'],
  ['What I want from it', 'whatIWant'],
  ['Why I care', 'whyICare'],
  ['What it may unlock', 'whatItMayUnlock'],
  ['How I see it', 'howISeeIt'],
  ['Founder', 'founder'],
];

function isNodeVisible(node, mode) {
  if (mode === 'full') return true;
  if (mode === 'possible') return node.status !== 'hidden' || node.type === 'Unlock';
  return node.status !== 'alternate';
}

function isEdgeVisible(edge, mode) {
  if (mode === 'full') return true;
  if (mode === 'possible') return edge.type === 'actual' || edge.type === 'alternate';
  if (mode === 'hidden') return edge.type === 'actual' || edge.type === 'hidden';
  return edge.type === 'actual';
}

function calculateBezierControlOffset(distance, curvature = 0.25) {
  if (distance >= 0) return 0.5 * distance;
  return curvature * 25 * Math.sqrt(-distance);
}

function getBezierControlPoint(position, x1, y1, x2, y2) {
  if (position === Position.Left) {
    return { x: x1 - calculateBezierControlOffset(x1 - x2), y: y1 };
  }

  if (position === Position.Right) {
    return { x: x1 + calculateBezierControlOffset(x2 - x1), y: y1 };
  }

  if (position === Position.Top) {
    return { x: x1, y: y1 - calculateBezierControlOffset(y1 - y2) };
  }

  return { x: x1, y: y1 + calculateBezierControlOffset(y2 - y1) };
}

function getCubicBezierPoint(sourcePoint, controlPointA, controlPointB, targetPoint, t) {
  const mt = 1 - t;
  return {
    x:
      mt ** 3 * sourcePoint.x +
      3 * mt ** 2 * t * controlPointA.x +
      3 * mt * t ** 2 * controlPointB.x +
      t ** 3 * targetPoint.x,
    y:
      mt ** 3 * sourcePoint.y +
      3 * mt ** 2 * t * controlPointA.y +
      3 * mt * t ** 2 * controlPointB.y +
      t ** 3 * targetPoint.y,
  };
}

export default function JourneyMap() {
  return (
    <ReactFlowProvider>
      <VersionsMap />
    </ReactFlowProvider>
  );
}

function VersionsMap() {
  const [mode, setMode] = useState('actual');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isArrangeMode, setIsArrangeMode] = useState(false);
  const [positionOverrides, setPositionOverrides] = useState({});
  const [copyStatus, setCopyStatus] = useState('Copy Layout');

  useEffect(() => {
    document.documentElement.dataset.theme = 'light';
    document.documentElement.style.colorScheme = 'light';

    return () => {
      const savedTheme = window.localStorage.getItem('yihung-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const nextTheme = savedTheme === 'dark' || (!savedTheme && prefersDark) ? 'dark' : 'light';
      document.documentElement.dataset.theme = nextTheme;
      document.documentElement.style.colorScheme = nextTheme;
    };
  }, []);

  useEffect(() => {
    try {
      const savedLayout = window.localStorage.getItem(layoutStorageKey);
      if (savedLayout) setPositionOverrides(JSON.parse(savedLayout));
    } catch {
      window.localStorage.removeItem(layoutStorageKey);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(positionOverrides).length === 0) return;
    window.localStorage.setItem(layoutStorageKey, JSON.stringify(positionOverrides));
  }, [positionOverrides]);

  const selectedNode = useMemo(
    () => lifeNodes.find((node) => node.id === selectedNodeId),
    [selectedNodeId],
  );

  const selectedConnections = useMemo(() => {
    if (!selectedNodeId) return new Set();
    return new Set(
      lifeEdges
        .filter((edge) => edge.source === selectedNodeId || edge.target === selectedNodeId)
        .map((edge) => edge.id),
    );
  }, [selectedNodeId]);

  const visibleNodeIds = useMemo(() => {
    return new Set(lifeNodes.filter((node) => isNodeVisible(node, mode)).map((node) => node.id));
  }, [mode]);

  const filteredEdges = useMemo(() => {
    return lifeEdges.filter(
      (edge) =>
        isEdgeVisible(edge, mode) &&
        visibleNodeIds.has(edge.source) &&
        visibleNodeIds.has(edge.target),
    );
  }, [mode, visibleNodeIds]);

  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId) return new Set();
    const ids = new Set([selectedNodeId]);
    filteredEdges.forEach((edge) => {
      if (edge.source === selectedNodeId) ids.add(edge.target);
      if (edge.target === selectedNodeId) ids.add(edge.source);
    });
    return ids;
  }, [filteredEdges, selectedNodeId]);

  const flowNodes = useMemo(() => {
    return lifeNodes
      .filter((node) => visibleNodeIds.has(node.id))
      .map((node) => ({
        id: node.id,
        type: 'custom',
        draggable: !node.attachedTo,
        position: resolveNodePosition(node, positionOverrides),
        zIndex:
          node.attachedTo || node.overlay === 'right'
            ? 0
            : node.id === 'ivy-capital' || node.id === 'joined-opera'
              ? 2
              : 1,
        data: {
          ...node,
          isDimmed: Boolean(selectedNodeId) && !connectedNodeIds.has(node.id),
        },
      }));
  }, [connectedNodeIds, positionOverrides, selectedNodeId, visibleNodeIds]);

  const flowEdges = useMemo(() => {
    return filteredEdges.map((edge) => {
      const isConnected = selectedConnections.has(edge.id);
      const isMuted = selectedNodeId && !isConnected;
      const baseStyle = edgeStyles[edge.type];
      const sourceNode = lifeNodes.find((node) => node.id === edge.source);
      const targetNode = lifeNodes.find((node) => node.id === edge.target);
      const sourceNodePosition = sourceNode
        ? resolveNodePosition(sourceNode, positionOverrides)
        : null;
      const targetNodePosition = targetNode
        ? resolveNodePosition(targetNode, positionOverrides)
        : null;
      const branchAlignmentNode = edge.alignBranchWith
        ? lifeNodes.find((node) => node.id === edge.alignBranchWith)
        : null;
      const branchAlignmentPosition = branchAlignmentNode
        ? resolveNodePosition(branchAlignmentNode, positionOverrides)
        : null;
      const alignedBranchY =
        sourceNodePosition && branchAlignmentPosition
          ? (sourceNodePosition.y + standardNodeHeight + branchAlignmentPosition.y) / 2
          : undefined;
      const isSameRowConnection =
        edge.type === 'actual' &&
        !edge.sourceHandle &&
        !edge.targetHandle &&
        sourceNodePosition &&
        targetNodePosition &&
        sourceNodePosition.x !== targetNodePosition.x &&
        sourceNodePosition.y === targetNodePosition.y;
      const needsTightSideExit =
        edge.type === 'actual' &&
        !edge.sourceHandle &&
        sourceNodePosition &&
        targetNodePosition &&
        sourceNodePosition.x !== targetNodePosition.x &&
        targetNodePosition.y > sourceNodePosition.y &&
        targetNodePosition.y - sourceNodePosition.y < standardNodeHeight;
      const needsSideExit = isSameRowConnection || needsTightSideExit;
      const showLabel =
        (edge.type === 'hidden' && (mode === 'hidden' || mode === 'full')) ||
        (edge.type === 'alternate' && (mode === 'possible' || mode === 'full'));

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: needsSideExit
          ? targetNodePosition.x > sourceNodePosition.x
            ? 'source-right'
            : 'source-left'
          : edge.sourceHandle,
        targetHandle: isSameRowConnection
          ? sourceNodePosition.x < targetNodePosition.x
            ? 'target-left'
            : 'target-right'
          : edge.targetHandle,
        type:
          edge.type === 'actual'
            ? 'actualGrid'
            : edge.route === 'side-to-top'
              ? 'hiddenSideToTop'
            : edge.route === 'straight'
              ? 'straight'
            : Number.isFinite(edge.labelT)
            ? 'hiddenLowerLabel'
            : edge.type === 'hidden'
            ? 'bezier'
            : edge.route === 'side-to-side'
              ? 'straight'
            : edge.route === 'left-drop'
                ? 'leftDrop'
                : 'smoothstep',
        label: showLabel ? edge.label : undefined,
        animated: edge.type === 'hidden',
        className: `life-edge edge-${edge.type}${isConnected ? ' is-connected' : ''}${
          isMuted ? ' is-muted' : ''
        }`,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: baseStyle.stroke,
          width: edge.type === 'hidden' ? 18 : 14,
          height: edge.type === 'hidden' ? 18 : edge.type === 'actual' ? 10 : 14,
        },
        style: {
          ...baseStyle,
          opacity: isMuted ? 0.16 : 1,
          strokeWidth: isConnected ? baseStyle.strokeWidth + 1 : baseStyle.strokeWidth,
        },
        labelBgPadding: [8, 4],
        labelBgBorderRadius: 999,
        labelBgStyle: {
          fill: edge.type === 'hidden' ? '#fbfaff' : '#fffdf8',
          fillOpacity: isMuted ? 0.2 : 0.92,
        },
        labelStyle: {
          fill: edge.type === 'hidden' ? '#6661b3' : '#6c706a',
          fontSize: 11,
          fontWeight: 700,
          opacity: isMuted ? 0.2 : 1,
        },
        data:
          Number.isFinite(edge.labelT) ||
          Number.isFinite(edge.branchX) ||
          Number.isFinite(alignedBranchY) ||
          Number.isFinite(edge.curveOffset)
            ? {
                labelT: edge.labelT,
                branchX: Number.isFinite(edge.branchX)
                  ? snapToLayoutColumn(edge.branchX)
                  : edge.branchX,
                branchY: alignedBranchY,
                curveOffset: edge.curveOffset,
              }
            : undefined,
      };
    });
  }, [
    filteredEdges,
    mode,
    positionOverrides,
    selectedConnections,
    selectedNodeId,
  ]);

  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onNodesChange = useCallback(
    (changes) => {
      if (!isArrangeMode) return;

      setPositionOverrides((currentPositions) => {
        let didMove = false;
        const nextPositions = { ...currentPositions };

        changes.forEach((change) => {
          if (change.type === 'position' && change.position) {
            nextPositions[change.id] = snapToLayoutGrid(change.position);
            didMove = true;
          }
        });

        return didMove ? nextPositions : currentPositions;
      });
    },
    [isArrangeMode],
  );

  const copyLayout = useCallback(async () => {
    const completeLayout = Object.fromEntries(
      lifeNodes.map((node) => [
        node.id,
        resolveNodePosition(node, positionOverrides),
      ]),
    );

    try {
      await navigator.clipboard.writeText(JSON.stringify(completeLayout, null, 2));
      setCopyStatus('Copied');
      window.setTimeout(() => setCopyStatus('Copy Layout'), 1800);
    } catch {
      setCopyStatus('Copy Failed');
    }
  }, [positionOverrides]);

  const openIntro = useCallback(() => {
    setIsIntroOpen(true);
  }, []);

  const closeIntro = useCallback(() => {
    setIsIntroOpen(false);
  }, []);

  const onTitleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openIntro();
      }
    },
    [openIntro],
  );

  return (
    <div className="journey-app-shell">
      <main className="map-stage">
        <section className="map-shell" aria-label="Interactive life decision map">
          <div className="top-overlay" aria-label="Map controls">
            <div className="floating-header">
              <div
                className="hero-copy intro-trigger"
                role="button"
                tabIndex={0}
                aria-label="Open introduction"
                onClick={openIntro}
                onKeyDown={onTitleKeyDown}
              >
                <h1>The Path</h1>
              </div>

              <div className="mode-buttons" aria-label="Map views">
                {viewModes.map((view) => {
                  const Icon = modeIcons[view.id];
                  const isActive = mode === view.id;

                  return (
                    <button
                      className={`mode-button${isActive ? ' is-active' : ''}`}
                      key={view.id}
                      onClick={() => setMode(view.id)}
                      title={view.description}
                      aria-pressed={isActive}
                      type="button"
                    >
                      <Icon size={17} aria-hidden="true" />
                      <span>{view.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="layout-editor-controls" aria-label="Layout editor controls">
            <span className="layout-editor-status">
              {isArrangeMode ? 'Layout editing: drag blocks to grid slots' : 'Arrow preview'}
            </span>
            {isArrangeMode ? (
              <button className="layout-editor-button" onClick={copyLayout} type="button">
                <Copy size={15} aria-hidden="true" />
                <span>{copyStatus}</span>
              </button>
            ) : null}
            <button
              className={`layout-editor-button${isArrangeMode ? ' is-active' : ''}`}
              onClick={() => {
                setSelectedNodeId(null);
                setIsArrangeMode((currentMode) => !currentMode);
              }}
              type="button"
            >
              <Move size={15} aria-hidden="true" />
              <span>{isArrangeMode ? 'Preview Arrows' : 'Arrange Blocks'}</span>
            </button>
          </div>

          <ReactFlow
            nodes={flowNodes}
            edges={isArrangeMode ? [] : flowEdges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodeOrigin={nodeOrigin}
            snapToGrid
            snapGrid={layoutGrid}
            onNodesChange={onNodesChange}
            onNodeClick={isArrangeMode ? undefined : onNodeClick}
            onPaneClick={() => setSelectedNodeId(null)}
            fitView
            fitViewOptions={{ padding: 0.22 }}
            translateExtent={canvasExtent}
            minZoom={0.16}
            maxZoom={1.35}
            nodesDraggable={isArrangeMode}
            nodesConnectable={false}
            elementsSelectable
            panOnScroll
            preventScrolling
            selectionOnDrag={false}
            proOptions={{ hideAttribution: true }}
          />

        </section>

        <AnimatePresence>
          {selectedNode ? (
            <StoryPanel
              key={selectedNode.id}
              node={selectedNode}
              onClose={() => setSelectedNodeId(null)}
            />
          ) : null}
        </AnimatePresence>

        <IntroModal isOpen={isIntroOpen} onClose={closeIntro} />
      </main>
    </div>
  );
}

function ActualGridEdge({
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  style,
  markerEnd,
  interactionWidth,
  data,
}) {
  const branchY = Number.isFinite(data?.branchY) ? data.branchY : (sourceY + targetY) / 2;
  const exitsFromSide =
    sourcePosition === Position.Left || sourcePosition === Position.Right;
  const path = exitsFromSide
    ? `M ${sourceX},${sourceY} L ${targetX},${sourceY} L ${targetX},${targetY}`
    : sourceX === targetX
      ? `M ${sourceX},${sourceY} L ${targetX},${targetY}`
      : `M ${sourceX},${sourceY} L ${sourceX},${branchY} L ${targetX},${branchY} L ${targetX},${targetY}`;

  return (
    <BaseEdge
      path={path}
      markerEnd={markerEnd}
      style={style}
      interactionWidth={interactionWidth}
    />
  );
}

function LeftDropEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  markerEnd,
  interactionWidth,
  label,
  labelStyle,
  labelBgStyle,
  labelBgPadding,
  labelBgBorderRadius,
}) {
  const branchOffset = Math.max(24, Math.min(44, (targetY - sourceY) / 2));
  const branchY = sourceY + branchOffset;
  const path = `M ${sourceX},${sourceY} L ${sourceX},${branchY} L ${targetX},${branchY} L ${targetX},${targetY}`;
  const labelX = (sourceX + targetX) / 2;
  const labelY = branchY - 12;

  return (
    <>
      <BaseEdge
        path={path}
        markerEnd={markerEnd}
        style={style}
        interactionWidth={interactionWidth}
      />
      <EdgeText
        x={labelX}
        y={labelY}
        label={label}
        labelStyle={labelStyle}
        labelBgStyle={labelBgStyle}
        labelBgPadding={labelBgPadding}
        labelBgBorderRadius={labelBgBorderRadius}
      />
    </>
  );
}

function HiddenLowerLabelEdge({
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  style,
  markerEnd,
  interactionWidth,
  label,
  labelStyle,
  labelBgStyle,
  labelBgPadding,
  labelBgBorderRadius,
  data,
}) {
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const sourcePoint = { x: sourceX, y: sourceY };
  const targetPoint = { x: targetX, y: targetY };
  const sourceControlPoint = getBezierControlPoint(
    sourcePosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
  );
  const targetControlPoint = getBezierControlPoint(
    targetPosition,
    targetX,
    targetY,
    sourceX,
    sourceY,
  );
  const labelPoint = getCubicBezierPoint(
    sourcePoint,
    sourceControlPoint,
    targetControlPoint,
    targetPoint,
    data?.labelT ?? 0.68,
  );

  return (
    <>
      <BaseEdge
        path={path}
        markerEnd={markerEnd}
        style={style}
        interactionWidth={interactionWidth}
      />
      <EdgeText
        x={labelPoint.x}
        y={labelPoint.y}
        label={label}
        labelStyle={labelStyle}
        labelBgStyle={labelBgStyle}
        labelBgPadding={labelBgPadding}
        labelBgBorderRadius={labelBgBorderRadius}
      />
    </>
  );
}

function HiddenSideToTopEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  markerEnd,
  interactionWidth,
  label,
  labelStyle,
  labelBgStyle,
  labelBgPadding,
  labelBgBorderRadius,
  data,
}) {
  const usesAvoidanceCurve = Number.isFinite(data?.curveOffset);
  let path;
  let labelPoint;

  if (usesAvoidanceCurve) {
    const horizontalDistance = Math.abs(targetX - sourceX);
    const verticalDistance = Math.abs(targetY - sourceY);
    const sourcePoint = { x: sourceX, y: sourceY };
    const sourceControlPoint = {
      x: sourceX + Math.max(120, horizontalDistance * 0.32),
      y: sourceY + data.curveOffset,
    };
    const targetControlPoint = {
      x: targetX,
      y: targetY - Math.max(130, verticalDistance * 0.62),
    };
    const targetPoint = { x: targetX, y: targetY };

    path = `M ${sourceX},${sourceY} C ${sourceControlPoint.x},${sourceControlPoint.y} ${targetControlPoint.x},${targetControlPoint.y} ${targetX},${targetY}`;
    labelPoint = getCubicBezierPoint(
      sourcePoint,
      sourceControlPoint,
      targetControlPoint,
      targetPoint,
      data.labelT ?? 0.68,
    );
  } else {
    const [bezierPath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition: Position.Right,
      targetX,
      targetY,
      targetPosition: Position.Top,
    });

    path = bezierPath;
    labelPoint = { x: labelX, y: labelY };
  }

  return (
    <>
      <BaseEdge
        path={path}
        markerEnd={markerEnd}
        style={style}
        interactionWidth={interactionWidth}
      />
      <EdgeText
        x={labelPoint.x}
        y={labelPoint.y - 12}
        label={label}
        labelStyle={labelStyle}
        labelBgStyle={labelBgStyle}
        labelBgPadding={labelBgPadding}
        labelBgBorderRadius={labelBgBorderRadius}
      />
    </>
  );
}

function CustomNode({ data, selected }) {
  const Icon = typeIcons[data.type] || CircleDot;
  const classes = [
    'life-node',
    `node-status-${data.status}`,
    `node-type-${slugify(data.type)}`,
    selected ? 'is-selected' : '',
    data.isDimmed ? 'is-dimmed' : '',
    data.attachedTo ? 'is-attached-self' : '',
    data.attachedTo && data.attachedSide === 'right' ? 'is-attached-right' : '',
    data.overlay === 'right' ? 'is-right-overlay' : '',
    data.compact ? 'is-compact' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <Handle type="target" position={Position.Top} />
      <Handle id="target-left" type="target" position={Position.Left} />
      <Handle id="target-right" type="target" position={Position.Right} />
      <div className="node-shine" />
      <div className="node-type-row">
        <span className="node-icon">
          <Icon size={14} aria-hidden="true" />
        </span>
        <span>{data.type}</span>
      </div>
      <h2>{data.title}</h2>
      <div className="node-time">
        <Clock3 size={12} aria-hidden="true" />
        <span>{data.time}</span>
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle id="source-left" type="source" position={Position.Left} />
      <Handle id="source-right" type="source" position={Position.Right} />
    </div>
  );
}

function StoryPanel({ node, onClose }) {
  const Icon = typeIcons[node.type] || CircleDot;
  const visibleSections = storySections.filter(([, key]) => node[key]);

  return (
    <motion.aside
      className="story-panel"
      initial={{ opacity: 0, x: 34, y: 16 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 26, y: 16 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      aria-label={`${node.title} story`}
    >
      <button className="panel-close" type="button" onClick={onClose} title="Close">
        <X size={18} aria-hidden="true" />
      </button>

      <div className="panel-kicker">
        <span className="panel-icon">
          <Icon size={16} aria-hidden="true" />
        </span>
        <span>{node.type}</span>
      </div>
      <h2>{node.title}</h2>
      <p className="panel-time">{node.time}</p>
      {node.summary ? <p className="panel-summary">{node.summary}</p> : null}
      {node.link ? (
        <a className="panel-link" href={node.link.href} target="_blank" rel="noreferrer">
          <span>{node.link.label}</span>
          <ExternalLink size={15} aria-hidden="true" />
        </a>
      ) : null}

      <div className="story-sections">
        {visibleSections.map(([label, key]) => (
          <section key={key}>
            <h3>{label}</h3>
            <p>{node[key]}</p>
          </section>
        ))}
      </div>
    </motion.aside>
  );
}

function IntroModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="intro-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onClick={onClose}
        >
          <motion.div
            className="intro-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="intro-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="intro-modal-close"
              type="button"
              aria-label="Close introduction"
              onClick={onClose}
            >
              <X size={18} aria-hidden="true" />
            </button>

            <p className="intro-modal-label">ABOUT THIS MAP</p>
            <h2 id="intro-modal-title">The Path</h2>
            <div className="intro-modal-body">
              <p>
                Some decisions feel less like choices and more like thoughts that suddenly
                appeared in my head. I follow them, and only later do I understand what they
                changed.
              </p>
              <p>
                Each choice feels critical. If even one of them did not happen, my life could
                have become completely different. Sometimes I wonder whether we really make
                choices at all, or whether some paths were always meant to find us.
              </p>
              <p>
                I study founders and people I look up to because I want to understand how their
                strengths were built. This map is my attempt to ask the same question about
                myself: what made me this way, what could have made me different, and what still
                needs to happen for me to become the person I am trying to reach.
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
