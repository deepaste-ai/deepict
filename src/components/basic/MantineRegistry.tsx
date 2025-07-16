"use client";
import { CodeHighlightAdapterProvider, createShikiAdapter } from "@mantine/code-highlight";
import { MantineProvider } from "@mantine/core";
import { emotionTransform, MantineEmotionProvider } from "@mantine/emotion";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { bundledLanguages, createHighlighter } from "shiki";
import { RootStyleRegistry } from "./EmotionRootStyleRegistry";

async function loadShiki() {
  const shiki = await createHighlighter({
    langs: Object.keys(bundledLanguages),
    themes: [],
  });

  return shiki;
}

const shikiAdapter = createShikiAdapter(loadShiki);

function MantineRegistry({ children }: { children: React.ReactNode }) {
  return (
    <RootStyleRegistry>
      <MantineEmotionProvider>
        <MantineProvider stylesTransform={emotionTransform}>
          <CodeHighlightAdapterProvider adapter={shikiAdapter}>
            <Notifications />
            <ModalsProvider>{children}</ModalsProvider>
          </CodeHighlightAdapterProvider>
        </MantineProvider>
      </MantineEmotionProvider>
    </RootStyleRegistry>
  );
}

export default MantineRegistry;
