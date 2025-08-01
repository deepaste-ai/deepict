'use client';
import { useAppStore } from '@/stores/useAppStore';
import { Text } from '@mantine/core';
import { Dropzone, DropzoneProps } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';

interface FileDropzoneProps extends Partial<DropzoneProps> {
  children: React.ReactNode;
}

export function FileDropzone({ children, ...props }: FileDropzoneProps) {
  const { processFile } = useAppStore();

  const handleDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    console.log('Dropped file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeKB: (file.size / 1024).toFixed(1)
    });

    // Check file type by extension (more reliable than MIME type)
    const fileName = file.name.toLowerCase();
    const isJsonl = fileName.endsWith('.jsonl');
    const isJson = fileName.endsWith('.json');

    if (!isJsonl && !isJson) {
      notifications.show({
        title: 'Invalid file type',
        message: 'Please upload a JSON or JSONL file',
        color: 'red',
      });
      return;
    }

    // Check file size limits
    const MAX_JSON_SIZE = 256 * 1024; // 256KB
    
    console.log('File size check:', {
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

      notifications.show({
        title: 'File processed successfully',
        message: `${file.name} has been loaded`,
        color: 'green',
      });
    } catch (error) {
      console.error('Error processing file:', error);
      notifications.show({
        title: 'Error processing file',
        message: 'Failed to parse the uploaded file. Please check the file format.',
        color: 'red',
      });
    }
  };

  return (
    <Dropzone
      onDrop={handleDrop}
      activateOnClick={false}
      activateOnKeyboard={false}
      styles={{
        root: {
          border: 'none',
          backgroundColor: 'transparent',
          padding: 0,
        },
        inner: {
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
        },
      }}
      {...props}
    >
      <Dropzone.Accept>
        <div className='fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-95 flex items-center justify-center z-50 border-2 border-dashed border-blue-400 backdrop-blur-sm'>
          <div className='text-center p-8 bg-white rounded-2xl shadow-xl border border-blue-200'>
            <span className='icon-[mdi--file-upload] w-20 h-20 text-blue-500 mx-auto mb-6 block animate-bounce' />
            <Text size='xl' fw={600} c='blue' className='mb-3'>
              Drop JSON or JSONL files here
            </Text>
            <Text size='sm' c='dimmed' className='max-w-xs mx-auto leading-relaxed'>
              Files will be automatically processed
            </Text>
          </div>
        </div>
      </Dropzone.Accept>

      <Dropzone.Reject>
        <div className='fixed inset-0 bg-gradient-to-br from-red-50 to-pink-50 bg-opacity-95 flex items-center justify-center z-50 border-2 border-dashed border-red-400 backdrop-blur-sm'>
          <div className='text-center p-8 bg-white rounded-2xl shadow-xl border border-red-200'>
            <span className='icon-[mdi--file-cancel] w-20 h-20 text-red-500 mx-auto mb-6 block animate-pulse' />
            <Text size='xl' fw={600} c='red' className='mb-3'>
              Invalid file type
            </Text>
            <Text size='sm' c='dimmed' className='max-w-xs mx-auto leading-relaxed'>
              Please upload JSON or JSONL files only
            </Text>
          </div>
        </div>
      </Dropzone.Reject>

      <Dropzone.Idle>{children}</Dropzone.Idle>
    </Dropzone>
  );
}
