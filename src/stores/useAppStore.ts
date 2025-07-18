import { streamCallHTMLComponentGenerator } from '@/services/sse';
import { generateChatMessage, parseJsonFile } from '@/utils/fileParser';
import { create } from 'zustand';

export type DataType = 'json' | 'jsonl';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface JsonData {
  id: string;
  data: unknown;
}

export interface FileInfo {
  name: string;
  size: number;
  itemCount: number;
  type: DataType;
}

interface AppState {
  // Data management
  dataType: DataType | null;
  jsonData: JsonData[];
  currentJsonId: string | null;
  fileInfo: FileInfo | null;
  jsonHTMLComponent: string | null;

  // Search functionality
  showSearchBar: boolean;
  searchQuery: string;

  // Chat functionality
  chatMessages: ChatMessage[];
  isAIProcessing: boolean;

  // File upload
  isFileUploading: boolean;

  // Settings
  apiKey: string | null;
  showSettings: boolean;

  // Actions
  setDataType: (type: DataType | null) => void;
  setJsonData: (data: JsonData[]) => void;
  setCurrentJsonId: (id: string | null) => void;
  setFileInfo: (info: FileInfo | null) => void;
  setJsonHTMLComponent: (html: string | null) => void;

  setShowSearchBar: (show: boolean) => void;
  setSearchQuery: (query: string) => void;

  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChatHistory: () => void;
  setIsAIProcessing: (processing: boolean) => void;

  setIsFileUploading: (uploading: boolean) => void;
  processFile: (content: string, type: DataType, filename: string, fileSize: number) => Promise<void>;
  generateHTMLComponent: (userInput?: string) => Promise<void>;

  setApiKey: (apiKey: string | null) => void;
  setShowSettings: (show: boolean) => void;
  loadSettings: () => void;
  saveSettings: () => void;

  // Utility functions
  getCurrentJson: () => JsonData | null;
  getFilteredJsonData: () => JsonData[];
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  dataType: null,
  jsonData: [],
  currentJsonId: null,
  fileInfo: null,
  jsonHTMLComponent: null,

  showSearchBar: false,
  searchQuery: '',

  chatMessages: [],
  isAIProcessing: false,

  isFileUploading: false,

  apiKey: null,
  showSettings: false,

  // Actions
  setDataType: (type) => set({ dataType: type }),

  setJsonData: (data) =>
    set({
      jsonData: data,
      currentJsonId: data.length > 0 ? data[0].id : null,
    }),

  setCurrentJsonId: (id) => set({ currentJsonId: id }),

  setFileInfo: (info) => set({ fileInfo: info }),

  setJsonHTMLComponent: (html) => set({ jsonHTMLComponent: html }),

