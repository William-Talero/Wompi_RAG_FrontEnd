'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import SuggestedQuestions from './SuggestedQuestions';

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: Array<{
    title: string;
    source: string;
    score: number;
  }>;
}

interface ChatResponse {
  response: string;
  sources: Array<{
    title: string;
    source: string;
    score: number;
  }>;
  totalSources: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! Soy el asistente virtual de Wompi. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>('connecting');
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Verificar conexión con el backend al cargar
    checkConnection();
    // Marcar que estamos en el cliente
    setIsClient(true);
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      setConnectionStatus('error');
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const messageContent = messageText || input.trim();
    if (!messageContent || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: messageContent,
          category: 'knowledge_base',
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'bot',
        timestamp: new Date(),
        sources: data.sources,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const ConnectionStatus = () => {
    const statusConfig = {
      connected: { icon: CheckCircle, color: 'text-green-500', text: 'Conectado' },
      connecting: { icon: Loader2, color: 'text-yellow-500', text: 'Conectando...' },
      error: { icon: AlertCircle, color: 'text-red-500', text: 'Error de conexión' }
    };

    const { icon: Icon, color, text } = statusConfig[connectionStatus];

    return (
      <div className={`flex items-center gap-2 ${color}`}>
        <Icon size={16} className={connectionStatus === 'connecting' ? 'animate-spin' : ''} />
        <span className="text-sm">{text}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Asistente Wompi</h1>
              <p className="text-sm text-gray-700">Powered by RAG + LanceDB</p>
            </div>
          </div>
          <ConnectionStatus />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-white" size={16} />
              </div>
            )}
            
            <div
              className={`max-w-3xl px-4 py-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <p className={`whitespace-pre-wrap ${
                message.sender === 'user'
                  ? 'text-white'
                  : 'text-gray-900'
              }`}>{message.content}</p>
              
              {/* Sources */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-800 mb-2">Fuentes consultadas:</p>
                  <div className="space-y-1">
                    {message.sources.map((source, index) => (
                      <div key={index} className="text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded">
                        📄 {source.title} (similitud: {(1 - source.score).toFixed(2)})
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-xs text-gray-700 mt-2">
                {isClient ? formatTime(message.timestamp) : ''}
              </div>
            </div>

            {message.sender === 'user' && (
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="text-white" size={16} />
              </div>
            )}
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="text-white" size={16} />
            </div>
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                <span className="text-gray-800">Pensando...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pregúntame sobre Wompi..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
            disabled={isLoading || connectionStatus === 'error'}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading || connectionStatus === 'error'}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
        
        {connectionStatus === 'error' && (
          <div className="mt-2 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle size={16} />
            No se puede conectar al servidor. Asegúrate de que el backend esté ejecutándose en {API_BASE_URL}
          </div>
        )}
      </div>

      {/* Suggested Questions - show only when no messages or just welcome message */}
      {messages.length <= 1 && !isLoading && (
        <SuggestedQuestions onQuestionClick={handleSuggestedQuestion} />
      )}
    </div>
  );
}