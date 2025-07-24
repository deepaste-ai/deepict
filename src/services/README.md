# Services Directory

This directory contains external service integrations and utility services for the Deepict application.

## Service Architecture

The services layer provides abstraction for external APIs and complex operations, following a clean architecture pattern that separates business logic from implementation details.

## SSE Service (`sse.ts`)

### Overview
The Server-Sent Events (SSE) service handles real-time communication between the frontend and the AI backend, providing streaming responses for better user experience.

### Core Features

#### Custom Error Classes
```typescript
// Base error class for SSE operations
class SSEError extends Error {}

// Retriable errors (temporary failures)
class SSERetriableError extends SSEError {}

// Fatal errors (permanent failures)
class SSEFatalError extends SSEError {}
```

#### Main Function: `streamCallHTMLComponentGenerator`
**Purpose**: Establish SSE connection for AI-powered HTML component generation

**Parameters**:
```typescript
params: {
  prevHTML?: string;     // Previous HTML for iterative improvement
  json: string;          // JSON data to visualize
  userInput?: string;    // User's specific requirements
  apiKey?: string;       // Anthropic API key
}

handlers: {
  onOpen: (response: Response) => Promise<void>;
  onMessage: (ev: EventSourceMessage) => void;
  onClose: () => void;
  onError: (err: unknown) => number | null | undefined | void;
}
```

### Connection Management

#### Connection Lifecycle
1. **Initialization**: Establish SSE connection to `/fapi/gen-vis-comp`
2. **Authentication**: Handle API key validation
3. **Streaming**: Process real-time responses
4. **Cleanup**: Proper connection closure

#### Error Handling Strategy
- **400-499 Status Codes**: Client errors (authentication, validation)
- **500+ Status Codes**: Server errors (retriable)
- **Connection Errors**: Network and timeout handling
- **Abort Signals**: Graceful request cancellation

### Request Configuration

#### HTTP Setup
```typescript
{
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(params),
  signal: AbortSignal,     // For cancellation
}
```

#### SSE Configuration
```typescript
{
  openWhenHidden: true,    // Continue when tab hidden
  onopen: Response handler,
  onmessage: Message handler,
  onclose: Cleanup handler,
  onerror: Error handler,
}
```

### Integration Points

#### Frontend Integration
- **App Store**: State management for responses
- **AIChat Component**: User interface for interactions
- **Error Handling**: User-friendly error display

#### Backend Integration
- **FAPI Server**: Direct connection to AI endpoint
- **Authentication**: API key validation
- **Stream Processing**: Real-time response handling

### Error Recovery

#### Retry Logic
- Automatic retry for retriable errors
- Exponential backoff for failed connections
- Circuit breaker pattern for permanent failures

#### Graceful Degradation
- Fallback to polling for unsupported browsers
- Offline handling and queue management
- User notification for connection issues

### Performance Optimizations

#### Connection Efficiency
- Persistent connections for multiple requests
- Proper resource cleanup
- Memory leak prevention

#### Bandwidth Optimization
- Efficient message serialization
- Compression support
- Minimal overhead protocol

## Future Services

### Planned Service Additions

#### File Service
**Purpose**: Handle file operations and storage
- File upload/download management
- File format conversion
- Temporary file cleanup
- Cloud storage integration

#### Analytics Service
**Purpose**: Track usage and performance metrics
- User interaction tracking
- Performance monitoring
- Error analytics
- Usage patterns analysis

#### Authentication Service
**Purpose**: User authentication and authorization
- OAuth integration
- Session management
- Role-based access control
- API key management

#### Cache Service
**Purpose**: Improve performance with caching
- Response caching
- File caching
- Redis integration
- Cache invalidation strategies

### Service Design Patterns

#### Service Interface Pattern
```typescript
interface ServiceInterface<T, R> {
  execute(params: T): Promise<R>;
  onError(error: Error): void;
  onSuccess(result: R): void;
}
```

#### Factory Pattern
```typescript
class ServiceFactory {
  static create<T extends ServiceInterface>(
    type: ServiceType
  ): T {
    // Service creation logic
  }
}
```

#### Observer Pattern
```typescript
interface ServiceObserver {
  onServiceEvent(event: ServiceEvent): void;
}
```

## Development Guidelines

### Service Implementation
1. **Interface Definition**: Clear service contracts
2. **Error Handling**: Comprehensive error management
3. **Testing**: Unit and integration tests
4. **Documentation**: API documentation
5. **Monitoring**: Performance and error tracking

### Code Quality
- **TypeScript**: Full type safety
- **Error Boundaries**: Graceful error handling
- **Logging**: Structured logging
- **Testing**: Comprehensive test coverage

### Integration Testing
- **Mock Services**: Test doubles for external APIs
- **E2E Testing**: Full workflow testing
- **Performance Testing**: Load and stress testing
- **Error Scenarios**: Edge case validation

### Security Considerations
- **API Key Management**: Secure key handling
- **Input Validation**: Sanitization and validation
- **Rate Limiting**: Prevent abuse
- **CORS Configuration**: Secure cross-origin requests

## Monitoring and Observability

### Service Health
- **Health Checks**: Service availability monitoring
- **Performance Metrics**: Response time tracking
- **Error Rates**: Failure rate monitoring
- **Resource Usage**: Memory and CPU monitoring

### Logging Strategy
- **Structured Logging**: JSON log format
- **Log Levels**: Appropriate log levels
- **Correlation IDs**: Request tracing
- **Error Context**: Detailed error information

### Alerting
- **Error Thresholds**: Automated alerts
- **Performance Degradation**: SLA monitoring
- **Resource Limits**: Capacity alerts
- **Security Events**: Security monitoring

## Best Practices

### Service Design
- **Single Responsibility**: Each service has one purpose
- **Loose Coupling**: Minimal dependencies
- **High Cohesion**: Related functionality grouped
- **Interface Segregation**: Focused interfaces

### Error Handling
- **Graceful Degradation**: Fallback mechanisms
- **User-Friendly Messages**: Clear error communication
- **Retry Logic**: Intelligent retry strategies
- **Circuit Breakers**: Prevent cascade failures

### Performance
- **Caching**: Intelligent caching strategies
- **Connection Pooling**: Efficient resource usage
- **Batch Processing**: Bulk operations
- **Async Operations**: Non-blocking operations

### Security
- **Input Validation**: Comprehensive validation
- **Authentication**: Secure authentication
- **Authorization**: Role-based access
- **Data Protection**: Encryption and sanitization