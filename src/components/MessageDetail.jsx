import React from 'react';
import { useState } from 'react';
import { useQuery ,useQueryClient,useMutation} from '@tanstack/react-query';
import axios from 'axios';
const MessageDetail = ({ message, onClose }) => {
    const [reply, setReply] = useState('');
    const queryClient = useQueryClient();
  
    const replyMutation = useMutation({
      mutationFn: async ({ messageId, content }) => {
        const response = await fetch(`http://localhost:3000/api/messages/${messageId}/reply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });
        const data = await response.json(); 
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['messages']);
        setReply('');
      },
    });
  
    if (!message) {
      return (
        <div className="h-screen flex items-center justify-center text-gray-500">
          Select a message to view details
        </div>
      );
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (reply.trim()) {
        try {
          await replyMutation.mutateAsync({ messageId: message.id, content: reply });
        } catch (error) {
          console.error('Error sending reply:', error);
        }
      }
    };
  
    return (
      <div className="h-screen flex flex-col">
        <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{message.customerName}</h2>
            <div className="text-sm text-gray-600">
              {new Date(message.timestamp).toLocaleString()}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-xl font-bold"
          >
            ×
          </button>
        </div>
  
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="text-gray-800">{message.content}</div>
          </div>
  
          {message.replies?.map((reply) => (
            <div key={reply.id} className="bg-blue-50 p-4 rounded-lg shadow-sm mb-4 ml-8">
              <div className="text-gray-800">{reply.content}</div>
              <div className="text-xs text-gray-500 mt-2">
                {new Date(reply.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
  
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSubmit}>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="w-full p-2 border rounded-lg mb-2"
              rows="3"
              placeholder="Type your reply..."
            />
            <div className="flex justify-between items-center">
              <button
                type="submit"
                disabled={replyMutation.isPending}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
              </button>
              {replyMutation.isError && (
                <div className="text-red-500 text-sm">Error sending reply. Please try again.</div>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  };
    export default MessageDetail;