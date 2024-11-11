import React from 'react';

const activities = [
  {
    id: 1,
    project: 'E-commerce Platform',
    client: 'TechCorp Inc.',
    action: 'Invoice generated',
    time: '2 hours ago',
    amount: '$2,500'
  },
  {
    id: 2,
    project: 'Mobile App',
    client: 'StartupX',
    action: 'Milestone completed',
    time: '5 hours ago',
    amount: null
  },
  {
    id: 3,
    project: 'CRM System',
    client: 'Enterprise Solutions',
    action: 'New comment',
    time: '1 day ago',
    amount: null
  }
];

const RecentActivity = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        <div className="mt-6 flow-root">
          <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
            {activities.map((activity) => (
              <li key={activity.id} className="py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.project}</p>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.client}</p>
                      <span className="mx-2 text-gray-400 dark:text-gray-600">·</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.action}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {activity.amount && (
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.amount}</p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;