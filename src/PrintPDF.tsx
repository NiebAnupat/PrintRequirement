import React, { useEffect } from "react";
import { Project, Task } from "./model";
import {
  Box,
  MantineProvider,
  Text,
  createStyles,
  useMantineColorScheme,
} from "@mantine/core";
import { useLocation, useNavigation } from "react-router-dom";
import { MyFontStyles, MyGlobalStyles } from "./MyGobal";
import useStyle from "./PrintPDF.style";
import "./PringPDF.css";

// interface Props {
//   state?: {
//     project: Project;
//     tasks: Task[];
//   };
// }

export const PrintPDF = () => {
  const { state } = useLocation();
  const { project, tasks }: { project: Project; tasks: Task[] } = state;

  const { classes } = useStyle();

  return (
    <>
      <Box >
        <Text>Project: {project.title}</Text>
        <Text>Tasks:</Text>
        {tasks.map((task) => (
          <Text key={task.id}>{task.title}</Text>
        ))}
      </Box>
    </>
  );
};

export default PrintPDF;
