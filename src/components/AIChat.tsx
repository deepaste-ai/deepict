'use client';
import { useAppStore } from '@/stores/useAppStore';
import { CodeHighlight } from '@mantine/code-highlight';
import { ActionIcon, Avatar, Button, FileButton, Group, Paper, ScrollArea, Text, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconSettings } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import Settings from './Settings';

export function AIChat() {
  const {
    chatMessages,
    isAIProcessing,
    addChatMessage,
    clearChatHistory,
    isFileUploading,
    processFile,
    generateHTMLComponent,
    apiKey,
    groqApiKey,
    apiProvider,
    setShowSettings,
    loadSettings,
  } = useAppStore();

  const [inputValue, setInputValue] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Check if current API provider has a valid API key
  const hasValidApiKey = apiProvider === 'anthropic' ? !!apiKey : !!groqApiKey;

  useEffect(() => {
    loadSettings();
    // Mark as initialized after loading settings
    setTimeout(() => setHasInitialized(true), 500);
  }, [loadSettings]);

  useEffect(() => {
    // Auto-open settings if no API key is configured after initialization
    if (hasInitialized && !hasValidApiKey && !isFileUploading && !isAIProcessing) {
      setShowSettings(true);
    }
  }, [hasInitialized, hasValidApiKey, isFileUploading, isAIProcessing, setShowSettings]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatMessages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isAIProcessing || isFileUploading) return;

    if (!hasValidApiKey) {
      setShowSettings(true);
      return;
    }

    addChatMessage({
      role: 'user',
      content: inputValue,
    });

    const userInput = inputValue;
    setInputValue('');

    // Generate HTML component using the SSE service
    await generateHTMLComponent(userInput);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;

    console.log('File upload clicked:', {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeKB: (file.size / 1024).toFixed(1)
    });

    const fileName = file.name.toLowerCase();
    const isJsonl = fileName.endsWith('.jsonl');
    const isJson = fileName.endsWith('.json');

    if (!isJsonl && !isJson) {
      // You can add notification here if needed
      return;
    }

    // Check file size limits
    const MAX_JSON_SIZE = 256 * 1024; // 256KB
    
    console.log('File size check (click upload):', {
      isJson,
      fileSize: file.size,
      maxSize: MAX_JSON_SIZE,
      exceedsLimit: isJson && file.size > MAX_JSON_SIZE
    });
    
    if (isJson && file.size > MAX_JSON_SIZE) {
      notifications.show({
        title: 'File too large',
        message: `JSON files larger than 256KB are not supported yet. Your file is ${(file.size / 1024).toFixed(1)}KB.`,
        color: 'red',
      });
      return;
    }

    try {
      const text = await file.text();
      
      // For JSONL files, check if total size exceeds 256KB per line
      if (isJsonl) {
        const lines = text.split('\n').filter(line => line.trim());
        const lineCount = lines.length;
        const maxTotalSize = MAX_JSON_SIZE * lineCount;
        
        if (file.size > maxTotalSize) {
          notifications.show({
            title: 'File too large',
            message: `JSONL files exceeding 256KB per line are not supported yet. Your file would need to be under ${(maxTotalSize / 1024 / 1024).toFixed(1)}MB for ${lineCount} lines.`,
            color: 'red',
          });
          return;
        }
      }
      
      await processFile(text, isJsonl ? 'jsonl' : 'json', file.name, file.size);
    } catch (error) {
      console.error('Error processing file:', error);
    }
  };

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting for code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = content.split(codeBlockRegex);

    return parts.map((part, index) => {
      if (index % 3 === 2) {
        // This is code content
        const language = parts[index - 1] || 'text';
        return (
          <CodeHighlight
            key={index}
            code={part}
            language={language}
            radius='md'
            className='my-2'
            style={{
              fontSize: '12px',
              maxWidth: '100%',
              overflow: 'hidden',
            }}
          />
        );
      } else if (index % 3 === 1) {
        // This is language identifier, skip
        return null;
      } else {
        // This is regular text
        return part
          ? (
            <Text
              key={index}
              size='sm'
              className='whitespace-pre-wrap break-words leading-relaxed'
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            >
              {part}
            </Text>
          )
          : null;
      }
    });
  };

  return (
    <Paper withBorder className='h-full w-80 flex-shrink-0 flex flex-col shadow-sm'>
      <div className='p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50'>
        <Group justify='space-between'>
          <Group>
            <span className='icon-[mdi--robot] w-4 h-4 text-purple-600' />
            <Text fw={500} size='sm'>
              AI Assistant
            </Text>
          </Group>
          <Group gap='xs'>
            <ActionIcon
              size='sm'
              variant='light'
              color='gray'
              onClick={() => setShowSettings(true)}
              className='shadow-sm'
            >
              <IconSettings size={14} />
            </ActionIcon>
            {chatMessages.length > 0 && (
              <Button
                size='xs'
                variant='light'
                color='red'
                leftSection={<span className='icon-[mdi--trash-can] w-3.5 h-3.5' />}
                onClick={clearChatHistory}
                className='shadow-sm'
              >
                Clear
              </Button>
            )}
          </Group>
        </Group>
      </div>

      <ScrollArea ref={scrollAreaRef} className='flex-1 p-4' scrollbarSize={6}>
        {chatMessages.length === 0
          ? (
            <div className='text-center py-12'>
              <span className='icon-[mdi--robot] w-16 h-16 text-purple-300 mx-auto mb-6 block' />
              {!hasValidApiKey
                ? (
                  <div className='max-w-xs mx-auto'>
                    <Text size='sm' c='dimmed' className='leading-relaxed mb-3'>
                      Configure your {apiProvider === 'anthropic' ? 'Anthropic' : 'Groq'}{' '}
                      API key to start using the AI assistant!
                    </Text>
                    <Button
                      size='xs'
                      variant='light'
                      color='purple'
                      leftSection={<IconSettings size={14} />}
                      onClick={() => setShowSettings(true)}
                    >
                      Configure API Key
                    </Button>
                  </div>
                )
                : (
                  <Text size='sm' c='dimmed' className='max-w-xs mx-auto leading-relaxed'>
                    Ask me to visualize your JSON data or help with any questions!
                  </Text>
                )}
            </div>
          )
          : (
            <div className='space-y-3'>
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[280px] min-w-[120px] ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-white text-gray-900 shadow-md border'
                    } rounded-2xl px-4 py-3`}
                  >
                    <Group align='flex-start' wrap='nowrap' gap='xs'>
                      <Avatar
                        size='sm'
                        color={message.role === 'user' ? 'blue' : 'gray'}
                        className='flex-shrink-0'
                        variant={message.role === 'user' ? 'filled' : 'light'}
                      >
                        {message.role === 'user'
                          ? <span className='icon-[mdi--account] w-3.5 h-3.5' />
                          : <span className='icon-[mdi--robot] w-3.5 h-3.5' />}
                      </Avatar>
                      <div className='flex-1 min-w-0 overflow-hidden'>
                        <div className='mb-1 break-words'>{formatMessageContent(message.content)}</div>
                        <Text size='xs' c={message.role === 'user' ? 'white' : 'dimmed'} className='opacity-70'>
                          {message.timestamp.toLocaleTimeString()}
                        </Text>
                      </div>
                    </Group>
                  </div>
                </div>
              ))}
            </div>
          )}
      </ScrollArea>

      <div className='p-4 border-t bg-gray-50'>
        <div className='flex items-center gap-2 mb-3'>
          <FileButton onChange={handleFileUpload} accept='.json,.jsonl' disabled={isAIProcessing || isFileUploading}>
            {(props) => (
              <ActionIcon
                {...props}
                variant='light'
                color='purple'
                size='md'
                disabled={isAIProcessing || isFileUploading}
                className='shadow-sm hover:shadow-md transition-shadow'
              >
                <span className='icon-[mdi--paperclip] w-4 h-4' />
              </ActionIcon>
            )}
          </FileButton>
          <Text size='xs' c='dimmed'>
            Attach JSON/JSONL file
          </Text>
        </div>

        <TextInput
          placeholder='Ask me to visualize your JSON data...'
          value={inputValue}
          onChange={(event) => setInputValue(event.currentTarget.value)}
          onKeyDown={handleKeyPress}
          disabled={isAIProcessing || isFileUploading}
          rightSection={
            <ActionIcon
              variant='filled'
              color='purple'
              onClick={handleSend}
              disabled={!inputValue.trim() || isAIProcessing || isFileUploading}
              className='shadow-sm hover:shadow-md transition-shadow'
            >
              <span className='icon-[mdi--send] w-4 h-4' />
            </ActionIcon>
          }
          size='md'
          radius='lg'
        />
      </div>
      <Settings />
    </Paper>
  );
}
