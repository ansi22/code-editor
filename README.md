# Code Editor [Scratch Clone]

## Project Structure
```bash
src/
├── components/              # React components
│   ├── PlayGround/          # Main workspace component
│   │   ├── SpriteManagement # Sprite grid and individual controls
│   │   ├── TaskManagement   # Task assignment and management
│   │   └── TaskItem         # Individual task parameter editor
│   ├── ToolBar/            # Drag-and-drop task palette
│   └── TaskSelector/       # Animation preview and monitoring panel
├── utils/                  # Utility functions and types
│   └── interfaces.ts       # TypeScript interfaces and type definitions
└── App.tsx                 # Root component and state management
```

## Component Architecture

### **App (Root Component)**
- **State Management**: Manages global state (sprites, tasks, collisions)
- **Animation Logic**: Handles animation logic and collision detection  
- **Coordination**: Coordinates communication between components

### **ToolBar**
- **Task Palette**: Provides draggable task items
- **User Experience**: Visual feedback during drag operations
- **Documentation**: Task descriptions and icons

### **PlayGround**
- **Task Integration**: Drop target for tasks
- **Interface**: Tab-based interface (Sprites/Tasks)
- **Controls**: Global animation controls
- **History**: Collision history display

### **TaskSelector**
- **Visualization**: Real-time animation preview
- **Information**: Sprite information panels
- **Collision UI**: Visual collision indicators
- **Monitoring**: Progress monitoring

## Preview
<img width="1276" height="756" alt="Screenshot 2025-11-18 at 9 44 45 PM" src="https://github.com/user-attachments/assets/9539310a-6d07-45d7-9b24-0cc707414a9a" />
