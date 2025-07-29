'use client';
import { useAppStore } from '@/stores/useAppStore';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';

interface DemoFile {
  name: string;
  displayName: string;
  description: string;
  type: 'json' | 'jsonl';
  icon: string;
  path: string;
  highlights: string[];
}

const demoFiles: DemoFile[] = [
  {
    name: 'large-metrics.json',
    displayName: 'ML Model Metrics',
    description: 'Large-scale machine learning model performance metrics including LLM judge scores, lexical metrics (F1, ROUGE, BLEU), semantic similarity, and context token statistics.',
    type: 'json',
    icon: 'icon-[mdi--chart-line]',
    path: '/demo-files/large-metrics.json',
    highlights: ['LLM Judge Score: 0.806', 'Lexical F1: 0.524', 'BERT F1: 0.474', '6795 Context Tokens']
  },
  {
    name: 'episode-list.jsonl',
    displayName: 'Conversation Episodes',
    description: 'Structured conversation data with multiple dialogue episodes, each containing metadata, timestamps, participant information, and detailed conversation content.',
    type: 'jsonl',
    icon: 'icon-[mdi--message-text]',
    path: '/demo-files/episode-list.jsonl',
    highlights: ['5 Episodes', 'Multi-participant conversations', 'Rich metadata', 'Timeline data']
  }
];

export function DemoFilesSection() {
  const { processFile } = useAppStore();

  const handleDemoFileLoad = async (demoFile: DemoFile) => {
    try {
      // Load the demo file content
      const response = await fetch(demoFile.path);
      if (!response.ok) {
        throw new Error('Failed to load demo file');
      }
      
      const content = await response.text();
      
      // Process the file using the same logic as file upload
      await processFile(content, demoFile.type, demoFile.name, content.length);
      
      notifications.show({
        title: 'Demo file loaded',
        message: `${demoFile.displayName} has been loaded successfully`,
        color: 'green',
      });
    } catch (error) {
      console.error('Error loading demo file:', error);
      notifications.show({
        title: 'Error loading demo file',
        message: 'Failed to load the demo file. Please try again.',
        color: 'red',
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Stack gap="lg">
        <div className="text-center">
          <Title order={3} className="mb-2">
            Try Demo Data
          </Title>
          <Text c="dimmed" size="sm">
            Explore Deepict with sample datasets to see how it visualizes different types of JSON data
          </Text>
        </div>
        
        <Group grow gap="lg">
          {demoFiles.map((demoFile) => (
            <Card
              key={demoFile.name}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              className="hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <Stack gap="md">
                <Group gap="sm">
                  <span className={`${demoFile.icon} w-8 h-8 text-blue-500 group-hover:text-blue-600 transition-colors`} />
                  <div>
                    <Text fw={600} size="lg">
                      {demoFile.displayName}
                    </Text>
                    <Text size="xs" c="dimmed" className="uppercase tracking-wider">
                      {demoFile.type.toUpperCase()} File
                    </Text>
                  </div>
                </Group>
                
                <Text size="sm" c="dimmed" className="leading-relaxed">
                  {demoFile.description}
                </Text>
                
                <div className="space-y-1">
                  <Text size="xs" fw={500} c="blue">
                    Key Features:
                  </Text>
                  <div className="flex flex-wrap gap-1">
                    {demoFile.highlights.map((highlight, index) => (
                      <Text
                        key={index}
                        size="xs"
                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                      >
                        {highlight}
                      </Text>
                    ))}
                  </div>
                </div>
                
                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  onClick={() => handleDemoFileLoad(demoFile)}
                  className="mt-2 group-hover:bg-blue-50 transition-colors"
                >
                  Load Demo Data
                </Button>
              </Stack>
            </Card>
          ))}
        </Group>
        
        <Text size="xs" c="dimmed" className="text-center">
          These demo files help you understand how Deepict handles different JSON structures and data types
        </Text>
      </Stack>
    </div>
  );
}