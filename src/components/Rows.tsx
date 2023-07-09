import { ActionIcon, Flex, Text } from "@mantine/core";
import {
  IconGripVertical,
  IconEdit,
  IconTrashXFilled,
} from "@tabler/icons-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import {  Task } from "../model";

interface props extends Task {
  index: number;
  removeTask: (id: string, index: number) => void;
}
export default function Rows({
  id,
  title,
  description,
  note,
  type,
  index,
  removeTask,
}: props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });
  const style = {
    transform: CSS.Translate.toString(transform),
    backgroundColor: type === "subtask" ? "#2C2E33" : undefined,
    transition,
  };

  if (type === "task") {
    return (
      <>
        <tr key={id} ref={setNodeRef} style={style}>
          <td>
            <ActionIcon {...attributes} {...listeners}>
              <IconGripVertical size="1.5rem" stroke={1.5} />
            </ActionIcon>
          </td>
          <td>
            <Text weight={900} align={"center"} fz={".85rem"}>
              {id}
            </Text>
          </td>
          <td>
            <Text weight={900} fz={".85rem"}>
              {title}
            </Text>
          </td>
          <td>
            <Text weight={900} fz={".85rem"}>
              {description}
            </Text>
          </td>
          <td>
            <Text weight={900} fz={".85rem"}>
              {note}
            </Text>
          </td>
          <td>
            <Flex gap="md">
              <ActionIcon variant="transparent" color="green.6">
                <IconEdit />
              </ActionIcon>
              <ActionIcon
                variant="transparent"
                color="red.6"
                onClick={() => removeTask(id, index)}
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
      <tr key={id} ref={setNodeRef} style={style}>
        <td>
          <ActionIcon {...attributes} {...listeners}>
            <IconGripVertical size="1rem" stroke={1.5} />
          </ActionIcon>
        </td>
        <td>
          <Text weight={500} align={"center"} fz={".85rem"}>
            &emsp;{id}
          </Text>
        </td>
        <td>
          <Text weight={500} fz={".85rem"}>
            &emsp;{title}
          </Text>
        </td>
        <td>
          <Text weight={500} fz={".85rem"}>
            &emsp;{description}
          </Text>
        </td>
        <td>
          <Text weight={500} fz={".85rem"}>
            &emsp;{note}
          </Text>
        </td>
        <td>
          <Flex gap="md">
            <ActionIcon variant="transparent" color="green.4">
              <IconEdit />
            </ActionIcon>
            <ActionIcon
              variant="transparent"
              color="red.4"
              onClick={() => removeTask(id, index)}
            >
              <IconTrashXFilled />
            </ActionIcon>
          </Flex>
        </td>
      </tr>
    );
  }
}
