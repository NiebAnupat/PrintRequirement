import {
  UseListState,
  UseListStateHandlers,
} from "@mantine/hooks/lib/use-list-state/use-list-state";
import { Task, TaskData, TaskType } from "./model";

const makeTaskData = (tasks: Task[]): TaskData[] => {
  const taskData: TaskData[] = [];
  let lastParentIndex = 0;
  const newList = [...tasks];

  for (let i = 0; i < newList.length; i++) {
    const task: TaskData = newList[i];
    if (task.type === "task") {
      const { subtasks, ...rest } = task;
      taskData.push(rest);

      lastParentIndex = taskData.length - 1;
    } else if (task.type === "subtask") {
      const parent: TaskData = taskData[lastParentIndex];
      if (parent.subtasks === undefined) {
        parent.subtasks = [] as TaskData[];
      }
      parent.subtasks.push(task);
    }
  }
  return taskData;
};
const makeFlattenTasks = (tasks: TaskData[]): Task[] => {
  const flattenedTasks: Task[] = [];
  const newList = JSON.parse(JSON.stringify(tasks));
  [...newList].forEach((task: TaskData) => {
    flattenedTasks.push(task);
    if (task.subtasks) {
      task.subtasks.forEach((subtask: Task) => {
        flattenedTasks.push(subtask);
      });
    }
  });

  return flattenedTasks;
};

export { makeTaskData, makeFlattenTasks };
