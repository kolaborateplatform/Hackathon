import { useCalendarStore } from '../store';
import { platformColors } from '../utils';
import { Calendar, Clock, Image, Video } from 'lucide-react';

export const ListView = () => {
  const { posts, selectedPlatforms } = useCalendarStore();
  const today = new Date().toISOString().split('T')[0];
  
  const filteredPosts = posts
    .filter((post) => selectedPlatforms.includes(post.platform))
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  return (
    <div className="space-y-4">
      {filteredPosts.map((post) => {
        const isPast = post.date < today;
        const isToday = post.date === today;
        
        return (
          <div
            key={post.id}
            className={`bg-white p-4 rounded-lg shadow-md border-l-4 transition-all ${
              isPast ? 'opacity-70' : ''
            } ${isToday ? 'border-l-[6px] shadow-lg' : ''}`}
            style={{ borderLeftColor: platformColors[post.platform].bg }}
          >
            <h3 className={`text-lg ${isToday ? 'font-bold' : 'font-semibold'}`}>
              {post.title}
            </h3>
            
            {post.mediaUrl && (
              <div className="mt-3">
                {post.mediaType === 'image' ? (
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <img
                      src={post.mediaUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Video size={20} />
                    <span>Video content</span>
                  </div>
                )}
              </div>
            )}
            
            <p className="text-gray-600 mt-2">{post.content}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{post.time}</span>
              </div>
              <span
                className="px-2 py-1 rounded-full text-white text-xs"
                style={{ backgroundColor: platformColors[post.platform].bg }}
              >
                {post.platform}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};