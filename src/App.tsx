import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, AppBar, Toolbar as MuiToolbar, Typography } from '@mui/material';
import { LineController } from './LineController.ts';
import { Toolbar } from './components/Toolbar.tsx';
import { CanvasView } from './components/CanvasView.tsx';
import { PropertiesPanel } from './components/PropertiesPanel.tsx';
import type { Line, Tool } from './types';
import { useEditorSettings } from './hooks/useEditorSettings.ts';
import { useShortcuts } from './hooks/useShortcuts.ts';

const theme = createTheme({
  palette: { mode: 'light' }
});

const lineController = new LineController();

const App: React.FC = () => {
  const [lines, setLines] = React.useState<Line[]>([]);
  const [selectedLineId, setSelectedLineId] = React.useState<string | null>(null);
  const [activeTool, setActiveTool] = React.useState<Tool>('select');
  const { settings, setSettings } = useEditorSettings({ strokeColor: '#000000', strokeWidth: 2, gridSize: 20 });
  const stageRef = React.useRef<any>(null);

  React.useEffect(() => {
    return lineController.subscribe(setLines);
  }, []);

  useShortcuts(lineController);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static" elevation={1}>
          <MuiToolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Graphic Editor</Typography>
            <Toolbar
              controller={lineController}
              selectedLineId={selectedLineId}
              setSelectedLineId={setSelectedLineId}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              strokeColor={settings.strokeColor}
              setStrokeColor={(c) => setSettings(s => ({ ...s, strokeColor: c }))}
              strokeWidth={settings.strokeWidth}
              setStrokeWidth={(w) => setSettings(s => ({ ...s, strokeWidth: w }))}
              stageRef={stageRef}
            />
          </MuiToolbar>
        </AppBar>

        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Box sx={{ flex: 1, position: 'relative', bgcolor: 'background.default' }}>
            <CanvasView
              controller={lineController}
              lines={lines}
              selectedLineId={selectedLineId}
              setSelectedLineId={setSelectedLineId}
              activeTool={activeTool}
              strokeColor={settings.strokeColor}
              strokeWidth={settings.strokeWidth}
              stageRef={stageRef}
            />
          </Box>
          <Box sx={{ width: 320, borderLeft: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <PropertiesPanel controller={lineController} selectedLineId={selectedLineId} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;