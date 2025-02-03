import { useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useCalendarStore } from '../store';
import { platformColors } from '../utils';
import { CalendarEvent } from '../types';

export const Calendar = () => {
  const { posts, selectedPlatforms } = useCalendarStore();
  const today = new Date().toISOString().split('T')[0];
  
  const events = posts
    .filter((post) => selectedPlatforms.includes(post.platform))
    .map((post) => {
      const isPast = post.date < today;
      const isToday = post.date === today;
      
      return {
        id: post.id,
        title: post.title,
        start: `${post.date}T${post.time}`,
        platform: post.platform,
        content: post.content,
        mediaUrl: post.mediaUrl,
        mediaType: post.mediaType,
        backgroundColor: platformColors[post.platform].bg,
        borderColor: platformColors[post.platform].border,
        isPast,
        isToday,
        classNames: [
          isPast ? 'past-event' : '',
          isToday ? 'today-event' : '',
        ],
        opacity: isPast ? 0.7 : 1,
      };
    });

  const handleEventDrop = useCallback((info: any) => {
    const event = info.event as CalendarEvent;
    const newDate = event.start.toISOString().split('T')[0];
    const newTime = event.start.toISOString().split('T')[1].substring(0, 5);
    
    useCalendarStore.getState().updatePost({
      id: event.id,
      title: event.title,
      content: event.content,
      platform: event.platform,
      date: newDate,
      time: newTime,
      mediaUrl: event.mediaUrl,
      mediaType: event.mediaType,
    });
  }, []);

  return (
    <div className="h-[800px] bg-white p-4 rounded-lg shadow-lg">
      <style>
        {`
          .past-event {
            filter: grayscale(30%);
          }
          .today-event {
            font-weight: 600 !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .fc-event {
            transition: all 0.2s ease;
          }
        `}
      </style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        editable={true}
        droppable={true}
        events={events}
        eventDrop={handleEventDrop}
        height="100%"
        eventContent={(eventInfo) => {
          const event = eventInfo.event;
          return (
            <div className="p-1">
              <div className="font-medium">{event.title}</div>
              {event.extendedProps.mediaType === 'image' && (
                <div className="w-full h-20 mt-1 rounded overflow-hidden">
                  <img
                    src={event.extendedProps.mediaUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};