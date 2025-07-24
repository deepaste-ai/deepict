'use client';
import { useAppStore } from '@/stores/useAppStore';
import { Group, Paper, ScrollArea, Text, UnstyledButton } from '@mantine/core';

export function JsonList() {
  const { dataType, currentJsonId, setCurrentJsonId, getFilteredJsonData } = useAppStore();

  const jsonData = getFilteredJsonData();

  if (dataType !== 'jsonl' || jsonData.length === 0) {
    return null;
  }

  const getPreviewText = (data: unknown) => {
    if (typeof data === 'string') {
      return data.substring(0, 100) + (data.length > 100 ? '...' : '');
    }

    if (typeof data === 'object' && data !== null) {
      const keys = Object.keys(data);
      if (keys.length > 0) {
        return `{${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''}}`;
      }
    }

    return JSON.stringify(data).substring(0, 100);
  };

  return (
    <Paper withBorder className="h-full w-80 flex-shrink-0 mr-4 shadow-sm">
      <div className="p-4 border-b bg-gray-50">
        <Group>
          <span className="icon-[mdi--file-code] w-4 h-4 text-blue-600" />
          <Text fw={500} size="sm" c="dark">
            JSON Lines ({jsonData.length})
          </Text>
        </Group>
      </div>

      <ScrollArea className="h-[calc(100%-60px)]" scrollbarSize={6}>
        <div className="p-3">
          {jsonData.map((item, index) => (
            <UnstyledButton
              key={item.id}
              onClick={() => setCurrentJsonId(item.id)}
              className={`w-full p-3 rounded-lg mb-2 transition-all duration-200 ${
                currentJsonId === item.id
                  ? 'bg-blue-50 border-blue-200 border shadow-sm'
                  : 'hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <Group align="flex-start" wrap="nowrap" gap="sm">
                <span
                  className={`icon-[mdi--file-document] w-4 h-4 mt-1 flex-shrink-0 ${
                    currentJsonId === item.id ? 'text-blue-600' : 'text-gray-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <Group justify="space-between" className="mb-1">
                    <Text size="sm" fw={500} className="truncate" c={currentJsonId === item.id ? 'blue' : 'dark'}>
                      Item {index + 1}
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed" className="line-clamp-2 leading-relaxed">
                    {getPreviewText(item.data)}
                  </Text>
                </div>
              </Group>
            </UnstyledButton>
          ))}
        </div>
      </ScrollArea>
    </Paper>
  );
}
