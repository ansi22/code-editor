import React, { useState } from "react";
import SpriteManagement from "./SpriteManagement";
import TaskManagement from "./TaskManagement";
import type { PlayGroundProps, ToolItem } from "../utils/interfaces";

function PlayGround({
  tasks,
  clearSelectedItems,
  removeSelectedItem,
  setTasks,
  sprites,
  onExecuteAll,
  onExecuteSprite,
  onStopAll,
  onStopSprite,
  onAssignTasks,
  onRemoveTaskFromSprite,
  onUpdateSpriteTask,
  onClearSpriteTasks,
  onAddSprite,
  onRemoveSprite,
  collisionHistory,
}: PlayGroundProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedSprite, setSelectedSprite] = useState<string | null>(
    sprites[0]?.id || null
  );
  const [activeTab, setActiveTab] = useState<"sprites" | "tasks">("sprites");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const itemData = e.dataTransfer.getData("application/json");
      if (itemData) {
        const newItem: ToolItem = JSON.parse(itemData);

        const taskWithParams = {
          ...newItem,
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          ...getDefaultParams(newItem.type),
        };

        setTasks((prevTasks) => [...prevTasks, taskWithParams]);
        setActiveTab("tasks");
      }
    } catch (error) {
      console.error("Error processing drop:", error);
    }
  };

  const getDefaultParams = (type: string) => {
    switch (type) {
      case "move":
        return { steps: 50, progress: 0 };
      case "turn":
        return { degrees: 90, progress: 0 };
      case "goto":
        return { x: 300, y: 300, progress: 0 };
      case "say":
        return { message: "Hello!", duration: 2000, progress: 0 };
      case "think":
        return { message: "Hmm...", duration: 2000, progress: 0 };
      default:
        return {};
    }
  };

  const updateTaskParams = (id: string, newParams: any) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...newParams } : task
      )
    );
  };

  const isAnySpriteAnimating = sprites.some((sprite) => sprite.isAnimating);
  const selectedSpriteData = sprites.find(
    (sprite) => sprite.id === selectedSprite
  );

  return (
    <div
      className={`h-full flex flex-col transition-all duration-200 ${
        isDragOver ? "bg-blue-50" : "bg-white"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Playground</h2>
            <p className="text-sm text-gray-500">
              {selectedSprite
                ? `Managing: ${selectedSpriteData?.name}`
                : "Select a sprite to manage tasks"}
            </p>
          </div>
          <button
            onClick={onAddSprite}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm"
          >
            + Add Sprite
          </button>
        </div>

        {/* Global Controls */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={onExecuteAll}
            disabled={
              isAnySpriteAnimating || !sprites.some((s) => s.tasks.length > 0)
            }
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              isAnySpriteAnimating || !sprites.some((s) => s.tasks.length > 0)
                ? "bg-gray-100 cursor-not-allowed text-gray-400"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isAnySpriteAnimating ? "Running..." : "Run All"}
          </button>
          <button
            onClick={onStopAll}
            disabled={!isAnySpriteAnimating}
            className={`py-2 px-4 rounded-lg font-medium transition-colors ${
              !isAnySpriteAnimating
                ? "bg-gray-100 cursor-not-allowed text-gray-400"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            Stop All
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("sprites")}
            className={`flex-1 py-2 px-4 text-center font-medium transition-colors rounded-md ${
              activeTab === "sprites"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sprites ({sprites.length})
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex-1 py-2 px-4 text-center font-medium transition-colors rounded-md ${
              activeTab === "tasks"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {selectedSprite ? `${selectedSpriteData?.name}'s Tasks` : "Tasks"}{" "}
            {selectedSprite && `(${selectedSpriteData?.tasks.length || 0})`}
          </button>
        </div>
      </div>

      {/* Collision History */}
      {collisionHistory.length > 0 && (
        <div className="flex-shrink-0 px-6 py-3 bg-yellow-50 border-b border-yellow-100">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-yellow-600 text-sm font-medium whitespace-nowrap">
              Recent collisions:
            </span>
            <div className="flex gap-3">
              {collisionHistory.slice(-4).map((collision, index) => (
                <div
                  key={index}
                  className="text-xs text-yellow-700 whitespace-nowrap flex items-center gap-1"
                >
                  <span className="text-yellow-500">🔄</span>
                  <span>
                    {collision.spriteA} ↔ {collision.spriteB}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 p-6">
        {activeTab === "sprites" ? (
          <SpriteManagement
            sprites={sprites}
            selectedSprite={selectedSprite}
            onSelectSprite={setSelectedSprite}
            onExecuteSprite={onExecuteSprite}
            onStopSprite={onStopSprite}
            onClearSpriteTasks={onClearSpriteTasks}
            onRemoveSprite={onRemoveSprite}
            isAnySpriteAnimating={isAnySpriteAnimating}
          />
        ) : (
          <TaskManagement
            tasks={tasks}
            selectedSprite={selectedSprite}
            selectedSpriteData={selectedSpriteData}
            onAssignTasks={onAssignTasks}
            onRemoveTaskFromSprite={onRemoveTaskFromSprite}
            onUpdateSpriteTask={onUpdateSpriteTask}
            onClearTasks={clearSelectedItems}
            onRemoveTask={removeSelectedItem}
            onUpdateTask={updateTaskParams}
            isAnySpriteAnimating={isAnySpriteAnimating}
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-6 py-3 border-t border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex gap-4">
            <span>Sprites: {sprites.length}</span>
            <span>Active: {sprites.filter((s) => s.isAnimating).length}</span>
            <span>Collisions: {collisionHistory.length}</span>
          </div>
          {selectedSprite && (
            <span className="text-blue-600 font-medium">
              Selected: {selectedSpriteData?.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlayGround;
