import React from 'react';
import { Stage, Layer, Line as KonvaLine, Rect } from 'react-konva';
import { LineController } from '../LineController';
import type { Line, Tool, ViewportState, EditorSettings } from '../types';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const DEFAULT_GRID = 20;

type Props = {
  controller: LineController;
  lines: Line[];
  selectedLineId: string | null;
  setSelectedLineId: (id: string | null) => void;
  activeTool: Tool;
  strokeColor: string;
  strokeWidth: number;
  stageRef: React.RefObject<any>;
};

export const CanvasView: React.FC<Props> = ({
  controller,
  lines,
  selectedLineId,
  setSelectedLineId,
  activeTool,
  strokeColor,
  strokeWidth,
  stageRef,
}) => {
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [tempLine, setTempLine] = React.useState<Partial<Line> | null>(null);
  const [viewport, setViewport] = React.useState<ViewportState>({ scale: 1, offsetX: 0, offsetY: 0 });
  const [settings] = React.useState<EditorSettings>({ gridSize: DEFAULT_GRID, showGrid: true, snapToGrid: true, strokeColor, strokeWidth });
  const isPanningRef = React.useRef(false);
  const lastPosRef = React.useRef<{ x: number; y: number } | null>(null);

  const toCanvasPoint = (stage: any) => {
    const pos = stage.getPointerPosition();
    return { x: (pos.x - viewport.offsetX) / viewport.scale, y: (pos.y - viewport.offsetY) / viewport.scale };
  };

  const snap = (v: number) => settings.snapToGrid ? Math.round(v / settings.gridSize) * settings.gridSize : v;

  const handleMouseDown = (e: any) => {
    const stage = e.target.getStage();
    if (activeTool === 'pan') {
      isPanningRef.current = true;
      lastPosRef.current = stage.getPointerPosition();
      return;
    }
    if (activeTool !== 'draw') return;
    const p = toCanvasPoint(stage);
    const x = snap(p.x);
    const y = snap(p.y);
    setTempLine({ startX: x, startY: y, endX: x, endY: y, color: strokeColor, strokeWidth });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: any) => {
    const stage = e.target.getStage();
    if (isPanningRef.current) {
      const current = stage.getPointerPosition();
      const last = lastPosRef.current!;
      setViewport(v => ({ ...v, offsetX: v.offsetX + (current.x - last.x), offsetY: v.offsetY + (current.y - last.y) }));
      lastPosRef.current = current;
      return;
    }
    if (!isDrawing || !tempLine) return;
    const p = toCanvasPoint(stage);
    setTempLine({ ...tempLine, endX: snap(p.x), endY: snap(p.y) });
  };

  const handleMouseUp = () => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
      lastPosRef.current = null;
      return;
    }
    if (!isDrawing || !tempLine) return;
    controller.createLine({
      startX: tempLine.startX!,
      startY: tempLine.startY!,
      endX: tempLine.endX!,
      endY: tempLine.endY!,
      color: tempLine.color,
      strokeWidth: tempLine.strokeWidth,
    });
    setTempLine(null);
    setIsDrawing(false);
  };

  const handleClickLine = (id: string) => {
    if (activeTool === 'delete') {
      controller.deleteLine(id);
      if (selectedLineId === id) setSelectedLineId(null);
    } else {
      setSelectedLineId(id);
    }
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - viewport.offsetX) / viewport.scale,
      y: (pointer.y - viewport.offsetY) / viewport.scale,
    };
    const newScale = direction > 0 ? viewport.scale * scaleBy : viewport.scale / scaleBy;
    setViewport({
      scale: newScale,
      offsetX: pointer.x - mousePointTo.x * newScale,
      offsetY: pointer.y - mousePointTo.y * newScale,
    });
  };

  const gridLines: React.ReactNode[] = [];
  if (settings.showGrid) {
    for (let x = 0; x <= CANVAS_WIDTH; x += settings.gridSize) {
      gridLines.push(
        <KonvaLine key={`gx${x}`} points={[x, 0, x, CANVAS_HEIGHT]} stroke="#eee" strokeWidth={1} />
      );
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += settings.gridSize) {
      gridLines.push(
        <KonvaLine key={`gy${y}`} points={[0, y, CANVAS_WIDTH, y]} stroke="#eee" strokeWidth={1} />
      );
    }
  }

  return (
    <Stage
      ref={stageRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      style={{ background: '#fafafa' }}
    >
      <Layer scaleX={viewport.scale} scaleY={viewport.scale} x={viewport.offsetX} y={viewport.offsetY}>
        <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill={'#fff'} stroke={'#ddd'} />
        {gridLines}
        {lines.map((l) => (
          <KonvaLine
            key={l.id}
            points={[l.startX, l.startY, l.endX, l.endY]}
            stroke={l.color || '#000'}
            strokeWidth={l.strokeWidth || 2}
            onClick={() => handleClickLine(l.id)}
            shadowColor="black"
            shadowBlur={selectedLineId === l.id ? 8 : 0}
            shadowOpacity={selectedLineId === l.id ? 0.4 : 0}
          />
        ))}
        {tempLine && (
          <KonvaLine
            points={[tempLine.startX!, tempLine.startY!, tempLine.endX!, tempLine.endY!]}
            stroke={tempLine.color || '#000'}
            strokeWidth={tempLine.strokeWidth || 2}
            dash={[6, 6]}
          />
        )}
      </Layer>
    </Stage>
  );
};


