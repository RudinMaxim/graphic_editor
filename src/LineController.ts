import type { Line } from "./types";

export class LineController {
  private lines: Line[] = [];
  private listeners: Array<(lines: Line[]) => void> = [];
  private undoStack: Line[][] = [];
  private redoStack: Line[][] = [];

  subscribe(listener: (lines: Line[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.lines]));
  }

  createLine(line: Omit<Line, 'id'>): Line {
    this.pushUndo();
    this.redoStack = [];
    const newLine: Line = {
      ...line,
      id: `line_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    this.lines.push(newLine);
    this.notify();
    return newLine;
  }

  updateLine(id: string, updates: Partial<Omit<Line, 'id'>>): boolean {
    const index = this.lines.findIndex(line => line.id === id);
    if (index === -1) return false;
    this.pushUndo();
    this.redoStack = [];
    this.lines[index] = { ...this.lines[index], ...updates };
    this.notify();
    return true;
  }

  deleteLine(id: string): boolean {
    const index = this.lines.findIndex(line => line.id === id);
    if (index === -1) return false;
    this.pushUndo();
    this.redoStack = [];
    this.lines.splice(index, 1);
    this.notify();
    return true;
  }

  getLines(): Line[] {
    return [...this.lines];
  }

  getLine(id: string): Line | undefined {
    return this.lines.find(line => line.id === id);
  }

  setLines(newLines: Line[]): void {
    this.pushUndo();
    this.redoStack = [];
    this.lines = [...newLines];
    this.notify();
  }

  moveLine(id: string, deltaX: number, deltaY: number): boolean {
    const index = this.lines.findIndex(l => l.id === id);
    if (index === -1) return false;
    const l = this.lines[index];
    return this.updateLine(id, {
      startX: l.startX + deltaX,
      startY: l.startY + deltaY,
      endX: l.endX + deltaX,
      endY: l.endY + deltaY,
    });
  }

  undo(): boolean {
    if (this.undoStack.length === 0) return false;
    this.redoStack.push([...this.lines]);
    this.lines = this.undoStack.pop()!;
    this.notify();
    return true;
  }

  redo(): boolean {
    if (this.redoStack.length === 0) return false;
    this.undoStack.push([...this.lines]);
    this.lines = this.redoStack.pop()!;
    this.notify();
    return true;
  }

  clear(): void {
    this.pushUndo();
    this.redoStack = [];
    this.lines = [];
    this.notify();
  }

  private pushUndo() {
    this.undoStack.push([...this.lines]);
    if (this.undoStack.length > 100) {
      this.undoStack.shift();
    }
  }
}
