import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageDetail from './MessageDetail';

const AgentDashboard = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [agentName, setAgentName] = useState('');

  useEffect(() => {
    const storedAgentName = localStorage.getItem('agentName');
    if (storedAgentName) {
      setAgentName(storedAgentName);
    } else {
      handleSetAgentName();
    }
  }, []);

  const handleSetAgentName = () => {
    const name = prompt('Please enter your name:');
    if (name) {
      setAgentName(name);
      localStorage.setItem('agentName', name);
    }
  };

  const handleUpdateCustomerAgent = (message, newName) => {
    const updatedMessage = { ...message, customerName: newName };
    setSelectedMessage(updatedMessage);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r">
        <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
          <div>
            <span className="font-bold">Agent:</span> {agentName}
            <button
              onClick={handleSetAgentName}
              className="ml-2 text-sm text-blue-500 hover:underline"
            >
              Change
            </button>
          </div>
        </div>
        <MessageList
          onSelectMessage={setSelectedMessage}
          selectedMessageId={selectedMessage?.id}
          onUpdateCustomerAgent={handleUpdateCustomerAgent}
        />
      </div>
      <div className="w-2/3">
        <MessageDetail
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      </div>
    </div>
  );
};

export default AgentDashboard;