'use client';
import { AIChat } from '@/components/AIChat';
import { FileDropzone } from '@/components/FileDropzone';
import { JsonList } from '@/components/JsonList';
import { JsonViewer } from '@/components/JsonViewer';
import { SearchBar } from '@/components/SearchBar';
import { useAppStore } from '@/stores/useAppStore';

export default function Home() {
  const { showSearchBar } = useAppStore();

  return (
    <FileDropzone className='w-screen h-screen overflow-hidden relative'>
      <div className='w-full h-full flex bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden pointer-events-auto'>
        {/* Left Content Area */}
        <div className='flex-1 flex flex-col p-4 min-w-0 overflow-hidden gap-4'>
          {/* Search Bar - only shows when showSearchBar is true */}
          {showSearchBar && <SearchBar />}

          {/* Content Area */}
          <div className='flex-1 flex min-h-0 overflow-hidden gap-4'>
            {/* JSON List - only shows for JSONL data */}
            <JsonList />

            {/* JSON Viewer - main content area */}
            <JsonViewer />
          </div>
        </div>

        {/* Right AI Chat Area */}
        <div className='flex-shrink-0'>
          <AIChat />
        </div>
      </div>
    </FileDropzone>
  );
}
