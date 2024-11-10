import React, { useState } from 'react';
import MessageList from './MessageList';
import MessageDetail from './MessageDetail';
const AgentDashboard = () => {
    const [selectedMessage, setSelectedMessage] = useState(null);
  
    return (
      <div className="flex h-screen">
        <div className="w-1/3 border-r">
          <MessageList
            onSelectMessage={setSelectedMessage}
            selectedMessageId={selectedMessage?.id}
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