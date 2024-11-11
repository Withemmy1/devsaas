import React from 'react';
import { BarChart, Clock, AlertTriangle } from 'lucide-react';

const ProjectsOverview = () => {
  const stats = [
    {
      icon: BarChart,
      label: 'Active Projects',
      value: '12',
      change: '+2.5%',
      changeType: 'positive'
    },
    {
      icon: Clock,
      label: 'Pending Reviews',
      value: '4',
      change: '-1',
      changeType: 'neutral'
    },
    {
      icon: AlertTriangle,
      label: 'Expiring Soon',
      value: '3',
      change: '+2',
      changeType: 'negative'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${
              stat.changeType === 'positive' ? 'bg-green-50 dark:bg-green-900/20' :
              stat.changeType === 'negative' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/50'
            }`}>
              <stat.icon className={`w-6 h-6 ${
                stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
                stat.changeType === 'negative' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
              }`} />
            </div>
          </div>
          <div className="mt-4">
            <span className={`text-sm font-medium ${
              stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
              stat.changeType === 'negative' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {stat.change} from last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsOverview;