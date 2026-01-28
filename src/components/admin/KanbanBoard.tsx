import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { KanbanColumn } from './KanbanColumn';
import { KanbanTaskCard } from './KanbanTaskCard';
import { KANBAN_COLUMNS, TASK_STATUSES, type TaskStatus, type ProjectTask } from '@/types/projects';

interface KanbanBoardProps {
  board: Record<TaskStatus, ProjectTask[]>;
  onReorder: (taskId: string, newStatus: TaskStatus, newPosition: number) => void;
  onTaskClick: (task: ProjectTask) => void;
  onAddTask: (status: TaskStatus) => void;
}

export function KanbanBoard({ board, onReorder, onTaskClick, onAddTask }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<ProjectTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as string;
    for (const status of KANBAN_COLUMNS) {
      const task = board[status].find((t) => t.id === taskId);
      if (task) {
        setActiveTask(task);
        break;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Determine the target column
    let targetStatus: TaskStatus | undefined;

    // Check if dropped on a column
    if (KANBAN_COLUMNS.includes(overId as TaskStatus)) {
      targetStatus = overId as TaskStatus;
    } else {
      // Dropped on a task, find which column it's in
      for (const status of KANBAN_COLUMNS) {
        if (board[status].find((t) => t.id === overId)) {
          targetStatus = status;
          break;
        }
      }
    }

    if (!targetStatus) return;

    const targetTasks = board[targetStatus];
    const newPosition = targetTasks.length;

    onReorder(taskId, targetStatus, newPosition);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((status) => {
          const statusInfo = TASK_STATUSES.find((s) => s.value === status);
          return (
            <KanbanColumn
              key={status}
              id={status}
              title={statusInfo?.label || status}
              tasks={board[status]}
              onTaskClick={onTaskClick}
              onAddTask={() => onAddTask(status)}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-80">
            <KanbanTaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
