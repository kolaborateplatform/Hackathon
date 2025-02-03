import { Metadata } from 'next';
import CalendarView from './calendar-view';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Project Calendar',
  description: 'View and manage your project calendar',
};

export default async function ProjectCalendarPage({ params }: { params: { projectId: string } }) {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  return <CalendarView params={params} />;
}