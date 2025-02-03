import React, { useState } from 'react';
import { Calendar } from './components/Calendar';
import { ListView } from './components/ListView';
import { PlatformFilter } from './components/PlatformFilter';
import { CreatePostForm } from './components/CreatePostForm';
import { Modal } from './components/Modal';
import { useCalendarStore } from './store';
import { LayoutList, CalendarDays, Plus } from 'lucide-react';
import { cn } from './utils';

function App() {
  const { viewType, setViewType } = useCalendarStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Content Calendar</h1>
          <div className="flex items-center gap-4">
            <PlatformFilter />
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>New Post</span>
            </button>
            <div className="bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewType('calendar')}
                className={cn(
                  'p-2 rounded transition-colors',
                  viewType === 'calendar' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                )}
              >
                <CalendarDays size={20} />
              </button>
              <button
                onClick={() => setViewType('list')}
                className={cn(
                  'p-2 rounded transition-colors',
                  viewType === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                )}
              >
                <LayoutList size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {viewType === 'calendar' ? <Calendar /> : <ListView />}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Post"
      >
        <CreatePostForm onClose={() => setIsCreateModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default App;