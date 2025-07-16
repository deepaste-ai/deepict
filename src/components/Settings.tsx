"use client";

import { useAppStore } from "@/stores/useAppStore";
import { Alert, Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { IconAlertCircle, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";

export default function Settings() {
  const { apiKey, showSettings, setApiKey, setShowSettings } = useAppStore();
  const [tempApiKey, setTempApiKey] = useState(apiKey || "");
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    setApiKey(tempApiKey.trim() || null);
    setShowSettings(false);
  };

  const handleCancel = () => {
    setTempApiKey(apiKey || "");
    setShowSettings(false);
  };

  const isValidApiKey = (key: string) => {
    return key.trim().length > 0 && key.startsWith("sk-");
  };

  return (
    <Modal
      opened={showSettings}
      onClose={handleCancel}
      title="Settings"
      size="md"
      centered
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Configure your Anthropic API key to enable AI-powered JSON visualization
        </Text>

        <TextInput
          label="Anthropic API Key"
          placeholder="sk-ant-..."
          value={tempApiKey}
          onChange={(e) => setTempApiKey(e.target.value)}
          type={showApiKey ? "text" : "password"}
          rightSection={
            <Button
              variant="subtle"
              size="compact-xs"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <IconEyeOff size={16} /> : <IconEye size={16} />}
            </Button>
          }
          error={tempApiKey && !isValidApiKey(tempApiKey) ? "Invalid API key format" : null}
        />

        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Security Note"
          color="blue"
          variant="light"
        >
          <Text size="xs">
            Your API key is stored locally in your browser and is never sent to any server except Anthropic&apos;s API.
          </Text>
        </Alert>

        <Group justify="flex-end">
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!!tempApiKey && !isValidApiKey(tempApiKey)}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
