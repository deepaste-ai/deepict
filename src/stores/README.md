# Stores Directory

This directory contains the state management implementation for the Deepict application using Zustand.

## State Management Architecture

### Zustand Store (`useAppStore.ts`)

Deepict uses Zustand for centralized state management, providing a simple and efficient way to manage application state across components.

## Store Structure

### State Interfaces

#### `ChatMessage`

```typescript
interface ChatMessage {
  id: string; // Unique identifier
  role: 'user' | 'assistant'; // Message sender
  content: string; // Message content
  timestamp: Date; // Creation timestamp
}
```

#### `JsonData`

```typescript
interface JsonData {
  id: string; // Unique identifier
  data: unknown; // Parsed JSON data
}
```

#### `FileInfo`

```typescript
interface FileInfo {
  name: string; // Original filename
  size: number; // File size in bytes
  itemCount: number; // Number of JSON items
  type: DataType; // "json" | "jsonl"
}
```

### State Categories

#### Data Management

- **`dataType`**: Current file type (json/jsonl)
- **`jsonData`**: Array of parsed JSON objects
- **`currentJsonId`**: Currently selected JSON item ID
- **`fileInfo`**: Metadata about uploaded file
- **`jsonHTMLComponent`**: AI-generated HTML visualization

#### UI State

- **`showSearchBar`**: Search bar visibility toggle
- **`searchQuery`**: Current search query string
- **`showSettings`**: Settings modal visibility

#### Processing State

- **`isFileUploading`**: File upload progress indicator
- **`isAIProcessing`**: AI request processing state

#### Chat System

- **`chatMessages`**: Array of chat conversation history
- **`apiKey`**: Anthropic API key for Claude integration

#### Settings

- **`apiKey`**: Stored API key
- **`showSettings`**: Settings modal visibility

## Core Actions

### Data Management Actions

#### `processFile(content, type, filename, fileSize)`

**Purpose**: Process uploaded JSON/JSONL files

**Flow**:

1. Set uploading state
2. Parse file content using `parseJsonFile`
3. Update store with parsed data
4. Generate chat message about uploaded file
5. Trigger AI visualization generation
6. Handle errors gracefully

#### `setCurrentJsonId(id)`

**Purpose**: Switch between JSON items in JSONL files

**Usage**: Called when user selects different items from JsonList

#### `setJsonHTMLComponent(html)`

**Purpose**: Update AI-generated HTML visualization

**Usage**: Called during streaming AI response processing

### Chat Actions

#### `addChatMessage(message)`

**Purpose**: Add new message to chat history

**Features**:

- Auto-generates unique ID and timestamp
- Supports both user and assistant messages
- Maintains conversation order

#### `clearChatHistory()`

**Purpose**: Reset chat conversation

**Usage**: Called when user clicks "Clear" button in chat interface

#### `generateHTMLComponent(userInput?)`

**Purpose**: Generate AI-powered HTML visualization

**Process**:

1. Validate current JSON data exists
2. Set processing state
3. Call streaming API via SSE
4. Update chat with AI responses
5. Update HTML component with generated code
6. Handle errors and API key issues

### Search Actions

#### `setSearchQuery(query)`

**Purpose**: Update search query and filter results

**Integration**: Works with `getFilteredJsonData()` utility

#### `setShowSearchBar(show)`

**Purpose**: Toggle search bar visibility

**Logic**: Automatically shown for JSONL files with multiple items

### Settings Actions

#### `setApiKey(apiKey)`

**Purpose**: Update and persist API key

**Features**:

- Automatic localStorage persistence
- Secure key handling
- Validation support

#### `loadSettings()` / `saveSettings()`

**Purpose**: Persist settings across app sessions

**Storage**: Uses localStorage for client-side persistence

## Utility Functions

### `getCurrentJson()`

**Purpose**: Get currently selected JSON data

**Returns**: Current JsonData object or null

**Usage**: Used throughout components to access active data

### `getFilteredJsonData()`

**Purpose**: Apply search filter to JSON data

**Logic**:

- Returns all data if no search query
- Filters by JSON content string matching
- Case-insensitive search

## State Flow Patterns

### File Upload Flow

```
User drops file → FileDropzone → processFile() → 
Parse data → Update store → Generate chat message → 
Trigger AI visualization → Update UI
```

### AI Interaction Flow

```
User sends message → addChatMessage() → generateHTMLComponent() →
SSE streaming → Update chat responses → Update HTML component →
Complete processing
```

### Search Flow

```
User types query → setSearchQuery() → getFilteredJsonData() →
JsonList re-renders → Filtered results displayed
```

## Error Handling

### API Key Validation

- Automatic settings modal display when key missing
- Error messages for invalid keys
- Graceful fallback handling

### File Processing Errors

- JSON parsing error handling
- File type validation
- User-friendly error messages

### AI Processing Errors

- SSE connection error handling
- Retry logic for failed requests
- Error display in chat interface

## Performance Optimizations

### Efficient Updates

- Immutable state updates
- Selective re-renders
- Optimized selectors

### Memory Management

- Proper cleanup of SSE connections
- Efficient data structures
- Garbage collection friendly patterns

## Integration Points

### Component Integration

- **AIChat**: Chat messages, processing state, API management
- **JsonViewer**: Current JSON data, HTML components
- **JsonList**: Search filtering, item selection
- **SearchBar**: Search query management
- **Settings**: API key configuration

### Service Integration

- **SSE Service**: Real-time AI communication
- **File Parser**: JSON/JSONL processing
- **localStorage**: Settings persistence

## Development Guidelines

### State Updates

- Use immutable update patterns
- Batch related state changes
- Avoid direct mutations

### Action Design

- Keep actions focused and atomic
- Handle side effects properly
- Include error handling

### Testing Strategy

- Unit test individual actions
- Integration test state flows
- Mock external dependencies

### Best Practices

- Use TypeScript for type safety
- Document complex state logic
- Keep store lean and focused
- Separate concerns properly
