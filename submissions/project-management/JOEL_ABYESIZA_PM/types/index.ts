export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  members: Member[];
  tasks: Task[];
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: Member | null;
  dueDate: string;
  createdAt: string;
}