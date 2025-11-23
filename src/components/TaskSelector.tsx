import type { TaskSelectorProps } from "../utils/interfaces";

function TaskSelector({ sprites }: TaskSelectorProps) {
  const containerWidth = 600;
  const containerHeight = 400;

  return (
    <div className="h-full p-6 bg-white">
      <div className="bg-white rounded-xl shadow-lg border border-[#007b88] p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#007b88]">
            Animation Preview
          </h3>
          <div className="text-sm text-gray-600">
            {sprites.length} sprite{sprites.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div
          className="relative border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 overflow-hidden mb-4"
          style={{
            width: "100%",
            height: "400px",
            minHeight: "400px",
          }}
        >
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: Math.ceil(containerWidth / 50) }).map(
              (_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute top-0 bottom-0 border-l border-gray-300"
                  style={{ left: `${i * 50}px` }}
                ></div>
              )
            )}
            {Array.from({ length: Math.ceil(containerHeight / 50) }).map(
              (_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute left-0 right-0 border-t border-gray-300"
                  style={{ top: `${i * 50}px` }}
                ></div>
              )
            )}
          </div>

          {sprites.map((sprite) => (
            <div
              key={sprite.id}
              className="absolute w-16 h-16 transition-all duration-100 ease-linear"
              style={{
                left: `${sprite.x}px`,
                top: `${sprite.y}px`,
                transform: `rotate(${sprite.rotation}deg)`,
                zIndex: sprite.isAnimating ? 10 : 1,
              }}
            >
              <div className="relative">
                {sprite.isAnimating && (
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed opacity-40"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderColor:
                        sprite.collisionCooldown > 0 ? "#ef4444" : sprite.color,
                    }}
                  ></div>
                )}

                <div
                  className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent absolute top-1 left-4 z-20"
                  style={{ borderBottomColor: sprite.color }}
                ></div>
                <div
                  className="w-8 h-8 rounded-full absolute top-5 left-4 border-2 border-white shadow-lg z-10"
                  style={{ backgroundColor: sprite.color }}
                ></div>

                <div className="absolute -top-8 left-0 right-0 text-center">
                  <span
                    className="text-xs font-medium text-white px-2 py-1 rounded shadow-lg whitespace-nowrap"
                    style={{ backgroundColor: sprite.color }}
                  >
                    {sprite.name}
                    {sprite.isAnimating && " ⚡"}
                    {sprite.collisionCooldown > 0 && " 🔄"}
                  </span>
                </div>

                {sprite.speechBubble && (
                  <div
                    className={`absolute -top-24 left-8 z-30 max-w-xs ${
                      sprite.speechBubble.type === "think"
                        ? "think-bubble"
                        : "speech-bubble"
                    }`}
                    style={{ zIndex: 30 }}
                  >
                    <div className="text-sm font-medium">
                      {sprite.speechBubble.text}
                    </div>
                    <div
                      className={`absolute bottom-0 left-4 transform translate-y-1 ${
                        sprite.speechBubble.type === "think"
                          ? "think-pointer"
                          : "speech-pointer"
                      }`}
                      style={{
                        borderTopColor:
                          sprite.speechBubble.type === "think"
                            ? "#8b5cf6"
                            : "#3b82f6",
                      }}
                    ></div>
                  </div>
                )}

                {sprite.isAnimating && sprite.tasks.length > 0 && (
                  <div className="absolute -bottom-12 left-0 right-0">
                    <div
                      className="text-white text-xs px-2 py-1 rounded text-center shadow-lg whitespace-nowrap mx-auto max-w-24"
                      style={{ backgroundColor: sprite.color }}
                    >
                      Task {sprite.currentTaskIndex + 1}/{sprite.tasks.length}
                    </div>
                    {/* Progress bar */}
                    {sprite.tasks[sprite.currentTaskIndex] && (
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="h-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: sprite.color,
                            width: `${
                              (sprite.tasks[sprite.currentTaskIndex].progress ||
                                0) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {sprites.map((spriteA, indexA) =>
            sprites.map((spriteB, indexB) => {
              if (indexA >= indexB) return null;

              const distance = Math.sqrt(
                Math.pow(spriteA.x - spriteB.x, 2) +
                  Math.pow(spriteA.y - spriteB.y, 2)
              );

              if (distance < 100) {
                const isColliding = distance < 40;
                return (
                  <svg
                    key={`line-${spriteA.id}-${spriteB.id}`}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 5 }}
                  >
                    <line
                      x1={spriteA.x + 8}
                      y1={spriteA.y + 8}
                      x2={spriteB.x + 8}
                      y2={spriteB.y + 8}
                      stroke={isColliding ? "#ef4444" : "#f59e0b"}
                      strokeWidth={isColliding ? 3 : 2}
                      strokeDasharray={isColliding ? "none" : "5,5"}
                    />
                    {isColliding && (
                      <text
                        x={(spriteA.x + spriteB.x) / 2}
                        y={(spriteA.y + spriteB.y) / 2 - 8}
                        textAnchor="middle"
                        fill="#ef4444"
                        fontSize="10"
                        fontWeight="bold"
                        className="font-sans"
                      >
                        SWAPPED!
                      </text>
                    )}
                  </svg>
                );
              }
              return null;
            })
          )}
        </div>

        <div className="flex-1 overflow-y-scroll">
          <h4 className="font-semibold text-gray-800 mb-3">
            Sprites Information
          </h4>
          <div className="space-y-3">
            {sprites.map((sprite) => (
              <div
                key={sprite.id}
                className="p-3 rounded-lg border-2 transition-colors"
                style={{
                  borderColor: sprite.color,
                  backgroundColor: `${sprite.color}10`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: sprite.color }}
                    ></div>
                    <span className="font-semibold text-gray-800">
                      {sprite.name}
                    </span>
                    {sprite.isAnimating ? (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                        Running
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">
                        Idle
                      </span>
                    )}
                    {sprite.collisionCooldown > 0 && (
                      <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded">
                        Cooldown
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    {sprite.tasks.length} task
                    {sprite.tasks.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                  <div>
                    <span className="text-gray-600">Position: </span>
                    <span className="font-mono text-xs">
                      ({Math.round(sprite.x)}, {Math.round(sprite.y)})
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Rotation: </span>
                    <span className="font-mono text-xs">
                      {Math.round(sprite.rotation)}°
                    </span>
                  </div>
                </div>

                {sprite.isAnimating &&
                  sprite.tasks[sprite.currentTaskIndex] && (
                    <div className="mt-2 p-2 bg-white rounded border">
                      <div className="text-xs text-gray-600">Current Task:</div>
                      <div className="text-sm font-medium capitalize">
                        {sprite.tasks[sprite.currentTaskIndex].type}
                        {sprite.tasks[sprite.currentTaskIndex].progress && (
                          <span className="text-gray-500 ml-2">
                            (
                            {Math.round(
                              sprite.tasks[sprite.currentTaskIndex].progress *
                                100
                            )}
                            %)
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                {sprite.tasks.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-600 mb-1">
                      Task Queue:
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {sprite.tasks
                        .slice(0, 6)
                        .map((task: any, index: number) => (
                          <div
                            key={task.id}
                            className={`text-xs px-2 py-1 rounded capitalize ${
                              index === sprite.currentTaskIndex &&
                              sprite.isAnimating
                                ? "bg-green-500 text-white"
                                : index < sprite.currentTaskIndex
                                ? "bg-gray-300 text-gray-600 line-through"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {task.type}
                          </div>
                        ))}
                      {sprite.tasks.length > 6 && (
                        <div className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-500">
                          +{sprite.tasks.length - 6}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskSelector;
