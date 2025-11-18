const SpriteManagement = ({
  sprites,
  selectedSprite,
  onSelectSprite,
  onExecuteSprite,
  onStopSprite,
  onClearSpriteTasks,
  onRemoveSprite,
  isAnySpriteAnimating,
}: any) => {
  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
        {sprites.map((sprite: any) => (
          <div
            key={sprite.id}
            className={`p-3 rounded-xl border transition-all cursor-pointer group ${
              selectedSprite === sprite.id
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => onSelectSprite(sprite.id)}
          >
            {/* Sprite Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: sprite.color }}
                ></div>
                <span className="font-medium text-gray-800 text-sm">
                  {sprite.name}
                </span>
                {sprite.isAnimating && (
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {sprites.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSprite(sprite.id);
                    }}
                    className="w-5 h-5 flex items-center justify-center text-red-500 hover:bg-red-100 rounded text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Sprite Info */}
            <div className="flex justify-between text-xs text-gray-500 mb-3">
              <span>{sprite.tasks.length} tasks</span>
              <span>
                ({Math.round(sprite.x)}, {Math.round(sprite.y)})
              </span>
            </div>

            {/* Controls */}
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExecuteSprite(sprite.id);
                }}
                disabled={sprite.isAnimating || sprite.tasks.length === 0}
                className={`flex-1 py-1 px-2 rounded text-xs transition-colors ${
                  sprite.isAnimating || sprite.tasks.length === 0
                    ? "bg-gray-100 cursor-not-allowed text-gray-400"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {sprite.isAnimating ? "Running" : "Run"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStopSprite(sprite.id);
                }}
                disabled={!sprite.isAnimating}
                className={`py-1 px-2 rounded text-xs transition-colors ${
                  !sprite.isAnimating
                    ? "bg-gray-100 cursor-not-allowed text-gray-400"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                Stop
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClearSpriteTasks(sprite.id);
                }}
                disabled={sprite.isAnimating}
                className={`py-1 px-2 rounded text-xs transition-colors ${
                  sprite.isAnimating
                    ? "bg-gray-100 cursor-not-allowed text-gray-400"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                Clear
              </button>
            </div>

            {/* Task Progress */}
            {sprite.isAnimating && sprite.tasks[sprite.currentTaskIndex] && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span className="capitalize">
                    {sprite.tasks[sprite.currentTaskIndex].type}
                  </span>
                  <span>
                    {Math.round(
                      sprite.tasks[sprite.currentTaskIndex].progress * 100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className="h-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: sprite.color,
                      width: `${
                        (sprite.tasks[sprite.currentTaskIndex].progress || 0) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {sprites.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500">
          <div className="text-4xl mb-3">🎭</div>
          <h3 className="font-medium mb-1">No Sprites</h3>
          <p className="text-sm">Add a sprite to get started</p>
        </div>
      )}
    </div>
  );
};

export default SpriteManagement;
