import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Radio,
  Space,
  Table,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconEdit,
  IconGripVertical,
  IconTrashXFilled,
} from "@tabler/icons-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";
import { useListState } from "@mantine/hooks";
import testData from "./assets/testData.json";

interface Task {
  id: string;
  title: string;
  description: string;
  note: string;
  subtasks?: Task[];
}

type TaskType = "task" | "subtask";

interface newTask extends Task {
  type: TaskType;
}

const App = () => {
  const [taskList, setTaskList] = useState<Task[]>(testData);
  const [list, handlers] = useListState(taskList);

  const newTaskForm = useForm<newTask>({
    initialValues: {
      id: "",
      title: "",
      description: "",
      note: "",
      type: "task",
    },
    validate: {
      title: (value) => {
        return value.length <= 0 ?? "กรุณากรอกข้อมูล";
      },
      description: (value) => {
        return value.length <= 0 ?? "กรุณากรอกข้อมูล";
      },
      type: (value) => {
        return value.length <= 0 ?? "กรุณาเลือกประเภท";
      },
    },
  });

  const addTask = (newTask: newTask): void => {
    let newID = "";
    if (newTask.type === "task") {
      // If list is empty or newTask.type is "task", add as a top-level task
      newID = `${parseInt(list[list.length - 1].id) + 1}`;
      handlers.append({
        id: newID,
        title: newTask.title,
        description: newTask.description,
        note: newTask.note,
      });
    } else {
      // If newTask.type is "subtask", add as a subtask of the last task
      // Otherwise, add as a subtask to the last task in the list
      newID = `${list.length}.${
        (list[list.length - 1].subtasks?.length ?? 0) + 1
      }`;
      handlers.setItemProp(list.length - 1, "subtasks", [
        ...(list[list.length - 1].subtasks ?? []),
        {
          id: newID,
          title: newTask.title,
          description: newTask.description,
          note: newTask.note,
        },
      ]);
    }
  };

  const renderTask = (task: Task, index: number) => {
    const subtask = task.subtasks?.map((subtask, index) => {
      return (
        <tr key={subtask.id}>
          <td>
            <ActionIcon>
              <IconGripVertical size="1.05rem" stroke={1.5} />
            </ActionIcon>
          </td>
          <td>
            <Text weight={500} align={"center"}>
              {subtask.id}
            </Text>
          </td>
          <td>
            <Text weight={500}>{subtask.title}</Text>
          </td>
          <td>
            <Text weight={500}>{subtask.description}</Text>
          </td>
          <td>
            <Text weight={500}>{subtask.note}</Text>
          </td>
          <td>
            <Flex gap="md">
              <ActionIcon variant="transparent" color="green.4">
                <IconEdit />
              </ActionIcon>
              <ActionIcon variant="transparent" color="red.4">
                <IconTrashXFilled />
              </ActionIcon>
            </Flex>
          </td>
        </tr>
      );
    });

    return (
      <>
        <tr key={task.id}>
          <td>
            <ActionIcon>
              <IconGripVertical size="1.05rem" stroke={1.5} />
            </ActionIcon>
          </td>
          <td>
            <Text weight={900} align={"center"}>
              {task.id}
            </Text>
          </td>
          <td>
            <Text weight={900}>{task.title}</Text>
          </td>
          <td>
            <Text weight={900}>{task.description}</Text>
          </td>
          <td>
            <Text weight={900}>{task.note}</Text>
          </td>
          <td>
            <Flex gap="md">
              <ActionIcon variant="transparent" color="green.6">
                <IconEdit />
              </ActionIcon>
              <ActionIcon variant="transparent" color="red.6">
                <IconTrashXFilled />
              </ActionIcon>
            </Flex>
          </td>
        </tr>
        {subtask}
      </>
    );
  };

  return (
    <>
      <Box p={"3em"}>
        <Container>
          <Flex w={"100%"} align="center" gap={"xl"}>
            <Image src={"catcode-logo.png"} width={100} radius={"xl"} />
            <Box>
              <Text fz={"2rem"}>เว็บไซต์ออกใบ Requirement</Text>
              <Text fz={"1rem"} c={"dimmed"}>
                By CatCode
              </Text>
            </Box>
          </Flex>
          <Divider my={"md"} />

          <Accordion
            variant="separated"
            radius="xl"
            defaultValue="prjectInfo"
            my={"xl"}
          >
            <Accordion.Item value="prjectInfo">
              <Accordion.Control>ข้อมูลโปรเจค</Accordion.Control>
              <Accordion.Panel p={"md"}>
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput label={"ชื่อโปรเจค"} withAsterisk />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput label={"ชื่อลูกค้า"} withAsterisk />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Textarea label={"รายละเอียดโปรเจค"} minRows={6} autosize />
                  </Grid.Col>
                  <Grid.Col
                    span={6}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: "1em",
                    }}
                  >
                    <TextInput label={"ช่องทางการติดต่อลูกค้า"} withAsterisk />
                    <TextInput label={"หมายเหตุ"} />
                  </Grid.Col>
                </Grid>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="addTask">
              <Accordion.Control>เพิ่มงาน</Accordion.Control>
              <Accordion.Panel p={"md"}>
                <Flex direction="column" gap="lg">
                  <form
                    onSubmit={newTaskForm.onSubmit((values) => {
                      addTask(values);
                    })}
                  >
                    <TextInput
                      label={"ชื่องาน"}
                      withAsterisk
                      {...newTaskForm.getInputProps("title")}
                    />
                    <TextInput
                      label={"รายละเอียด"}
                      withAsterisk
                      {...newTaskForm.getInputProps("description")}
                    />
                    <TextInput
                      label={"หมายเหตุ"}
                      {...newTaskForm.getInputProps("note")}
                    />
                    <Flex>
                      <Radio.Group
                        label={"ประเภทงาน"}
                        description={"เลือกประเภทงานที่ต้องการ"}
                        name={"taskType"}
                        withAsterisk
                        sx={{ flexGrow: 1 }}
                        {...newTaskForm.getInputProps("type")}
                      >
                        <Group mt={"xs"}>
                          <Radio label={"หัวข้อหลัก"} value={"task"} />
                          <Radio label={"หัวข้อย่อย"} value={"subtask"} />
                        </Group>
                      </Radio.Group>
                      <Box
                        display={"flex"}
                        mt={"auto"}
                        sx={{ justifyContent: "flex-end" }}
                      >
                        <Button
                          w={"15em"}
                          variant="gradient"
                          gradient={{
                            from: "indigo.9",
                            to: "red.4",
                          }}
                          type={"submit"}
                        >
                          เพิ่มงาน
                        </Button>
                      </Box>
                    </Flex>
                  </form>
                </Flex>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>

          <Space h={"2em"} />

          {/* TOR(Table of requirement) */}
          <Text fz={"1.5rem"} align={"center"}>
            ตารางขอบเขตงาน
          </Text>
          <Table>
            <thead>
              <tr>
                <th style={{ width: "1rem" }}></th>
                <th style={{ width: "2rem", textAlign: "center" }}>หมายเลข</th>
                <th>หัวข้อ</th>
                <th>รายละเอียด</th>
                <th>หมายเหตุ</th>
                <th>จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {list ? list.map((task, index) => renderTask(task, index)) : null}
            </tbody>
          </Table>

          <Space h={"2em"} />
          <Flex justify={"flex-end"}>
            <Button>ออกใบ Requirement</Button>
          </Flex>
        </Container>
      </Box>
    </>
  );
};

export default App;
