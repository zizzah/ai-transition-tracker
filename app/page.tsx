import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Calendar, TrendingUp, Briefcase, Code, Users, BookOpen } from 'lucide-react';

export default function AITransitionTracker() {
  const [currentDay, setCurrentDay] = useState(1);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [dailyTasks, setDailyTasks] = useState<Record<number, Record<string, boolean>>>({});
  const [applications, setApplications] = useState<Array<{ id: number; company: string; role: string; date: string; status: string }>>([]);

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedStart = localStorage.getItem('start-date');
      const storedTasks = localStorage.getItem('daily-tasks');
      const storedApps = localStorage.getItem('applications');
      
      if (storedStart) {
        const start = JSON.parse(storedStart);
        setStartDate(start);
        
        // Calculate current day
        const daysDiff = Math.floor((new Date().getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1;
        setCurrentDay(Math.min(Math.max(daysDiff, 1), 30));
      }
      
      if (storedTasks) {
        setDailyTasks(JSON.parse(storedTasks));
      }
      
      if (storedApps) {
        setApplications(JSON.parse(storedApps));
      }
    } catch (error) {
      console.log('No previous data found, starting fresh');
    }
  };

  const saveData = async () => {
    try {
      localStorage.setItem('start-date', JSON.stringify(startDate));
      localStorage.setItem('daily-tasks', JSON.stringify(dailyTasks));
      localStorage.setItem('applications', JSON.stringify(applications));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    if (startDate) {
      saveData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyTasks, applications, startDate]);

  const handleStartChallenge = () => {
    const today = new Date().toISOString();
    setStartDate(today);
    setCurrentDay(1);
  };

  const toggleTask = (day: number, taskId: string) => {
    setDailyTasks(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [taskId]: !prev[day]?.[taskId]
      }
    }));
  };

  const getDayTasks = (day: number): Record<string, boolean> => {
    return dailyTasks[day] || ({} as Record<string, boolean>);
  };

  const getDayProgress = (day: number): number => {
    const tasks = getDayTasks(day);
    const completed = Object.values(tasks).filter(Boolean).length;
    return (completed / 5) * 100;
  };

  const getTotalProgress = (): number => {
    let totalCompleted = 0;
    const totalTasks = currentDay * 5;
    
    for (let i = 1; i <= currentDay; i++) {
      const tasks = getDayTasks(i);
      totalCompleted += Object.values(tasks).filter(Boolean).length;
    }
    
    return Math.round((totalCompleted / totalTasks) * 100);
  };

  const addApplication = () => {
    const company = prompt('Company name:');
    const role = prompt('Role:');
    
    if (company && role) {
      setApplications(prev => [...prev, {
        id: Date.now(),
        company,
        role,
        date: new Date().toLocaleDateString(),
        status: 'Applied'
      }]);
    }
  };

  const getWeekNumber = (day: number) => Math.ceil(day / 7);

  const taskDefinitions = [
    { id: 'learning', label: 'Technical Learning (90 min)', icon: BookOpen },
    { id: 'networking', label: 'Industry Intelligence (45 min)', icon: Users },
    { id: 'portfolio', label: 'Portfolio Project (60 min)', icon: Code },
    { id: 'applications', label: 'Job Applications (30 min)', icon: Briefcase },
    { id: 'content', label: 'Knowledge Synthesis (30 min)', icon: TrendingUp }
  ];

  if (!startDate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              30-Day AI Career Transition
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Transform from Software Engineer to AI Engineer with daily focused action
            </p>
            <div className="bg-indigo-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">Your Daily Commitment:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>📚 90 min - Technical skill development</li>
                <li>🤝 45 min - Networking & market research</li>
                <li>💻 60 min - Portfolio project building</li>
                <li>📝 30 min - Job applications (2 daily)</li>
                <li>✍️ 30 min - Content creation & learning</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-indigo-200">
                <p className="font-semibold text-indigo-900">Total: 4.5 hours daily</p>
              </div>
            </div>
            <button
              onClick={handleStartChallenge}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Start My 30-Day Journey
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Day {currentDay} of 30</h1>
              <p className="text-gray-600">Week {getWeekNumber(currentDay)} - Keep pushing forward!</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-indigo-600">{getTotalProgress()}%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(currentDay / 30) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Today's Tasks */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Today&apos;s Tasks</h2>
              
              <div className="space-y-3">
                {taskDefinitions.map(task => {
                  const Icon = task.icon;
                  const isCompleted = getDayTasks(currentDay)[task.id];
                  
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(currentDay, task.id)}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isCompleted 
                          ? 'bg-green-50 border-green-300' 
                          : 'bg-gray-50 border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      )}
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className={`font-medium ${isCompleted ? 'text-green-900' : 'text-gray-700'}`}>
                        {task.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-indigo-900">Today&apos;s Progress</span>
                  <span className="text-sm font-bold text-indigo-600">{Math.round(getDayProgress(currentDay))}%</span>
                </div>
                <div className="w-full bg-indigo-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getDayProgress(currentDay)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Week History */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Progress History</h2>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: Math.min(currentDay, 30) }, (_, i) => i + 1).map(day => {
                  const progress = getDayProgress(day);
                  return (
                    <div key={day} className="text-center">
                      <div 
                        className={`w-full h-16 rounded-lg flex items-center justify-center font-semibold text-sm ${
                          progress === 100 ? 'bg-green-500 text-white' :
                          progress >= 60 ? 'bg-yellow-400 text-gray-900' :
                          progress > 0 ? 'bg-orange-400 text-white' :
                          'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {day}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{Math.round(progress)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Applications Tracker */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Applications</h2>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {applications.length}/46
                </span>
              </div>

              <button
                onClick={addApplication}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mb-4"
              >
                + Add Application
              </button>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {applications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No applications yet</p>
                  </div>
                ) : (
                  applications.slice().reverse().map(app => (
                    <div key={app.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="font-semibold text-gray-900 text-sm">{app.company}</div>
                      <div className="text-xs text-gray-600">{app.role}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{app.date}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Days Completed</span>
                  <span className="font-bold text-gray-900">{currentDay - 1}/30</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Applications</span>
                  <span className="font-bold text-gray-900">{applications.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Week</span>
                  <span className="font-bold text-gray-900">Week {getWeekNumber(currentDay)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Days Remaining</span>
                  <span className="font-bold text-indigo-600">{30 - currentDay + 1}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Day Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
              disabled={currentDay === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous Day
            </button>
            
            <span className="text-gray-600 font-medium">
              Navigate to any day
            </span>
            
            <button
              onClick={() => setCurrentDay(Math.min(30, currentDay + 1))}
              disabled={currentDay === 30}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Day →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}