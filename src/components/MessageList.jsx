import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBar from './SearchBar';

const MessageList = ({ onSelectMessage, selectedMessageId }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['messages', page],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/api/messages?page=${page}&limit=20`);
      const data = await response.json();
      return {
        messages: data.messages || [],
        totalCount: data.totalCount || 0,
        currentPage: data.currentPage || 1,
        totalPages: data.totalPages || 1
      };
    },
    keepPreviousData: true,
  });

  const messages = response?.messages || [];
  const totalCount = response?.totalCount || 0;
  const totalPages = response?.totalPages || 1;
  const currentPage = response?.currentPage || 1;

  useEffect(() => {
    if (response) {
      setHasPrevious(currentPage > 1);
      setHasMore(currentPage < totalPages);
    }
  }, [currentPage, totalPages, response]);

  const filteredMessages = messages.filter(message => {
    const searchTerm = searchFilter.toLowerCase();
    return (
      message.customerName.toLowerCase().includes(searchTerm) ||
      message.content.toLowerCase().includes(searchTerm) ||
      (Array.isArray(message.replies) && message.replies.some(reply => 
        reply.content.toLowerCase().includes(searchTerm)
      ))
    );
  });

  const sortedMessages = [...filteredMessages].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const handleSearch = (term) => {
    setSearchFilter(term);
    setPage(1); 
  };

  const loadMoreMessages = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const loadPreviousMessages = () => {
    if (hasPrevious) {
      setPage(prev => prev - 1);
    }
  };

  if (isLoading) return <div className="p-4">Loading messages...</div>;
  if (isError) return <div className="p-4">Error loading messages</div>;

  return (
    <div className="h-screen flex flex-col">
      <SearchBar onSearch={handleSearch} />
      
      <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">
          Customer Messages ({totalCount})
        </h2>
        {totalCount > 0 && (
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
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

      {totalCount > 0 && (
        <div className="flex justify-between p-4 bg-gray-100">
          {hasPrevious && (
            <button
              onClick={loadPreviousMessages}
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Previous Page
            </button>
          )}
          
          {hasMore && (
            <button
              onClick={loadMoreMessages}
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
            >
              Next Page
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const highlightText = (text, searchTerm) => {
  if (!searchTerm || typeof text !== 'string') return text;

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