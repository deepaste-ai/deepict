'use client';
import { useAppStore } from '@/stores/useAppStore';
import { CodeHighlight } from '@mantine/code-highlight';
import { Group, Paper, ScrollArea, Tabs, Text } from '@mantine/core';
import { JsonViewer as TexteaJsonViewer } from '@textea/json-viewer';
import { useEffect, useRef, useState } from 'react';
import { DemoFilesSection } from './DemoFilesSection';

export function JsonViewer() {
  const { getCurrentJson, isFileUploading, jsonHTMLComponent } = useAppStore();
  const [activeTab, setActiveTab] = useState<string>('preview');
  const prevJsonHTMLComponent = useRef<string | null>(null);

  const currentJson = getCurrentJson();

  // Auto-select visualization tab when jsonHTMLComponent changes from null to a value
  useEffect(() => {
    if (jsonHTMLComponent && !prevJsonHTMLComponent.current) {
      // jsonHTMLComponent changed from null to a value
      setActiveTab('visualization');
    } else if (!jsonHTMLComponent && activeTab === 'visualization') {
      // jsonHTMLComponent changed from a value to null
      setActiveTab('preview');
    }
    prevJsonHTMLComponent.current = jsonHTMLComponent;
  }, [jsonHTMLComponent, activeTab, prevJsonHTMLComponent]);

  // Initialize active tab when jsonHTMLComponent becomes available for the first time
  useEffect(() => {
    if (jsonHTMLComponent && !prevJsonHTMLComponent.current && activeTab === 'preview') {
      setActiveTab('visualization');
    }
  }, [jsonHTMLComponent, activeTab]); // Only switch on first appearance

  if (!currentJson) {
    return (
      <Paper withBorder className='h-full flex-1 flex flex-col shadow-sm overflow-hidden'>
        {isFileUploading ? (
          <div className='h-full flex items-center justify-center'>
            <div className='text-center p-8'>
              <span className='icon-[mdi--loading] w-16 h-16 text-blue-500 mx-auto mb-6 block animate-spin' />
              <Text size='lg' fw={500} c='blue' className='mb-2'>
                Processing file...
              </Text>
              <Text size='sm' c='dimmed'>
                Please wait while we parse your data
              </Text>
            </div>
          </div>
        ) : (
          <ScrollArea className='h-full'>
            <div className='p-8'>
              <div className='text-center mb-8'>
                <span className='icon-[mdi--code-json] w-16 h-16 text-gray-400 mx-auto mb-6 block' />
                <Text size='lg' fw={500} c='dimmed' className='mb-2'>
                  No JSON data selected
                </Text>
                <Text size='sm' c='dimmed' className='max-w-md mx-auto leading-relaxed mb-8'>
                  Drag and drop JSON or JSONL files here to get started, or try one of our demo datasets below
                </Text>
              </div>
              
              <DemoFilesSection />
            </div>
          </ScrollArea>
        )}
      </Paper>
    );
  }

  return (
    <Paper withBorder className='h-full flex-1 flex flex-col w-full shadow-sm'>
      <div className='p-4 border-b bg-gray-50'>
        <Group>
          <span className='icon-[mdi--code-json] w-4 h-4 text-green-600' />
          <Text fw={500} size='sm'>
            Deepict Viewer
          </Text>
        </Group>
      </div>

      <div className='flex-1 w-full overflow-hidden'>
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'preview')} className='h-full flex flex-col'>
          <Tabs.List className='px-4 pt-3 pb-1 bg-white border-b border-gray-100'>
            {jsonHTMLComponent && (
              <Tabs.Tab
                value='visualization'
                leftSection={<span className='icon-[mdi--chart-line] w-4 h-4' />}
                className='text-sm'
              >
                Visualization
              </Tabs.Tab>
            )}
            <Tabs.Tab value='preview' leftSection={<span className='icon-[mdi--eye] w-4 h-4' />} className='text-sm'>
              Preview
            </Tabs.Tab>
            <Tabs.Tab value='code' leftSection={<span className='icon-[mdi--code-json] w-4 h-4' />} className='text-sm'>
              Raw JSON
            </Tabs.Tab>
          </Tabs.List>

          {jsonHTMLComponent && (
            <Tabs.Panel value='visualization' className='flex-1 overflow-hidden'>
              <div className='h-full w-full'>
                <iframe
                  srcDoc={jsonHTMLComponent.replace('{†RENDER_JSON†}', JSON.stringify(currentJson.data, null, 2))}
                  className='w-full h-full border-0'
                  sandbox='allow-scripts'
                  title='JSON Visualization'
                />
              </div>
            </Tabs.Panel>
          )}

          <Tabs.Panel value='preview' className='flex-1 overflow-hidden'>
            <ScrollArea className='h-full' scrollbarSize={6}>
              <div className='p-5'>
                <div className='bg-gray-50 rounded-lg p-4 border'>
                  <TexteaJsonViewer
                    value={currentJson.data}
                    theme='light'
                    displayDataTypes={false}
                    enableClipboard={false}
                    rootName={false}
                    quotesOnKeys={false}
                    defaultInspectDepth={2}
                    style={{
                      backgroundColor: 'transparent',
                      fontSize: '14px',
                      lineHeight: '1.5',
                    }}
                  />
                </div>
              </div>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value='code' className='flex-1 overflow-hidden'>
            <ScrollArea className='h-full' scrollbarSize={6}>
              <div className='p-5'>
                <CodeHighlight
                  code={JSON.stringify(currentJson.data, null, 2)}
                  language='json'
                  radius='md'
                  className='shadow-sm'
                  style={{
                    width: '100%',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    fontSize: '13px',
                    lineHeight: '1.5',
                  }}
                />
              </div>
            </ScrollArea>
          </Tabs.Panel>
        </Tabs>
      </div>
    </Paper>
  );
}
