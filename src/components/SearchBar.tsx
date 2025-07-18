'use client';
import { useAppStore } from '@/stores/useAppStore';
import { ActionIcon, TextInput } from '@mantine/core';

export function SearchBar() {
  const { searchQuery, setSearchQuery, setShowSearchBar } = useAppStore();

  const handleClear = () => {
    setSearchQuery('');
    setShowSearchBar(false);
  };

  return (
    <div className="w-full mb-4 px-1">
      <TextInput
        placeholder="Search JSON data..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
        leftSection={<span className="icon-[mdi--magnify] w-4 h-4 text-gray-500" />}
        rightSection={
          <ActionIcon
            variant="transparent"
            onClick={handleClear}
            size="sm"
            className="hover:bg-gray-100 transition-colors"
          >
            <span className="icon-[mdi--close] w-4 h-4 text-gray-500" />
          </ActionIcon>
        }
        size="md"
        radius="md"
        className="shadow-sm"
        styles={{
          input: {
            borderColor: '#e5e7eb',
            '&:focus': {
              borderColor: '#3b82f6',
            },
          },
        }}
      />
    </div>
  );
}
