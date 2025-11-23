import TaskItem from "./TaskItem";

const TaskManagement = ({
  tasks,
  selectedSprite,
  selectedSpriteData,
  onAssignTasks,
  onRemoveTaskFromSprite,
  onUpdateSpriteTask,
  onClearTasks,
  onRemoveTask,
  onUpdateTask,
  isAnySpriteAnimating,
}: any) => {
  if (!selectedSprite) {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 text-sm">
            Please select a sprite from the "Sprites" tab to manage its tasks.
          </p>
        </div>

        <div className="flex-1 min-h-0">
          {tasks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
              <div className="text-4xl mb-3">📥</div>
              <h3 className="font-medium mb-1">No Tasks in Pool</h3>
              <p className="text-sm">
                Drag tasks from the toolbar to add to the pool
              </p>
            </div>
          ) : (
            <div
              className="space-y-2 overflow-y-scroll pr-1 pb-20"
              style={{ height: "400px" }}
            >
              {tasks.map((task: any, index: number) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  onRemove={() => onRemoveTask(task.id)}
                  onUpdate={(newParams: any) =>
                    onUpdateTask(task.id, newParams)
                  }
                  isGlobalPool={true}
                />
              ))}
            </div>
          )}
        </div>

        {tasks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={onClearTasks}
              className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-sm"
            >
              Clear All Tasks from Pool ({tasks.length})
            </button>
          </div>
        )}
      </div>
    );
  }

  const spriteTasks = selectedSpriteData?.tasks || [];

  return (
    <div className="h-full flex flex-col">
      {tasks.length > 0 && (
        <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 text-sm font-medium">
                Assign {tasks.length} tasks from pool to{" "}
                <strong>{selectedSpriteData?.name}</strong>
              </p>
              <p className="text-purple-600 text-xs mt-1">
                These tasks will be added to {selectedSpriteData?.name}'s task
                list
              </p>
            </div>
            <button
              onClick={() => onAssignTasks(selectedSprite)}
              disabled={isAnySpriteAnimating}
              className={`px-4 py-2 rounded text-sm font-medium ${
                isAnySpriteAnimating
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-purple-500 hover:bg-purple-600 text-white"
              }`}
            >
              Assign Tasks
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col">
        {spriteTasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="font-medium mb-1">No Tasks Assigned</h3>
            <p className="text-sm">
              {selectedSpriteData?.name} doesn't have any tasks yet.
              {tasks.length > 0
                ? " Assign tasks from the pool above."
                : " Add tasks to the pool first."}
            </p>
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto pr-1 pb-20 h-[400px]">
            {spriteTasks.map((task: any, index: any) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                onRemove={() => onRemoveTaskFromSprite(selectedSprite, task.id)}
                onUpdate={(newParams: any) =>
                  onUpdateSpriteTask(selectedSprite, task.id, newParams)
                }
                isGlobalPool={false}
                spriteName={selectedSpriteData?.name}
              />
            ))}
          </div>
        )}
      </div>

      {spriteTasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => onClearTasks(selectedSprite)}
            disabled={isAnySpriteAnimating}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors text-sm ${
              isAnySpriteAnimating
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            Clear All Tasks from {selectedSpriteData?.name} (
            {spriteTasks.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
