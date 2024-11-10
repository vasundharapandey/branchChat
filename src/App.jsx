
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomerForm from './components/CustomerForm';
import AgentDashboard from './components/AgentDashboard';
import { Link } from 'react-router-dom';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <div className="text-xl font-bold">Branch Support</div>
              <div className="space-x-4">
                <Link to="/" className="hover:text-gray-300">Customer Support</Link>
                <Link to="/agent" className="hover:text-gray-300">Agent Dashboard</Link>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<CustomerForm />} />
            <Route path="/agent" element={<AgentDashboard />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;