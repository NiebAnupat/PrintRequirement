import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {MantineProvider, Global} from '@mantine/core';
import './index.css'

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
    return (
        <Global
            styles={[
                {
                    "html, body": {
                        color: "white",
                    },
                },
            ]}
        />
    );
}


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme: "dark",
                fontFamily: "Noto Sans Thai",
                primaryColor: "indigo",
            }}
        >
            <MyFontStyles/>
            <MyGlobalStyles/>
            <App/>
        </MantineProvider>
    </React.StrictMode>,
)
