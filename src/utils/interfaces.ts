export interface PlayGroundProps {
  tasks: any[];
  clearSelectedItems: () => void;
  removeSelectedItem: (id: string) => void;
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
  sprites: any[];
  onExecuteAll: () => void;
  onExecuteSprite: (spriteId: string) => void;
  onStopAll: () => void;
  onStopSprite: (spriteId: string) => void;
  onAssignTasks: (spriteId: string) => void;
  onRemoveTaskFromSprite: (spriteId: string, taskId: string) => void;
  onUpdateSpriteTask: (
    spriteId: string,
    taskId: string,
    newParams: any
  ) => void;
  onClearSpriteTasks: (spriteId: string) => void;
  onAddSprite: () => void;
  onRemoveSprite: (spriteId: string) => void;
  collisionHistory: any[];
}

export interface ToolItem {
  id: string;
  type: string;
  content: string;
  description?: string;
}

export interface TaskSelectorProps {
  sprites: any[];
}

export interface Sprite {
  id: string;
  name: string;
  x: number;
  y: number;
  rotation: number;
  isAnimating: boolean;
  color: string;
  tasks: any[];
  currentTaskIndex: number;
  speechBubble: { type: string; text: string } | null;
  collisionCooldown: number;
}
