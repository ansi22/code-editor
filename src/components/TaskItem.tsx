const TaskItem = ({
  task,
  index,
  onRemove,
  onUpdate,
  isGlobalPool,
  spriteName,
}: any) => {
  const renderTaskParameters = () => {
    switch (task.type) {
      case "move":
        return (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">steps:</span>
            <input
              type="number"
              value={task.steps ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  onUpdate({ steps: 0 });
                  return;
                }
                onUpdate({ steps: Number(value) });
              }}
              className="w-12 px-1 py-0.5 border border-gray-300 rounded text-xs"
              min="1"
            />
          </div>
        );

      case "turn":
        return (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">degrees:</span>
            <input
              type="number"
              value={task.degrees ?? ""}
              onChange={(e: any) => {
                const value = e.target.value;
                if (value === "") {
                  onUpdate({ degrees: 0 });
                  return;
                }
                onUpdate({ degrees: parseInt(e.target.value) });
              }}
              className="w-12 px-1 py-0.5 border border-gray-300 rounded text-xs"
              min="-360"
              max="360"
            />
          </div>
        );

      case "goto":
        return (
          <div className="flex gap-2 mt-1">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">x:</span>
              <input
                type="number"
                value={task.x ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    onUpdate({ x: 0 });
                    return;
                  }
                  onUpdate({ x: parseInt(e.target.value) || 0 });
                }}
                className="w-12 px-1 py-0.5 border border-gray-300 rounded text-xs"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">y:</span>
              <input
                type="number"
                value={task.y ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    onUpdate({ y: 0 });
                    return;
                  }
                  onUpdate({ y: parseInt(e.target.value) });
                }}
                className="w-12 px-1 py-0.5 border border-gray-300 rounded text-xs"
              />
            </div>
          </div>
        );

      case "say":
        return (
          <div className="mt-1">
            <input
              type="text"
              value={task.message ?? ""}
              onChange={(e) => onUpdate({ message: e.target.value })}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              placeholder="Message..."
            />
          </div>
        );

      case "think":
        return (
          <div className="mt-1">
            <input
              type="text"
              value={task.message ?? ""}
              onChange={(e) => onUpdate({ message: e.target.value })}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              placeholder="Thought..."
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "move":
        return "→";
      case "turn":
        return "↻";
      case "goto":
        return "⌖";
      case "say":
        return "💬";
      case "think":
        return "💭";
      default:
        return "•";
    }
  };

  return (
    <div className="p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 flex-1">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">{getTaskIcon(task.type)}</span>
            <span className="text-xs text-blue-600 font-medium bg-blue-100 px-1.5 py-0.5 rounded">
              {index + 1}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-800 font-medium text-sm capitalize">
                {task.type}
              </span>
              {!isGlobalPool && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {spriteName}
                </span>
              )}
            </div>
            {renderTaskParameters()}
          </div>
        </div>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 text-sm p-1 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
          title={
            isGlobalPool ? "Remove from pool" : `Remove from ${spriteName}`
          }
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
