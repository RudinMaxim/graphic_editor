import React from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import { LineController } from '../LineController';

type Props = {
  controller: LineController;
  selectedLineId: string | null;
};

export const PropertiesPanel: React.FC<Props> = ({ controller, selectedLineId }) => {
  const line = selectedLineId ? controller.getLine(selectedLineId) : undefined;

  if (!line) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">No selection</Typography>
      </Box>
    );
  }

  const handleChange = (key: 'startX' | 'startY' | 'endX' | 'endY' | 'strokeWidth', value: number) => {
    controller.updateLine(line.id, { [key]: value } as any);
  };

  return (
    <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
      <Typography variant="subtitle1" sx={{ gridColumn: '1 / -1' }}>Selected Line</Typography>
      <TextField label="Start X" type="number" value={Math.round(line.startX)} size="small" onChange={(e) => handleChange('startX', Number(e.target.value))} />
      <TextField label="Start Y" type="number" value={Math.round(line.startY)} size="small" onChange={(e) => handleChange('startY', Number(e.target.value))} />
      <TextField label="End X" type="number" value={Math.round(line.endX)} size="small" onChange={(e) => handleChange('endX', Number(e.target.value))} />
      <TextField label="End Y" type="number" value={Math.round(line.endY)} size="small" onChange={(e) => handleChange('endY', Number(e.target.value))} />
      <TextField label="Stroke" type="number" value={line.strokeWidth || 2} size="small" onChange={(e) => handleChange('strokeWidth', Number(e.target.value))} InputProps={{ endAdornment: <InputAdornment position="end">px</InputAdornment> }} />
    </Box>
  );
};


