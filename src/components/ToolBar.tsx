import { useState } from "react";

interface ToolItem {
  id: string;
  type: string;
  content: string;
  description?: string;
}

function ToolBar() {
  const [isDragging, setIsDragging] = useState(false);

  const toolItems: ToolItem[] = [
    { id: "move", type: "move", content: "move", description: "Move forward" },
    {
      id: "turn",
      type: "turn",
      content: "turn",
      description: "Turn direction",
    },
    {
      id: "goto",
      type: "goto",
      content: "goto",
      description: "Go to position",
    },
    { id: "say", type: "say", content: "say", description: "Say something" },
    {
      id: "think",
      type: "think",
      content: "think",
      description: "Think thought",
    },
  ];

  const handleDragStart = (e: React.DragEvent, item: ToolItem) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/json", JSON.stringify(item));

    // Add visual feedback
    e.currentTarget.classList.add("opacity-50", "scale-95");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    e.currentTarget.classList.remove("opacity-50", "scale-95");
  };

  return (
    <div
      className={`bg-[#b7e9f6] flex flex-col gap-4 p-8 h-screen border-[0.5px] border-[#007b88] transition-colors duration-200 ${
        isDragging ? "bg-[#a0ddf2]" : ""
      }`}
    >
      <h2 className="text-xl font-bold text-[#007b88] mb-4">Task Selector</h2>

      {/* Tool Items */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-[#007b88] mb-3">
          Available Tasks
        </h3>
        {toolItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl shadow-2xl bg-[#fff] cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-lg hover:scale-105 border border-transparent hover:border-blue-300 group mb-3"
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragEnd={handleDragEnd}
            title={item.description}
          >
            <div className="font-medium text-gray-800">{item.content}</div>
            {item.description && (
              <div className="text-sm text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.description}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-auto pt-4 border-t border-[#007b88]">
        <p className="text-sm text-[#007b88] text-center">
          Drag tasks to the PlayGround panel
        </p>
      </div>
    </div>
  );
}

export default ToolBar;
