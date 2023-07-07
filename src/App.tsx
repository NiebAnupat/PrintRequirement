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
import { useEffect, useState } from "react";
import { useListState } from "@mantine/hooks";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { v4 } from "uuid";
import Rows from "./components/Rows";
import { makeFlattenTasks, makeTaskData } from "./helper";
import { Task, TaskData } from "./model";

const TestData: TaskData[] = [
  {
    id: "1",
    title: "Task 1",
    description: "Description 1",
    note: "Note 1",
    type: "task",
  },
  {
    id: "2",
    title: "Task 2",
    description: "Description 2",
    note: "Note 2",
    type: "task",
    subtasks: [
      {
        id: "2.1",
        title: "Subtask 2.1",
        description: "Description 2.1",
        note: "Note 2.1",
        type: "subtask",
      },
      {
        id: "2.2",
        title: "Subtask 2.2",
        description: "Description 2.2",
        note: "Note 2.2",
        type: "subtask",
      },
    ],
  },
  {
    id: "3",
    title: "Task 3",
    description: "Description 3",
    note: "Note 3",
    type: "task",
  },
];

const App = () => {
  const [list, handlers] = useListState<Task>([]);
  const [isChange, setIsChange] = useState(false);

  let tasksData = makeTaskData(list);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    handlers.setState(makeFlattenTasks(TestData));
  }, []);

  useEffect(() => {
    if (isChange) {
      tasksData = makeTaskData(list);
      tasksData.map((task, index) => {
        task.id = `${index + 1}`;
        if (task.subtasks) {
          task.subtasks.map((subtask, subtaskIndex) => {
            subtask.id = `${index + 1}.${subtaskIndex + 1}`;
          });
        }
      });
      const newTasks = makeFlattenTasks(tasksData);
      setIsChange(false);
      handlers.setState(newTasks);
    }
  }, [list]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = list.findIndex((item) => item.id === active.id);
      const newIndex = list.findIndex((item) => item.id === over?.id);
      if (
        (list[oldIndex].type === "subtask" && newIndex === 0) ||
        // (list[newIndex].type === "subtask" && oldIndex === 0) ||
        (list[oldIndex].type === "subtask" && newIndex === 0)
      ) {
        return;
      }

      const tempList = [...list];
      const [removed] = tempList.splice(oldIndex, 1);
      tempList.splice(newIndex, 0, removed);

      // check if first task is subtask
      if (tempList[0].type === "subtask") return;

      setIsChange(true);
      handlers.reorder({ from: oldIndex, to: newIndex });
    }
  };

  const TaskForm = useForm<Task>({
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

  const addTask = (Task: Task): void => {
    let newID = "";
    if (Task.type === "task") {
      if (list.length === 0) {
        newID = "1";
        handlers.append({
          id: newID,
          title: Task.title,
          description: Task.description,
          note: Task.note,
          type: "task",
        });
        return;
      }
      const beforeID = list[list.length - 1].id.split(".");
      newID = `${parseInt(beforeID[0]) + 1}`;
      handlers.append({
        id: newID,
        title: Task.title,
        description: Task.description,
        note: Task.note,
        type: "task",
      });
    } else {
      const beforeID = list[list.length - 1].id.split(".");
      // if is first subtask
      if (beforeID.length === 1) {
        handlers.append({
          id: `${beforeID[0]}.1`,
          title: Task.title,
          description: Task.description,
          note: Task.note,
          type: "subtask",
        });
        return;
      }
      newID = `${beforeID[0]}.${parseInt(beforeID[1]) + 1}`;
      handlers.append({
        id: newID,
        title: Task.title,
        description: Task.description,
        note: Task.note,
        type: "subtask",
      });
    }
  };

  const removeTask = (id: string, index: number): void => {
    if (list.length === 1) {
      handlers.filter((task) => task.id !== id);
      setIsChange(true);
      return;
    }
    if (index === 0 && list[index + 1].type === "subtask") {
      console.log("not allow remove first task");
      return;
    }
    handlers.filter((task) => task.id !== id);
    setIsChange(true);
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
                    onSubmit={TaskForm.onSubmit((values) => {
                      addTask(values);
                    })}
                  >
                    <TextInput
                      label={"ชื่องาน"}
                      withAsterisk
                      {...TaskForm.getInputProps("title")}
                    />
                    <TextInput
                      label={"รายละเอียด"}
                      withAsterisk
                      {...TaskForm.getInputProps("description")}
                    />
                    <TextInput
                      label={"หมายเหตุ"}
                      {...TaskForm.getInputProps("note")}
                    />
                    <Flex>
                      <Radio.Group
                        label={"ประเภทงาน"}
                        description={"เลือกประเภทงานที่ต้องการ"}
                        name={"taskType"}
                        withAsterisk
                        sx={{ flexGrow: 1 }}
                        {...TaskForm.getInputProps("type")}
                      >
                        <Group mt={"xs"}>
                          <Radio label={"หัวข้อหลัก"} value={"task"} />
                          <Radio
                            label={"หัวข้อย่อย"}
                            value={"subtask"}
                            disabled={list.length == 0}
                          />
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
            autoScroll={true}
          >
            <Table>
              <thead>
                <tr>
                  <th style={{ width: "1rem" }}></th>
                  <th style={{ width: "2rem", textAlign: "center" }}>
                    หมายเลข
                  </th>
                  <th style={{ textAlign: "start" }}>หัวข้อ</th>
                  <th>รายละเอียด</th>
                  <th style={{ width: "9rem" }}>หมายเหตุ</th>
                  <th style={{ width: "5rem", textAlign: "center" }}>จัดการ</th>
                </tr>
              </thead>
              {list.length > 0 ? (
                <tbody>
                  <SortableContext
                    items={list}
                    strategy={verticalListSortingStrategy}
                  >
                    {list.map((task, index) => (
                      <Rows
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        note={task.note}
                        type={task.type}
                        index={index}
                        removeTask={removeTask}
                        key={task.id}
                      />
                    ))}
                  </SortableContext>
                </tbody>
              ) : (
                <tfoot>
                  <tr>
                    <td colSpan={6} align="center">
                      <Text fz={"1rem"} m={"xl"}>
                        ไม่พบข้อมูลขอบเขตงาน
                      </Text>
                    </td>
                  </tr>
                </tfoot>
              )}
            </Table>
          </DndContext>

          <Space h={"2em"} />
          <Flex justify={"flex-end"} gap={"xl"}>
            <Button
              disabled={list.length <= 0}
              color="red"
              onClick={() => {
                handlers.setState([]);
              }}
            >
              ลบข้อมูล
            </Button>
            <Button disabled={list.length <= 0}>ออกใบ Requirement</Button>
          </Flex>
        </Container>
      </Box>
    </>
  );
};

export default App;
