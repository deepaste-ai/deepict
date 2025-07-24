'use client';

import { useAppStore } from '@/stores/useAppStore';
import { Alert, Button, Group, Modal, Radio, Stack, Text, TextInput } from '@mantine/core';
import { IconAlertCircle, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useState } from 'react';

export default function Settings() {
  const { apiKey, groqApiKey, apiProvider, showSettings, setApiKey, setGroqApiKey, setApiProvider, setShowSettings } =
    useAppStore();
  const [tempApiKey, setTempApiKey] = useState(apiKey || '');
  const [tempGroqApiKey, setTempGroqApiKey] = useState(groqApiKey || '');
  const [tempApiProvider, setTempApiProvider] = useState(apiProvider);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showGroqApiKey, setShowGroqApiKey] = useState(false);

  const handleSave = () => {
    setApiKey(tempApiKey.trim() || null);
    setGroqApiKey(tempGroqApiKey.trim() || null);
    setApiProvider(tempApiProvider);
    setShowSettings(false);
  };

  const handleCancel = () => {
    setTempApiKey(apiKey || '');
    setTempGroqApiKey(groqApiKey || '');
    setTempApiProvider(apiProvider);
    setShowSettings(false);
  };

  const isValidApiKey = (key: string) => {
    return key.trim().length > 0 && key.startsWith('sk-');
  };

  const isValidGroqApiKey = (key: string) => {
    return key.trim().length > 0;
  };

  return (
    <Modal opened={showSettings} onClose={handleCancel} title='Settings' size='md' centered>
      <Stack gap='md'>
        <Text size='sm' c='dimmed'>
          Configure your API provider and credentials for AI-powered JSON visualization
        </Text>

        <Radio.Group
          value={tempApiProvider}
          onChange={(value) => setTempApiProvider(value as 'anthropic' | 'groq')}
          label='API Provider'
          description='Choose your preferred AI model provider'
        >
          <Group mt='xs'>
            <Radio value='anthropic' label='Anthropic (Claude)' />
            <Radio value='groq' label='Groq (Kimi-K2)' />
          </Group>
        </Radio.Group>

        {tempApiProvider === 'anthropic'
          ? (
            <TextInput
              label='Anthropic API Key'
              placeholder='sk-ant-...'
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              type={showApiKey ? 'text' : 'password'}
              rightSection={
                <Button variant='subtle' size='compact-xs' onClick={() => setShowApiKey(!showApiKey)}>
                  {showApiKey ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </Button>
              }
              error={tempApiKey && !isValidApiKey(tempApiKey) ? 'Invalid API key format' : null}
            />
          )
          : (
            <TextInput
              label='Groq API Key'
              placeholder='gsk_...'
              value={tempGroqApiKey}
              onChange={(e) => setTempGroqApiKey(e.target.value)}
              type={showGroqApiKey ? 'text' : 'password'}
              rightSection={
                <Button
                  variant='subtle'
                  size='compact-xs'
                  onClick={() => setShowGroqApiKey(!showGroqApiKey)}
                >
                  {showGroqApiKey ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </Button>
              }
              error={tempGroqApiKey && !isValidGroqApiKey(tempGroqApiKey) ? 'API key is required' : null}
            />
          )}

        <Alert icon={<IconAlertCircle size={16} />} title='Security Note' color='blue' variant='light'>
          <Text size='xs'>
            Your API key is stored locally in your browser and is never sent to any server except{' '}
            {tempApiProvider === 'anthropic' ? 'Anthropic' : 'Groq'}&apos;s API.
          </Text>
        </Alert>

        <Group justify='flex-end'>
          <Button variant='default' onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={(tempApiProvider === 'anthropic' && !!tempApiKey && !isValidApiKey(tempApiKey))
              || (tempApiProvider === 'groq' && !isValidGroqApiKey(tempGroqApiKey))}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
