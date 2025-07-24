# Components Directory

This directory contains all React components for the Deepict application.

## Component Architecture

### Core Components

#### AIChat.tsx

**Purpose**: Main AI interaction interface with chat functionality

**Key Features**:

- Real-time chat interface with message history
- File upload capability (JSON/JSONL)
- Settings modal integration
- API key management
- Streaming response handling via SSE

**State Management**:

- Uses `useAppStore` for global state
- Manages local state for input handling
- Auto-scrolling chat history

**Dependencies**:

- `@mantine/core`: UI components
- `@mantine/code-highlight`: Code syntax highlighting
- `@tabler/icons-react`: Icon library

#### JsonViewer.tsx

**Purpose**: Multi-tab JSON data visualization component

**Key Features**:

- **Visualization Tab**: Renders AI-generated HTML components in iframe
- **Preview Tab**: Interactive JSON tree viewer
- **Raw JSON Tab**: Syntax-highlighted JSON code
- Dynamic tab switching based on content availability

**Security**:

- iframe sandboxing for AI-generated HTML
- Safe JSON placeholder replacement

**Dependencies**:

- `@textea/json-viewer`: JSON tree visualization
- `@mantine/code-highlight`: Syntax highlighting

#### FileDropzone.tsx

**Purpose**: Full-screen drag-and-drop file upload interface

**Key Features**:

- Visual feedback for drag states (accept/reject)
- File type validation (JSON/JSONL only)
- Error handling with notifications
- Seamless integration with app layout

**UX Considerations**:

- Non-intrusive when not in use
- Clear visual feedback during drag operations
- Descriptive error messages

#### JsonList.tsx

**Purpose**: Navigation component for JSONL files with multiple items

**Key Features**:

- Displays list of JSON items from JSONL files
- Search integration for filtering items
- Item selection and navigation
- Responsive design

#### SearchBar.tsx

**Purpose**: Global search functionality for JSON data

**Key Features**:

- Full-text search across JSON content
- Real-time search results
- Integration with JsonList for filtered display
- Keyboard shortcuts support

#### Settings.tsx

**Purpose**: Configuration modal for application settings

**Key Features**:

- API key configuration
- Settings persistence via localStorage
- Secure key handling
- User-friendly form validation

### Basic Components Directory

#### MantineRegistry.tsx

**Purpose**: Root provider component for Mantine UI framework

**Responsibilities**:

- Mantine theme configuration
- Color scheme management
- Component provider setup
- Global style injection

#### EmotionRootStyleRegistry.tsx

**Purpose**: Emotion CSS-in-JS integration for SSR compatibility

**Responsibilities**:

- Server-side rendering support
- Style injection management
- Emotion cache configuration

## Component Patterns

### State Management

- **Global State**: Uses Zustand via `useAppStore`
- **Local State**: React hooks for component-specific state
- **Prop Drilling**: Minimal due to centralized state management

### Event Handling

- **File Processing**: Async operations with loading states
- **AI Interactions**: Streaming responses with progress indicators
- **User Input**: Debounced search, form validation

### Error Handling

- **Graceful Degradation**: Fallback UI for missing data
- **User Feedback**: Notifications for errors and success states
- **Logging**: Console logging for debugging

### Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels
- **Color Contrast**: Accessible color schemes

## Styling Approach

### CSS Framework Stack

- **Tailwind CSS 4**: Utility-first styling
- **Mantine**: Component-specific styles
- **Emotion**: CSS-in-JS for dynamic styles
- **Sass**: Global styles and variables

### Design System

- **Color Palette**: Consistent brand colors
- **Typography**: Hierarchical text styles
- **Spacing**: Grid-based layout system
- **Animations**: Subtle transitions and micro-interactions

## Performance Considerations

### Optimization Strategies

- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large JSON datasets
- **Code Splitting**: Bundle optimization

### Memory Management

- **Event Cleanup**: Proper effect cleanup
- **State Normalization**: Efficient data structures
- **Garbage Collection**: Preventing memory leaks

## Testing Guidelines

### Component Testing

- **Unit Tests**: Individual component logic
- **Integration Tests**: Component interactions
- **E2E Tests**: User workflow testing

### Test Structure

```javascript
// Example test structure
describe('AIChat', () => {
  it('should render chat interface', () => {
    // Test implementation
  });

  it('should handle file uploads', () => {
    // Test implementation
  });
});
```

## Development Guidelines

### Code Style

- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent formatting
- **Naming Conventions**: Descriptive component names

### Component Creation

1. Create TypeScript interface for props
2. Implement component with proper typing
3. Add error boundaries where needed
4. Include accessibility attributes
5. Write unit tests

### Best Practices

- **Single Responsibility**: Each component has one clear purpose
- **Composition**: Favor composition over inheritance
- **Props Interface**: Well-defined prop types
- **Error Boundaries**: Graceful error handling
