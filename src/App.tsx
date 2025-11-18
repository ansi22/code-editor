import { useState, useRef } from "react";

import PlayGround from "./components/PlayGround";

import TaskSelector from "./components/TaskSelector";
import ToolBar from "./components/ToolBar";
import type { Sprite } from "./utils/interfaces";

function App() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [sprites, setSprites] = useState<Sprite[]>([
    {
      id: "sprite-1",
      name: "Sprite 1",
      x: 100,
      y: 100,
      rotation: 0,
      isAnimating: false,
      color: "#3b82f6",
      tasks: [],
      currentTaskIndex: 0,
      speechBubble: null,
      collisionCooldown: 0,
    },
    {
      id: "sprite-2",
      name: "Sprite 2",
      x: 300,
      y: 300,
      rotation: 90,
      isAnimating: false,
      color: "#ef4444",
      tasks: [],
      currentTaskIndex: 0,
      speechBubble: null,
      collisionCooldown: 0,
    },
  ]);

  const [collisionHistory, setCollisionHistory] = useState<
    { spriteA: string; spriteB: string; timestamp: number }[]
  >([]);
  const animationRef = useRef<any>(null);

  const clearSelectedItems = () => {
    setTasks([]);
  };

  const removeSelectedItem = (id: string) => {
    setTasks((prev: any) => prev.filter((item: any) => item.id !== id));
  };

  // Generate unique sprite ID
  const generateSpriteId = () => {
    return `sprite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Generate unique task ID
  const generateTaskId = () => {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Assign tasks from pool to specific sprite
  const assignTasksToSprite = (spriteId: string) => {
    if (tasks.length === 0) return;

    setSprites((prev) =>
      prev.map((sprite) =>
        sprite.id === spriteId
          ? {
              ...sprite,
              tasks: [
                ...sprite.tasks, // Keep existing tasks
                ...tasks.map((task) => ({
                  // Create independent copy for this sprite
                  ...task,
                  id: generateTaskId(),
                  progress: 0,
                  startTime: undefined,
                })),
              ],
              currentTaskIndex: 0,
            }
          : sprite
      )
    );

    // Clear the task pool after assignment
    setTasks([]);
  };

  // Remove a specific task from a sprite
  const removeTaskFromSprite = (spriteId: string, taskId: string) => {
    setSprites((prev) =>
      prev.map((sprite) =>
        sprite.id === spriteId
          ? {
              ...sprite,
              tasks: sprite.tasks.filter((task) => task.id !== taskId),
              currentTaskIndex: Math.min(
                sprite.currentTaskIndex,
                sprite.tasks.length - 2
              ),
            }
          : sprite
      )
    );
  };

  // Update a task parameter for a specific sprite
  const updateSpriteTask = (
    spriteId: string,
    taskId: string,
    newParams: any
  ) => {
    setSprites((prev) =>
      prev.map((sprite) =>
        sprite.id === spriteId
          ? {
              ...sprite,
              tasks: sprite.tasks.map((task) =>
                task.id === taskId ? { ...task, ...newParams } : task
              ),
            }
          : sprite
      )
    );
  };

  // Clear all tasks from a specific sprite
  const clearSpriteTasks = (spriteId: string) => {
    setSprites((prev) =>
      prev.map((sprite) =>
        sprite.id === spriteId
          ? { ...sprite, tasks: [], currentTaskIndex: 0 }
          : sprite
      )
    );
  };

  // Execute all animations for all sprites
  const executeAllAnimations = async () => {
    const spritesWithTasks = sprites.filter(
      (sprite) => sprite.tasks.length > 0
    );
    if (spritesWithTasks.length === 0) return;

    setSprites((prev) =>
      prev.map((sprite) =>
        sprite.tasks.length > 0
          ? {
              ...sprite,
              isAnimating: true,
              currentTaskIndex: 0,
              speechBubble: null,
              collisionCooldown: 0,
              tasks: sprite.tasks.map((task) => ({
                ...task,
                progress: 0,
                startTime: undefined,
              })),
            }
          : sprite
      )
    );

    animationRef.current = requestAnimationFrame(animateAllSprites);
  };

  const animateAllSprites = () => {
    setSprites((prevSprites) => {
      let updatedSprites = [...prevSprites];
      let anySpriteAnimating = false;

      // Update collision cooldown
      updatedSprites = updatedSprites.map((sprite) => ({
        ...sprite,
        collisionCooldown: Math.max(0, sprite.collisionCooldown - 1),
      }));

      // Update each sprite's animation
      updatedSprites.forEach((sprite, index) => {
        if (
          !sprite.isAnimating ||
          sprite.currentTaskIndex >= sprite.tasks.length
        ) {
          if (sprite.isAnimating) {
            updatedSprites[index] = { ...sprite, isAnimating: false };
          }
          return;
        }

        anySpriteAnimating = true;
        const currentTask = sprite.tasks[sprite.currentTaskIndex];
        const updatedSprite = executeSpriteTask(sprite, currentTask);

        if (isTaskCompleted(currentTask)) {
          updatedSprites[index] = {
            ...updatedSprite,
            currentTaskIndex: updatedSprite.currentTaskIndex + 1,
          };
        } else {
          updatedSprites[index] = updatedSprite;
        }
      });

      // Check for collisions between animated sprites
      updatedSprites = checkCollisions(updatedSprites);

      if (anySpriteAnimating) {
        animationRef.current = requestAnimationFrame(animateAllSprites);
      }

      return updatedSprites;
    });
  };

  // Execute animation for specific sprite
  const executeSpriteAnimation = (spriteId: string) => {
    setSprites((prev) =>
      prev.map((sprite) => {
        if (
          sprite.id === spriteId &&
          sprite.tasks.length > 0 &&
          !sprite.isAnimating
        ) {
          return {
            ...sprite,
            isAnimating: true,
            currentTaskIndex: 0,
            speechBubble: null,
            collisionCooldown: 0,
            tasks: sprite.tasks.map((task) => ({
              ...task,
              progress: 0,
              startTime: undefined,
            })),
          };
        }
        return sprite;
      })
    );

    animationRef.current = requestAnimationFrame(() =>
      animateSingleSprite(spriteId)
    );
  };

  const animateSingleSprite = (spriteId: string) => {
    setSprites((prevSprites) => {
      let updatedSprites = [...prevSprites];
      const spriteIndex = updatedSprites.findIndex((s) => s.id === spriteId);

      if (spriteIndex === -1 || !updatedSprites[spriteIndex].isAnimating) {
        return prevSprites;
      }

      const sprite = updatedSprites[spriteIndex];

      if (sprite.currentTaskIndex >= sprite.tasks.length) {
        updatedSprites[spriteIndex] = { ...sprite, isAnimating: false };
        return updatedSprites;
      }

      // Update collision cooldown
      updatedSprites[spriteIndex] = {
        ...sprite,
        collisionCooldown: Math.max(0, sprite.collisionCooldown - 1),
      };

      const currentTask = sprite.tasks[sprite.currentTaskIndex];
      const updatedSprite = executeSpriteTask(
        updatedSprites[spriteIndex],
        currentTask
      );

      if (isTaskCompleted(currentTask)) {
        updatedSprites[spriteIndex] = {
          ...updatedSprite,
          currentTaskIndex: updatedSprite.currentTaskIndex + 1,
        };
      } else {
        updatedSprites[spriteIndex] = updatedSprite;
      }

      // Check for collisions with other animated sprites
      updatedSprites = checkCollisions(updatedSprites);

      if (updatedSprites[spriteIndex].isAnimating) {
        animationRef.current = requestAnimationFrame(() =>
          animateSingleSprite(spriteId)
        );
      }

      return updatedSprites;
    });
  };

  const executeSpriteTask = (sprite: Sprite, task: any): Sprite => {
    switch (task.type) {
      case "move":
        return executeMove(sprite, task);
      case "turn":
        return executeTurn(sprite, task);
      case "goto":
        return executeGoto(sprite, task);
      case "say":
        return executeSay(sprite, task);
      case "think":
        return executeThink(sprite, task);
      default:
        return sprite;
    }
  };

  const executeMove = (sprite: Sprite, task: any): Sprite => {
    const steps = task.steps || 50;
    const progress = task.progress || 0;
    const newProgress = Math.min(progress + 0.02, 1);

    const radians = (sprite.rotation * Math.PI) / 180;
    const startX = sprite.x;
    const startY = sprite.y;
    const targetX = startX + Math.sin(radians) * steps * newProgress;
    const targetY = startY - Math.cos(radians) * steps * newProgress;

    return {
      ...sprite,
      x: targetX,
      y: targetY,
      tasks: sprite.tasks.map((t) =>
        t.id === task.id ? { ...t, progress: newProgress } : t
      ),
    };
  };

  const executeTurn = (sprite: Sprite, task: any): Sprite => {
    const degrees = task.degrees || 90;
    const progress = task.progress || 0;
    const newProgress = Math.min(progress + 0.02, 1);
    const currentRotation = sprite.rotation + degrees * newProgress;

    return {
      ...sprite,
      rotation: currentRotation,
      tasks: sprite.tasks.map((t) =>
        t.id === task.id ? { ...t, progress: newProgress } : t
      ),
    };
  };

  const executeGoto = (sprite: Sprite, task: any): Sprite => {
    const targetX = task.x || sprite.x;
    const targetY = task.y || sprite.y;
    const progress = task.progress || 0;
    const newProgress = Math.min(progress + 0.02, 1);

    const currentX = sprite.x + (targetX - sprite.x) * newProgress;
    const currentY = sprite.y + (targetY - sprite.y) * newProgress;

    return {
      ...sprite,
      x: currentX,
      y: currentY,
      tasks: sprite.tasks.map((t) =>
        t.id === task.id ? { ...t, progress: newProgress } : t
      ),
    };
  };

  const executeSay = (sprite: Sprite, task: any): Sprite => {
    const message = task.message || "Hello!";
    const duration = 2000;

    if (!task.startTime) {
      return {
        ...sprite,
        speechBubble: { type: "say", text: message },
        tasks: sprite.tasks.map((t) =>
          t.id === task.id ? { ...t, startTime: Date.now(), duration } : t
        ),
      };
    }

    const elapsed = Date.now() - task.startTime;
    if (elapsed >= duration) {
      return {
        ...sprite,
        speechBubble: null,
        tasks: sprite.tasks.map((t) =>
          t.id === task.id ? { ...t, progress: 1 } : t
        ),
      };
    }

    return sprite;
  };

  const executeThink = (sprite: Sprite, task: any): Sprite => {
    const message = task.message || "Hmm...";
    const duration = 2000;

    if (!task.startTime) {
      return {
        ...sprite,
        speechBubble: { type: "think", text: message },
        tasks: sprite.tasks.map((t) =>
          t.id === task.id ? { ...t, startTime: Date.now(), duration } : t
        ),
      };
    }

    const elapsed = Date.now() - task.startTime;
    if (elapsed >= duration) {
      return {
        ...sprite,
        speechBubble: null,
        tasks: sprite.tasks.map((t) =>
          t.id === task.id ? { ...t, progress: 1 } : t
        ),
      };
    }

    return sprite;
  };

  const isTaskCompleted = (task: any): boolean => {
    return task.progress >= 1;
  };

  const checkCollisions = (sprites: Sprite[]): Sprite[] => {
    const updatedSprites = [...sprites];
    const animatedSprites = updatedSprites.filter(
      (sprite) => sprite.isAnimating
    );

    for (let i = 0; i < animatedSprites.length; i++) {
      for (let j = i + 1; j < animatedSprites.length; j++) {
        const spriteA = animatedSprites[i];
        const spriteB = animatedSprites[j];

        // Skip if either sprite is in collision cooldown
        if (spriteA.collisionCooldown > 0 || spriteB.collisionCooldown > 0) {
          continue;
        }

        const distance = Math.sqrt(
          Math.pow(spriteA.x - spriteB.x, 2) +
            Math.pow(spriteA.y - spriteB.y, 2)
        );

        // Collision detection (40px threshold)
        if (distance < 40) {
          const indexA = updatedSprites.findIndex((s) => s.id === spriteA.id);
          const indexB = updatedSprites.findIndex((s) => s.id === spriteB.id);

          if (indexA !== -1 && indexB !== -1) {
            console.log(
              `🚨 COLLISION: ${spriteA.name} and ${spriteB.name} swapped tasks!`
            );

            // Swap tasks between sprites
            const tempTasks = [...updatedSprites[indexA].tasks];
            const tempCurrentIndex = updatedSprites[indexA].currentTaskIndex;

            updatedSprites[indexA] = {
              ...updatedSprites[indexA],
              tasks: [...updatedSprites[indexB].tasks],
              currentTaskIndex: updatedSprites[indexB].currentTaskIndex,
              collisionCooldown: 30,
            };

            updatedSprites[indexB] = {
              ...updatedSprites[indexB],
              tasks: tempTasks,
              currentTaskIndex: tempCurrentIndex,
              collisionCooldown: 30,
            };

            // Add to collision history
            setCollisionHistory((prev) =>
              [
                ...prev,
                {
                  spriteA: spriteA.name,
                  spriteB: spriteB.name,
                  timestamp: Date.now(),
                },
              ].slice(-10)
            );
          }
        }
      }
    }

    return updatedSprites;
  };

  const stopAllAnimations = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setSprites((prev) =>
      prev.map((sprite) => ({
        ...sprite,
        isAnimating: false,
        speechBubble: null,
        collisionCooldown: 0,
      }))
    );
  };

  const stopSpriteAnimation = (spriteId: string) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setSprites((prev) =>
      prev.map((sprite) =>
        sprite.id === spriteId
          ? {
              ...sprite,
              isAnimating: false,
              speechBubble: null,
              collisionCooldown: 0,
            }
          : sprite
      )
    );
  };

  const addSprite = () => {
    const newId = generateSpriteId();
    const newSprite: Sprite = {
      id: newId,
      name: `Sprite ${sprites.length + 1}`,
      x: Math.random() * 400 + 50,
      y: Math.random() * 400 + 50,
      rotation: Math.random() * 360,
      isAnimating: false,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      tasks: [],
      currentTaskIndex: 0,
      speechBubble: null,
      collisionCooldown: 0,
    };
    setSprites((prev) => [...prev, newSprite]);
  };

  const removeSprite = (spriteId: string) => {
    if (sprites.length > 1) {
      setSprites((prev) => prev.filter((sprite) => sprite.id !== spriteId));
    }
  };

  return (
    <div className="bg-[#f5fcff] h-screen flex justify-between w-full">
      <div className="w-[20%] h-screen">
        <ToolBar />
      </div>
      <div className="w-[35%] h-screen">
        <PlayGround
          tasks={tasks}
          clearSelectedItems={clearSelectedItems}
          removeSelectedItem={removeSelectedItem}
          setTasks={setTasks}
          sprites={sprites}
          onExecuteAll={executeAllAnimations}
          onExecuteSprite={executeSpriteAnimation}
          onStopAll={stopAllAnimations}
          onStopSprite={stopSpriteAnimation}
          onAssignTasks={assignTasksToSprite}
          onRemoveTaskFromSprite={removeTaskFromSprite}
          onUpdateSpriteTask={updateSpriteTask}
          onClearSpriteTasks={clearSpriteTasks}
          onAddSprite={addSprite}
          onRemoveSprite={removeSprite}
          collisionHistory={collisionHistory}
        />
      </div>
      <div className="w-[45%] h-screen">
        <TaskSelector sprites={sprites} />
      </div>
    </div>
  );
}

export default App;