  setShowSearchBar: (show) => set({ showSearchBar: show }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          ...message,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
        },
      ],
    })),

  clearChatHistory: () => set({ chatMessages: [] }),
  setIsAIProcessing: (processing) => set({ isAIProcessing: processing }),

  setIsFileUploading: (uploading) => set({ isFileUploading: uploading }),

  processFile: async (content, type, filename, fileSize) => {
    set({ isFileUploading: true });

    try {
      // Parse the file
      const parsedData = parseJsonFile(content, type);

      // Create file info
      const fileInfo: FileInfo = {
        name: filename,
        size: fileSize,
        itemCount: parsedData.length,
        type: type,
      };

      // Update store with parsed data
      set({
        dataType: type,
        jsonData: parsedData,
        currentJsonId: parsedData[0]?.id || null,
        fileInfo: fileInfo,
        jsonHTMLComponent: null, // Reset HTML component when new file is loaded
        showSearchBar: type === 'jsonl' && parsedData.length > 1,
      });

      // Generate and send chat message
      const chatMessage = generateChatMessage(fileInfo);
      const state = get();
      state.addChatMessage({
        role: 'user',
        content: chatMessage,
      });

      // Auto-generate HTML component if jsonHTMLComponent is empty
      const currentState = get();
      if (!currentState.jsonHTMLComponent && parsedData.length > 0) {
        // Start HTML component generation
        state.setIsAIProcessing(true);

        let accumulatedMessage = '';
        let accumulatedHTML = '';

        await streamCallHTMLComponentGenerator(
          {
            json: JSON.stringify(parsedData[0]?.data || {}),
            apiKey: get().apiKey || undefined,
          },
          {
            onOpen: async () => {
              console.log('SSE connection opened');
            },
            onMessage: (ev) => {
              try {
                const data = JSON.parse(ev.data);
                console.log('SSE message:', data.type === 'resp', accumulatedMessage);
                switch (data.type) {
                  case 'resp':
                    accumulatedMessage += data.content;
                    // Update chat message with accumulated content
                    const messagesState = get();
                    const lastMessage = messagesState.chatMessages[messagesState.chatMessages.length - 1];
                    if (lastMessage && lastMessage.role === 'assistant') {
                      // Update existing message
                      const updatedMessages = [...messagesState.chatMessages];
                      updatedMessages[updatedMessages.length - 1] = {
                        ...lastMessage,
                        content: accumulatedMessage,
                      };
                      set({ chatMessages: updatedMessages });
                    } else {
                      // Add new assistant message
                      state.addChatMessage({
                        role: 'assistant',
                        content: accumulatedMessage,
                      });
                    }
                    break;

                  case 'html':
                    accumulatedHTML += data.content;
                    // Update HTML component with accumulated HTML
                    state.setJsonHTMLComponent(accumulatedHTML);
                    break;

                  default:
                    console.log('Unknown message type:', data.type);
                }
              } catch (error) {
                console.error('Error parsing SSE message:', error);
              }
            },
            onClose: () => {
              console.log('SSE connection closed');
              state.setIsAIProcessing(false);
            },
            onError: (err) => {
              console.error('SSE error:', err);
              state.setIsAIProcessing(false);
              // Show error message to user
              if (err instanceof Error && err.message && err.message.includes('API key')) {
                state.addChatMessage({
                  role: 'assistant',
                  content: `Error: ${err.message}. Please check your API key configuration.`,
                });
              }
            },
          }
        );
      }
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    } finally {
      set({ isFileUploading: false });
    }
  },

  generateHTMLComponent: async (userInput?: string) => {
    const state = get();
    const currentJson = state.getCurrentJson();

    if (!currentJson || state.isAIProcessing) return;

    set({ isAIProcessing: true });

    let accumulatedMessage = '';
    let accumulatedHTML = '';

    try {
      await streamCallHTMLComponentGenerator(
        {
          prevHTML: state.jsonHTMLComponent || undefined,
          json: JSON.stringify(currentJson.data),
          userInput: userInput || `Generate a visualization component for this ${state.dataType?.toUpperCase()} data`,
          apiKey: state.apiKey || undefined,
        },
        {
          onOpen: async () => {
            console.log('SSE connection opened');
          },
          onMessage: (ev) => {
            try {
              const data = JSON.parse(ev.data);
              switch (data.type) {
                case 'resp':
                  accumulatedMessage += data.content;
                  // Update chat message with accumulated content
                  const messagesState = get();
                  const lastMessage = messagesState.chatMessages[messagesState.chatMessages.length - 1];
                  if (lastMessage && lastMessage.role === 'assistant') {
                    // Update existing message
                    const updatedMessages = [...messagesState.chatMessages];
                    updatedMessages[updatedMessages.length - 1] = {
                      ...lastMessage,
                      content: accumulatedMessage,
                    };
                    set({ chatMessages: updatedMessages });
                  } else {
                    // Add new assistant message
                    state.addChatMessage({
                      role: 'assistant',
                      content: accumulatedMessage,
                    });
                  }
                  break;

                case 'html':
                  accumulatedHTML += data.content;
                  // Update HTML component with accumulated HTML
                  state.setJsonHTMLComponent(accumulatedHTML);
                  break;

                default:
                  console.log('Unknown message type:', data.type);
              }
            } catch (error) {
              console.error('Error parsing SSE message:', error);
            }
          },
          onClose: () => {
            console.log('SSE connection closed');
            set({ isAIProcessing: false });
          },
          onError: (err) => {
            console.error('SSE error:', err);
            set({ isAIProcessing: false });
            // Show error message to user
            if (err instanceof Error && err.message && err.message.includes('API key')) {
              state.addChatMessage({
                role: 'assistant',
                content: `Error: ${err.message}. Please check your API key configuration.`,
              });
            }
          },
        }
      );
    } catch (error) {
      console.error('Error generating HTML component:', error);
      set({ isAIProcessing: false });
    }
  },

  // Utility functions
  getCurrentJson: () => {
    const state = get();
    return state.jsonData.find((item) => item.id === state.currentJsonId) || null;
  },

  getFilteredJsonData: () => {
    const state = get();
    if (!state.searchQuery) return state.jsonData;

    return state.jsonData.filter((item) =>
      JSON.stringify(item.data).toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  },

  setApiKey: (apiKey) => {
    set({ apiKey });
    get().saveSettings();
  },

  setShowSettings: (show) => set({ showSettings: show }),

  loadSettings: () => {
    if (typeof window !== 'undefined') {
      const savedApiKey = localStorage.getItem('anthropic_api_key');
      if (savedApiKey) {
        set({ apiKey: savedApiKey });
      }
    }
  },

  saveSettings: () => {
    if (typeof window !== 'undefined') {
      const state = get();
      if (state.apiKey) {
        localStorage.setItem('anthropic_api_key', state.apiKey);
      } else {
        localStorage.removeItem('anthropic_api_key');
      }
    }
  },
}));
