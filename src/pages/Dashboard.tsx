import React from 'react';
import ProjectsOverview from '../components/Dashboard/ProjectsOverview';
import RecentActivity from '../components/Dashboard/RecentActivity';
import { useToast } from '../hooks/useToast';

const Dashboard = () => {
  const { showToast } = useToast();

  const handleNewProject = () => {
    showToast('New project feature coming soon!', 'info');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
        <button 
          onClick={handleNewProject}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          New Project
        </button>
      </div>

      <ProjectsOverview />
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Deadlines</h3>
          {/* Deadlines component will go here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;