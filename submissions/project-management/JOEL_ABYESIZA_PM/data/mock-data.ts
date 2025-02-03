import { Project, Member, Task } from '@/types';

export const members: Member[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60',
  },
];

export const projects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design and improved UX',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    members: [members[0], members[1]],
    tasks: [
      {
        id: '1',
        title: 'Design Homepage',
        description: 'Create new homepage design with focus on conversion',
        status: 'in-progress',
        priority: 'high',
        assignee: members[1],
        dueDate: '2024-04-15',
        createdAt: '2024-03-01',
      },
      {
        id: '2',
        title: 'Implement Blog Section',
        description: 'Develop blog section with categories and search',
        status: 'todo',
        priority: 'medium',
        assignee: members[0],
        dueDate: '2024-05-01',
        createdAt: '2024-03-01',
      },
    ],
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Develop cross-platform mobile app for customer engagement',
    status: 'active',
    startDate: '2024-02-15',
    endDate: '2024-08-31',
    members: [members[0], members[2]],
    tasks: [
      {
        id: '3',
        title: 'User Authentication',
        description: 'Implement secure user authentication system',
        status: 'completed',
        priority: 'high',
        assignee: members[2],
        dueDate: '2024-03-15',
        createdAt: '2024-02-15',
      },
    ],
  },
];