import { useState } from 'react';
import CalendarView from './CalendarView';
import ListView from './ListView';
import PlatformSelector from './PlatformSelector';

export default function Calendar() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded ${
              view === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded ${
              view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            List
          </button>
        </div>
        <PlatformSelector
          selected={selectedPlatform}
          onChange={setSelectedPlatform}
        />
      </div>
      
      {view === 'calendar' ? (
        <CalendarView platform={selectedPlatform} />
      ) : (
        <ListView platform={selectedPlatform} />
      )}
    </div>
  );
} 