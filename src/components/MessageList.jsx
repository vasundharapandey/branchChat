import React, { useState} from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SearchBar from './SearchBar';

const MessageList = ({ onSelectMessage, selectedMessageId }) => {
    const [searchFilter, setSearchFilter] = useState('');
    
    const { data: messages = [], isLoading } = useQuery({
      queryKey: ['messages'],
      queryFn: async () => {
        const response = await fetch('http://localhost:3000/api/messages');
        const data = await response.json();
        return data;
      }
    });
 
    const filteredMessages = messages.filter(message => {
      const searchTerm = searchFilter.toLowerCase();
      return (
        message.customerName.toLowerCase().includes(searchTerm) ||
        message.content.toLowerCase().includes(searchTerm) ||
        message.replies?.some(reply => 
          reply.content.toLowerCase().includes(searchTerm)
        )
      );
    });
  
   
    const sortedMessages = [...filteredMessages].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  
    const handleSearch = (term) => {
      setSearchFilter(term);
    };
  
    if (isLoading) return <div className="p-4">Loading messages...</div>;
  
    return (
      <div className="h-screen flex flex-col">
        <SearchBar onSearch={handleSearch} />
        
        <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">
            Customer Messages ({filteredMessages.length})
          </h2>
          {searchFilter && (
            <div className="text-sm text-gray-600">
              Found {filteredMessages.length} matching messages
            </div>
          )}
        </div>
  
        <div className="flex-1 overflow-y-auto">
          {sortedMessages.length > 0 ? (
            sortedMessages.map((message) => (
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
                <div className="text-sm text-gray-600 mt-1">
                  {highlightText(message.content, searchFilter)}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(message.timestamp).toLocaleString()}
                </div>
                {message.replies?.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {message.replies.length} {message.replies.length === 1 ? 'reply' : 'replies'}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              {searchFilter ? (
                <div>
                  <div className="text-lg mb-2">No matching messages found</div>
                  <div className="text-sm">Try adjusting your search terms</div>
                </div>
              ) : (
                <div>No messages yet</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={i} className="bg-yellow-200">{part}</span>
          ) : (
            part
          )
        )}
      </span>
    );
  };
  
  

export default MessageList;
