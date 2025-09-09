# Visual Line Editor MVP

A minimal visual line editor built with React, TypeScript, and react-konva. This MVP provides basic line drawing, editing, and manipulation capabilities.

## Features

- **Draw Lines**: Click and drag to create straight lines on the canvas
- **Select Lines**: Click on lines to select them (highlighted with shadow)
- **Move Lines**: Use arrow keys to move selected lines
- **Delete Lines**: Use the delete tool or press Delete key to remove lines
- **Undo**: Remove the last created line
- **Real-time Status**: View cursor coordinates, active tool, and line count
- **Properties Panel**: See detailed information about the selected line

## Architecture

The application follows a simple MVC-inspired architecture:

- **Model**: `LineController` manages line data (create, update, delete, undo)
- **View**: React components with react-konva canvas
- **Controller**: Event handlers that coordinate between model and view

## Usage

1. **Select Tool**: Click the "Select" button to enter selection mode
2. **Draw Tool**: Click the "Draw" button to enter drawing mode
3. **Delete Tool**: Click the "Delete" button to enter deletion mode
4. **Drawing**: In draw mode, click and drag on the canvas to create lines
5. **Selecting**: In select mode, click on lines to select them
6. **Moving**: With a line selected, use arrow keys to move it
7. **Deleting**: In delete mode, click on lines to remove them, or press Delete key with a line selected
8. **Undo**: Click the "Undo" button to remove the last created line

## Installation

```bash
npm install
npm install react-konva konva
npm run dev
```

## Project Structure

```
src/
├── App.tsx          # Main application component
├── LineController.ts # Line data management (Model)
├── types.ts         # TypeScript type definitions
└── main.tsx         # Application entry point
```

## Technical Details

- **Framework**: React 19 with TypeScript
- **Canvas**: react-konva for 2D graphics
- **State Management**: React hooks with custom controller
- **Styling**: Inline CSS for simplicity
- **Architecture**: Clean separation of concerns with MVC pattern
