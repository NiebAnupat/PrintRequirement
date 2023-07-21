import {
  ActionIcon,
  Flex,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconGripVertical,
  IconEdit,
  IconTrashXFilled,
} from "@tabler/icons-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Task } from "../model";

interface props {
  index: number;
  removeTask: (id: string, index: number) => void;
  task: Task;
  setEditTask: (task: Task) => void;
  openModal: () => void;
}
export default function Rows({
  index,
  task,
  removeTask,
  setEditTask,
  openModal,
}: props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const style = {
    transform: CSS.Translate.toString(transform),
    backgroundColor:
      task.type === "subtask"
        ? colorScheme == "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[2]
        : undefined,
    transition,
  };

  if (task.type === "task") {
    return (
      <>
        <tr key={task.id} ref={setNodeRef} style={style}>
          <td>
            <ActionIcon {...attributes} {...listeners}>
              <IconGripVertical size="1.5rem" stroke={1.5} />
            </ActionIcon>
          </td>
          <td>
            <Text weight={900} align={"center"} fz={".85rem"}>
              {task.id}
            </Text>
          </td>
          <td>
            <Text weight={900} fz={".85rem"}>
              {task.title}
            </Text>
          </td>
          <td>
            <Text weight={900} fz={".85rem"}>
              {task.description}
            </Text>
          </td>
          <td>
            <Text weight={900} fz={".85rem"}>
              {task.note}
            </Text>
          </td>
          <td>
            <Flex gap="md">
              <ActionIcon
                variant="transparent"
                color="green.6"
                onClick={() => {
                  setEditTask(task);
                  openModal();
                }}
              >
                <IconEdit />
              </ActionIcon>
              <ActionIcon
                variant="transparent"
                color="red.6"
                onClick={() => removeTask(task.id, index)}
              >
                <IconTrashXFilled />
              </ActionIcon>
            </Flex>
          </td>
        </tr>
      </>
    );
  } else {
    return (
      <tr key={task.id} ref={setNodeRef} style={style}>
        <td>
          <ActionIcon {...attributes} {...listeners}>
            <IconGripVertical size="1rem" stroke={1.5} />
          </ActionIcon>
        </td>
        <td>
          <Text weight={500} align={"center"} fz={".85rem"}>
            &emsp;{task.id}
          </Text>
        </td>
        <td>
          <Text weight={500} fz={".85rem"}>
            &emsp;{task.title}
          </Text>
        </td>
        <td>
          <Text weight={500} fz={".85rem"}>
            &emsp;{task.description}
          </Text>
        </td>
        <td>
          <Text weight={500} fz={".85rem"}>
            &emsp;{task.note}
          </Text>
        </td>
        <td>
          <Flex gap="md">
            <ActionIcon
              variant="transparent"
              color="green.6"
              onClick={() => {
                setEditTask(task);
                openModal();
              }}
            >
              <IconEdit />
            </ActionIcon>
            <ActionIcon
              variant="transparent"
              color="red.6"
              onClick={() => removeTask(task.id, index)}
            >
              <IconTrashXFilled />
            </ActionIcon>
          </Flex>
        </td>
      </tr>
    );
  }
}
