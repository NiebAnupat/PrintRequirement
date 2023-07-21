import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Global,
  Grid,
  Group,
  Image,
  MantineProvider,
  Modal,
  Radio,
  Space,
  Switch,
  Table,
  Text,
  TextInput,
  Textarea,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Notifications, notifications as noti } from "@mantine/notifications";
import { ModalsProvider, modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { useDisclosure, useListState, useWindowScroll } from "@mantine/hooks";
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import Rows from "./components/Rows";
import { makeFlattenTasks, makeTaskData } from "./helper";
import { Project, Task, TaskData } from "./model";
import { IconCheck, IconMoonStars, IconSun } from "@tabler/icons-react";
import { Router, useNavigate } from "react-router-dom";
import { MyFontStyles, MyGlobalStyles } from "./MyGobal";

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
  const [accordionValue, setAccordionValue] = useState<string[]>([]);
  const [scroll, scrollTo] = useWindowScroll();
  const [opened, { open, close }] = useDisclosure(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const navigate = useNavigate();

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
      const tasksData = makeTaskData(list);
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

  const ProjectDetailForm = useForm<Project>({
    initialValues: {
      title: "",
      description: "",
      note: "",
      clientName: "",
      clientContact: "",
    },
    validate: {
      title: (value) => (value.length <= 0 ? "กรุณากรอกข้อมูล" : null),
      clientName: (value) => (value.length <= 0 ? "กรุณากรอกข้อมูล" : null),
      clientContact: (value) => (value.length <= 0 ? "กรุณากรอกข้อมูล" : null),
    },
  });

  const TaskForm = useForm<Task>({
    initialValues: {
      id: "",
      title: "",
      description: "",
      note: "",
      type: "task",
    },
    validate: {
      title: (value) => (value.length <= 0 ? "กรุณากรอกข้อมูล" : null),
      description: (value) => (value.length <= 0 ? "กรุณากรอกข้อมูล" : null),
      type: (value) => (value.length <= 0 ? "เลือกประเภท" : null),
    },
  });

  const EditTaskForm = useForm<Task>({
    initialValues: {
      id: "",
      title: "",
      description: "",
      note: "",
      type: "task",
    },
    validate: {
      title: (value) => (value.length <= 0 ? "กรุณากรอกข้อมูล" : null),
      description: (value) => (value.length <= 0 ? "กรุณากรอกข้อมูล" : null),
      type: (value) => (value.length <= 0 ? "เลือกประเภท" : null),
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
        noti.show({
          title: "เพิ่มรายการหลักสำเร็จ",
          message: `เพิ่มรายการ ${Task.title} สำเร็จ`,
          radius: "lg",
          color: "green",
          icon: <IconCheck />,
          autoClose: 2000,
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
      noti.show({
        title: "เพิ่มรายการหลักสำเร็จ",
        message: `เพิ่มรายการ ${Task.title} สำเร็จ`,
        radius: "lg",
        color: "green",
        icon: <IconCheck />,
        autoClose: 2000,
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
        TaskForm.reset();
        noti.show({
          title: "เพิ่มรายการย่อยสำเร็จ",
          message: `เพิ่มรายการ ${Task.title} สำเร็จ`,
          radius: "lg",
          color: "green",
          icon: <IconCheck />,
          autoClose: 2000,
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
      noti.show({
        title: "เพิ่มรายการย่อยสำเร็จ",
        message: `เพิ่มรายการ ${Task.title} สำเร็จ`,
        radius: "lg",
        color: "green",
        icon: <IconCheck />,
        autoClose: 2000,
      });
    }

    TaskForm.reset();
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
  const editTask = (newTask: Task): void => {
    const index = list.findIndex((task) => task.id === newTask.id);
    handlers.setItem(index, newTask);
    close();
  };

  const printRequirement = () => {
    if (ProjectDetailForm.validate().hasErrors) {
      !accordionValue.find((item) => item === "prjectInfo") &&
        setAccordionValue([...accordionValue, "prjectInfo"]);
      scrollTo({
        y: 0,
      });
      return;
    }
    if (list.length === 0) {
      noti.show({
        title: "ไม่สามารถพิมพ์ได้",
        message: "ไม่มีรายการที่จะพิมพ์",
        radius: "lg",
        color: "yellow.6",
        autoClose: 2000,
      });
      return;
    }

    navigate("/print", {
      replace: false,
      state: {
        project: ProjectDetailForm.values,
        tasks: list,
      },
    });

    noti.show({
      title: "พิมพ์ Requirement สำเร็จ",
      message: "ใบ Requirement ได้ถูกพิมพ์เรียบร้อยแล้ว",
      radius: "lg",
      color: "green",
      icon: <IconCheck />,
      autoClose: 2000,
    });
  };

  const editTaskModal = () => {
    return (
      <Modal
        opened={opened}
        onClose={close}
        title={`แก้ไขรายการ${
          EditTaskForm?.values.type === "task" ? "หลัก" : "ย่อย"
        } ลำดับ ${EditTaskForm?.values.id}`}
        centered
        radius={"lg"}
        padding={"1.5em"}
      >
        <Box>
          <form onSubmit={EditTaskForm.onSubmit((v) => editTask(v))}>
            <Flex direction={"column"} gap={"md"}>
              <TextInput
                label={"ชื่อรายการ"}
                withAsterisk
                {...EditTaskForm.getInputProps("title")}
              />
              <TextInput
                label={"รายละเอียด"}
                withAsterisk
                {...EditTaskForm.getInputProps("description")}
              />
              <TextInput
                label={"หมายเหตุ"}
                {...EditTaskForm.getInputProps("note")}
              />

              <Flex justify={"flex-end"}>
                <Button onClick={close} variant={"subtle"} color="red.7">
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  ml={"md"}
                  variant={"gradient"}
                  gradient={{ from: "violet.7.", to: "blue.4" }}
                >
                  บันทึก
                </Button>
              </Flex>
            </Flex>
          </form>
        </Box>
      </Modal>
    );
  };

  return (
    <>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: colorScheme,
          fontFamily: "Noto Sans Thai",
          primaryColor: "indigo",
        }}
      >
        <ModalsProvider>
          <Notifications />
          <MyFontStyles />
          <MyGlobalStyles />
          <Box p={"3em"}>
            {editTaskModal()}
            <Container size={"75%"}>
              <Flex w={"100%"} align="center" gap={"xl"}>
                <Image src={"catcode-logo.png"} width={100} radius={"xl"} />
                <Box>
                  <Text
                    fz={"2rem"}
                  
                  >
                    เว็บไซต์ออกใบ Requirement
                  </Text>
                  <Text fz={"1rem"} c={"dimmed"}>
                    By CatCode
                  </Text>
                </Box>
                <Group position="center" ml={"auto"}>
                  <Switch
                    checked={colorScheme === "dark"}
                    onChange={() => toggleColorScheme()}
                    size="lg"
                    onLabel={
                      <IconSun
                        color={theme.white}
                        size="1.25rem"
                        stroke={1.5}
                      />
                    }
                    offLabel={
                      <IconMoonStars
                        color={theme.colors.gray[6]}
                        size="1.25rem"
                        stroke={1.5}
                      />
                    }
                  />
                </Group>
              </Flex>
              <Divider my={"md"} />
              <Accordion
                variant="separated"
                radius="xl"
                my={"xl"}
                multiple
                value={accordionValue}
                onChange={setAccordionValue}
              >
                <Accordion.Item value="prjectInfo">
                  <Accordion.Control>ข้อมูลโปรเจค</Accordion.Control>
                  <Accordion.Panel p={"md"}>
                    <form>
                      <Grid>
                        <Grid.Col span={6}>
                          <TextInput
                            label={"ชื่อโปรเจค"}
                            withAsterisk
                            {...ProjectDetailForm.getInputProps("title")}
                          />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <TextInput
                            label={"ชื่อลูกค้า"}
                            withAsterisk
                            {...ProjectDetailForm.getInputProps("clientName")}
                          />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Textarea
                            label={"รายละเอียดโปรเจค"}
                            minRows={6}
                            autosize
                            {...ProjectDetailForm.getInputProps("description")}
                          />
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
                          <TextInput
                            label={"ช่องทางการติดต่อลูกค้า"}
                            withAsterisk
                            {...ProjectDetailForm.getInputProps(
                              "clientContact"
                            )}
                          />
                          <TextInput
                            label={"หมายเหตุ"}
                            {...ProjectDetailForm.getInputProps("note")}
                          />
                        </Grid.Col>
                      </Grid>
                    </form>
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
                      <th style={{ width: "5rem", textAlign: "center" }}>
                        จัดการ
                      </th>
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
                            key={task.id}
                            index={index}
                            task={task}
                            setEditTask={EditTaskForm.setValues}
                            removeTask={removeTask}
                            openModal={open}
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
                  variant="subtle"
                  color="red.7"
                  onClick={() => {
                    handlers.setState([]);
                  }}
                >
                  ลบข้อมูล
                </Button>
                <Button
                  disabled={list.length <= 0}
                  variant="gradient"
                  gradient={{
                    from: "red.4",
                    to: "violet.9",
                  }}
                  onClick={printRequirement}
                >
                  ออกใบ Requirement
                </Button>
              </Flex>
            </Container>
          </Box>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
};

export default App;
