import { TaskDetails } from './TaskDetails';

export default function TaskPage({ 
  params 
}: { 
  params: { id: string; taskIndex: string } 
}) {
  return (
    <TaskDetails 
      projectId={params.id} 
      taskIndex={parseInt(params.taskIndex)} 
    />
  );
} 