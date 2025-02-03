import ProjectDetailsClient from './ProjectDetailsClient';

export default function ProjectPage({ params }: { params: { id: string } }) {
  return <ProjectDetailsClient projectId={params.id} />;
}