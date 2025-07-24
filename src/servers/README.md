# Servers Directory

This directory contains the server-side implementation for the Deepict application's API layer.

## Architecture Overview

The server implementation uses a modern, lightweight stack:

- **Hono**: Fast, lightweight web framework
- **Server-Sent Events (SSE)**: Real-time streaming responses
- **Anthropic Claude API**: AI-powered JSON visualization generation
- **Zod**: Runtime type validation

## FAPI Server (`/fapi/index.ts`)

### Overview

The FAPI (Fast API) server provides the backend functionality for AI-powered JSON visualization generation. It's built with Hono framework and designed for high performance and real-time streaming.

### Server Configuration

#### Base Setup

```typescript
const fapiServer = new Hono().basePath('/fapi');
```

#### Middleware Stack

1. **Logger Middleware**: Request logging for debugging
2. **Compression Middleware**: Response compression (excluded for SSE)
3. **CORS Middleware**: Cross-origin request handling

### API Endpoints

#### POST `/fapi/gen-vis-comp`

**Purpose**: Generate HTML visualization components for JSON data

**Request Schema**:

```typescript
{
  prevHTML?: string;    // Previous HTML for iterative improvement
  json: string;         // JSON data to visualize
  userInput?: string;   // User's specific requirements
  apiKey?: string;      // Anthropic API key (optional)
}
```

**Response**: Server-Sent Events stream with two event types:

- `resp`: Text responses and status updates
- `html`: Generated HTML component content

### AI Integration

#### Anthropic Claude Integration

- **Model**: `claude-4-sonnet-20250514`
- **Max Tokens**: 64,000
- **Streaming**: Full stream processing for real-time responses

#### System Prompt

The AI system is configured with specific instructions for:

- JSON data analysis and visualization
- Design system preferences (shadcn UI, dark mode, Apple-style aesthetics)
- Data hierarchy and importance prioritization
- Chart and table generation for complex data

### Streaming Implementation

#### SSE Response Format

```typescript
// Status/text responses
{
  type: "resp",
  content: string
}

// HTML content
{
  type: "html", 
  content: string
}
```

#### Stream Processing

1. **Connection Setup**: Establish SSE connection
2. **AI Request**: Send structured prompt to Claude
3. **Response Streaming**: Process AI response in real-time
4. **Content Separation**: Separate text responses from HTML content
5. **Client Updates**: Stream updates to frontend

### Error Handling

#### API Key Validation

- Checks for API key in request or environment
- Returns 400 error with descriptive message if missing
- Graceful fallback to environment variables

#### Stream Error Handling

- Abort controller for request cancellation
- Proper error propagation to client
- SSE error events for client-side handling

#### Connection Management

- Automatic cleanup on abort
- Proper stream closure
- Error recovery mechanisms

### Security Features

#### CORS Configuration

```typescript
cors({
  origin: (origin) => origin || '*',
  allowHeaders: ['*'],
  exposeHeaders: ['*'],
  credentials: true,
});
```

#### Input Validation

- Zod schema validation for all inputs
- JSON parsing with error handling
- Sanitization of user inputs

#### API Key Security

- No logging of API keys
- Secure transmission
- Environment variable fallback

### Performance Optimizations

#### Compression Strategy

- Excludes SSE streams from compression
- Efficient for non-streaming responses
- Reduces bandwidth usage

#### Streaming Benefits

- Reduced perceived latency
- Progressive content loading
- Better user experience for long-running AI requests

#### Memory Management

- Efficient stream processing
- Proper cleanup of resources
- Garbage collection friendly patterns

### Integration Points

#### Frontend Integration

- **SSE Service**: Client-side stream handling
- **App Store**: State management for responses
- **Error Handling**: Graceful error display

#### AI Service Integration

- **Anthropic SDK**: Official SDK usage
- **Prompt Engineering**: Optimized prompts for visualization
- **Response Processing**: Structured output handling

## Development Guidelines

### API Design Principles

- **RESTful Design**: Clear endpoint structure
- **Type Safety**: Zod validation for all inputs
- **Error Handling**: Comprehensive error responses
- **Performance**: Optimized for real-time streaming

### Code Organization

- **Middleware**: Reusable middleware functions
- **Validation**: Centralized input validation
- **Error Handling**: Consistent error responses
- **Logging**: Structured logging for debugging

### Testing Strategy

- **Unit Tests**: Individual endpoint testing
- **Integration Tests**: Full request/response cycles
- **Stream Testing**: SSE connection testing
- **Error Scenarios**: Edge case validation

### Deployment Considerations

- **Environment Variables**: Secure configuration
- **Port Configuration**: Flexible port binding
- **CORS Setup**: Production-ready CORS configuration
- **Error Logging**: Production error tracking

## Monitoring and Debugging

### Logging Strategy

- Request/response logging
- Error tracking and reporting
- Performance metrics
- AI response analysis

### Health Checks

- API endpoint availability
- AI service connectivity
- Stream connection health
- Error rate monitoring

### Performance Metrics

- Response time tracking
- Stream latency measurement
- Error rate monitoring
- Resource usage analysis

## Future Enhancements

### Planned Features

- **Authentication**: User authentication system
- **Rate Limiting**: API usage limits
- **Caching**: Response caching for common queries
- **Analytics**: Usage analytics and insights

### Scalability Considerations

- **Load Balancing**: Multi-instance deployment
- **Database Integration**: Persistent storage
- **Queue System**: Background processing
- **CDN Integration**: Static asset delivery
