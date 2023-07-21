import { Global, useMantineColorScheme, useMantineTheme } from "@mantine/core";

function MyFontStyles() {
  return (
    <Global
      styles={[
        {
          "@font-face": {
            fontFamily: "Noto Sans Thai",
            src: `url("https://cdn.jsdelivr.net/gh/lazywasabi/thai-web-fonts@7/fonts/NotoSansThai/NotoSansThai-Regular.woff2") format("woff2")`,
            fontStyle: "normal",
            fontWeight: "normal",
            fontDisplay: "swap",
          },
        },
      ]}
    />
  );
}

function MyGlobalStyles() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  return (
    <Global
      styles={[
        {
          "html, body": {
            color:
              colorScheme == "light"
                ? theme.colors.dark[9]
                : theme.colors.gray[1],
          },
        },
      ]}
    />
  );
}

export { MyFontStyles, MyGlobalStyles };
