import React from 'react';
import { Box, IconButton, Tooltip, Divider, ToggleButton, ToggleButtonGroup, Slider, ButtonGroup, Button } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';
import BrushIcon from '@mui/icons-material/Brush';
import NearMeIcon from '@mui/icons-material/NearMe';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import type { Tool } from '../types';
import { LineController } from '../LineController';

type Props = {
  controller: LineController;
  selectedLineId: string | null; // kept for future use
  setSelectedLineId: (id: string | null) => void;
  activeTool: Tool;
  setActiveTool: (t: Tool) => void;
  strokeColor: string;
  setStrokeColor: (c: string) => void;
  strokeWidth: number;
  setStrokeWidth: (w: number) => void;
  stageRef: React.RefObject<any>;
};

export const Toolbar: React.FC<Props> = ({
  controller,
  setSelectedLineId,
  activeTool,
  setActiveTool,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  stageRef,
}) => {
  const handleUndo = () => controller.undo();
  const handleRedo = () => controller.redo();
  const handleClear = () => { controller.clear(); setSelectedLineId(null); };

  const handleExportPNG = () => {
    const node = stageRef.current as any;
    if (!node) return;
    const dataURL = node.toDataURL({ pixelRatio: 2 });
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'canvas.png';
    a.click();
  };
  const handleExportJSON = () => {
    const data = { version: 1, lines: controller.getLines() };
    const a = document.createElement('a');
    a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    a.download = 'project.json';
    a.click();
  };
  const handleImportJSON = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const parsed = JSON.parse(text);
        if (parsed && Array.isArray(parsed.lines)) {
          controller.setLines(parsed.lines);
        }
      } catch {}
    };
    input.click();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <ToggleButtonGroup
        value={activeTool}
        exclusive
        onChange={(_, v) => v && setActiveTool(v)}
        size="small"
      >
        <ToggleButton value="select" aria-label="select"><NearMeIcon /></ToggleButton>
        <ToggleButton value="draw" aria-label="draw"><BrushIcon /></ToggleButton>
        <ToggleButton value="delete" aria-label="delete"><DeleteIcon /></ToggleButton>
        <ToggleButton value="pan" aria-label="pan"><PanToolAltIcon /></ToggleButton>
      </ToggleButtonGroup>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <input
        type="color"
        value={strokeColor}
        onChange={(e) => setStrokeColor(e.target.value)}
        aria-label="stroke color"
        style={{ width: 36, height: 28, border: 'none', background: 'transparent' }}
      />
      <Box sx={{ width: 120, px: 1 }}>
        <Slider min={1} max={12} value={strokeWidth} onChange={(_, v) => setStrokeWidth(v as number)} size="small" />
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <Tooltip title="Undo"><span><IconButton onClick={handleUndo}><UndoIcon /></IconButton></span></Tooltip>
      <Tooltip title="Redo"><span><IconButton onClick={handleRedo}><RedoIcon /></IconButton></span></Tooltip>
      <Tooltip title="Clear"><span><IconButton onClick={handleClear}><DeleteSweepIcon /></IconButton></span></Tooltip>
      <Tooltip title="Export PNG"><span><IconButton onClick={handleExportPNG}><DownloadIcon /></IconButton></span></Tooltip>
      <ButtonGroup size="small" variant="outlined">
        <Button onClick={handleExportJSON}>Export JSON</Button>
        <Button onClick={handleImportJSON}>Import JSON</Button>
      </ButtonGroup>
    </Box>
  );
};


