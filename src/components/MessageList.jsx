import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
const MessageList = ({ onSelectMessage, selectedMessageId }) => {
    const { data: messages, isLoading } = useQuery({
      queryKey: ['messages'],
      queryFn: async () => {
        const response = await fetch('http://localhost:3000/api/messages');
        const data = await response.json(); 
        return data;
      },
      initialData: [] 
    });
  
    if (isLoading) return <div className="p-4">Loading messages...</div>;
  
    return (
      <div className="h-screen overflow-y-auto border-r">
        <div className="p-4 bg-gray-100 border-b">
          <h2 className="text-lg font-bold">Customer Messages ({messages.length})</h2>
        </div>
        {messages.map((message) => (
          <div
            key={message.id}
            onClick={() => onSelectMessage(message)}
            className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
              selectedMessageId === message.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="font-bold">{message.customerName}</div>
              <div className={`text-xs px-2 py-1 rounded ${
                message.replies?.length ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {message.replies?.length ? 'Replied' : 'New'}
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-1">{message.content}</div>
            <div className="text-xs text-gray-400 mt-2">
              {new Date(message.timestamp).toLocaleString()}
            </div>
            {message.replies?.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                {message.replies.length} {message.replies.length === 1 ? 'reply' : 'replies'}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
export default MessageList;