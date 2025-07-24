# Utils Directory

This directory contains utility functions and helper modules used throughout the Deepict application.

## Utility Architecture

The utils layer provides reusable functions that handle common operations, data transformations, and business logic that doesn't belong in components or services.

## File Parser (`fileParser.ts`)

### Overview
The file parser utility handles JSON and JSONL file processing, converting raw file content into structured data objects used by the application.

### Core Functions

#### `parseJsonFile(content: string, type: DataType): JsonData[]`
**Purpose**: Parse JSON or JSONL file content into structured data

**Parameters**:
- `content`: Raw file content as string
- `type`: File type ("json" | "jsonl")

**Returns**: Array of `JsonData` objects

**JSON Processing**:
```typescript
// Single JSON object processing
{
  id: timestamp,
  data: parsed_json_object
}
```

**JSONL Processing**:
```typescript
// Multiple JSON objects, one per line
[
  { id: "timestamp_0", data: parsed_line_0 },
  { id: "timestamp_1", data: parsed_line_1 },
  // ...
]
```

#### Error Handling
- **JSON Parse Errors**: Descriptive error messages
- **Line-by-Line Validation**: Specific line error reporting
- **Empty File Handling**: Validation for empty content
- **Format Validation**: Strict format checking

#### `generateChatMessage(fileInfo: FileInfo): string`
**Purpose**: Generate formatted chat message for file uploads

**Features**:
- File size formatting (Bytes, KB, MB, GB)
- File type display (JSON/JSONL)
- Item count reporting
- Markdown formatting for chat display

**Output Format**:
```
📁 **File uploaded**: filename.json
📊 **Type**: JSON
📏 **Size**: 2.5 KB
📋 **Items**: 1 item
```

### Data Structures

#### `JsonData` Interface
```typescript
interface JsonData {
  id: string;      // Unique identifier (timestamp-based)
  data: unknown;   // Parsed JSON content (any valid JSON)
}
```

#### `FileInfo` Interface
```typescript
interface FileInfo {
  name: string;        // Original filename
  size: number;        // File size in bytes
  itemCount: number;   // Number of JSON items
  type: DataType;      // "json" | "jsonl"
}
```

### Processing Logic

#### JSON File Processing
1. **Parse Content**: Single JSON.parse() operation
2. **Create Data Object**: Wrap in JsonData structure
3. **Generate ID**: Timestamp-based unique identifier
4. **Return Array**: Single-item array for consistency

#### JSONL File Processing
1. **Split Lines**: Separate content by newlines
2. **Filter Empty Lines**: Remove whitespace-only lines
3. **Parse Each Line**: Individual JSON.parse() for each line
4. **Error Reporting**: Line-specific error messages
5. **ID Generation**: Timestamp + index for uniqueness

### Error Scenarios

#### Common Error Cases
- **Invalid JSON Syntax**: Malformed JSON content
- **Empty Files**: No content or whitespace only
- **Mixed Content**: Invalid JSONL format
- **Large Files**: Memory constraints
- **Encoding Issues**: Character encoding problems

#### Error Messages
- **JSON Errors**: "Invalid JSON format"
- **JSONL Errors**: "Invalid JSON at line X: content"
- **Empty Errors**: "No valid JSON lines found"
- **Type Errors**: "Unsupported file type"

### Performance Considerations

#### Memory Management
- **Streaming Processing**: For large files
- **Chunked Reading**: Prevent memory overflow
- **Garbage Collection**: Efficient object creation

#### Processing Optimization
- **Lazy Evaluation**: Process only when needed
- **Caching**: Cache parsed results
- **Parallel Processing**: Multi-threaded parsing for large files

## Future Utilities

### Planned Utility Additions

#### Data Validation Utils
**Purpose**: Validate and sanitize data structures
- Schema validation
- Data type checking
- Sanitization functions
- Format conversion

#### Format Converters
**Purpose**: Convert between different data formats
- JSON to CSV conversion
- JSONL to JSON array conversion
- XML to JSON conversion
- Data format detection

#### Search Utils
**Purpose**: Advanced search and filtering functionality
- Full-text search
- Fuzzy matching
- Regular expression search
- Complex query parsing

#### Export Utils
**Purpose**: Export data in various formats
- CSV export
- Excel export
- PDF generation
- Image export

### Utility Design Patterns

#### Pure Functions
```typescript
// Stateless, predictable functions
function transformData(input: Input): Output {
  // No side effects
  return processedOutput;
}
```

#### Error Handling Pattern
```typescript
function utilityFunction(input: Input): Result<Output, Error> {
  try {
    const result = processInput(input);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

#### Validation Pattern
```typescript
function validateAndProcess<T>(
  input: unknown,
  validator: (input: unknown) => input is T
): T {
  if (!validator(input)) {
    throw new ValidationError("Invalid input");
  }
  return input;
}
```

## Development Guidelines

### Utility Creation
1. **Single Responsibility**: Each utility has one clear purpose
2. **Pure Functions**: Avoid side effects when possible
3. **Error Handling**: Comprehensive error management
4. **Type Safety**: Full TypeScript support
5. **Testing**: Unit tests for all utilities

### Code Quality
- **Immutability**: Prefer immutable operations
- **Documentation**: Clear JSDoc comments
- **Performance**: Optimize for common use cases
- **Reusability**: Design for multiple use cases

### Testing Strategy
- **Unit Tests**: Test individual functions
- **Edge Cases**: Test boundary conditions
- **Error Scenarios**: Test error handling
- **Performance Tests**: Benchmark critical functions

### Integration Guidelines
- **Import Strategy**: Named imports for tree shaking
- **Dependency Management**: Minimal external dependencies
- **API Consistency**: Consistent function signatures
- **Error Propagation**: Proper error handling

## Best Practices

### Function Design
- **Small Functions**: Single responsibility principle
- **Descriptive Names**: Clear function naming
- **Type Annotations**: Comprehensive TypeScript types
- **Error Messages**: Helpful error descriptions

### Performance Optimization
- **Caching**: Cache expensive operations
- **Lazy Loading**: Load utilities on demand
- **Memory Efficiency**: Minimize memory usage
- **Algorithm Complexity**: Optimize for common cases

### Security Considerations
- **Input Validation**: Validate all inputs
- **Sanitization**: Clean user-provided data
- **XSS Prevention**: Prevent script injection
- **Data Exposure**: Avoid sensitive data logging

### Documentation
- **JSDoc Comments**: Document all public functions
- **Usage Examples**: Provide code examples
- **Error Handling**: Document possible errors
- **Performance Notes**: Document performance characteristics

## Common Patterns

### Result Pattern
```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };
```

### Option Pattern
```typescript
type Option<T> = T | null | undefined;

function getOption<T>(value: T | null | undefined): Option<T> {
  return value ?? null;
}
```

### Validation Pattern
```typescript
function isValidData(data: unknown): data is ValidDataType {
  return typeof data === 'object' && data !== null;
}
```

### Transform Pattern
```typescript
function transformData<T, R>(
  data: T,
  transformer: (item: T) => R
): R {
  return transformer(data);
}
```