import { ReactNode } from 'react';

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 bg-blue-50 rounded-lg">
      <div className="mb-4">{icon}</div>
      <h2 className="text-2xl font-bold text-blue-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6 text-center">{description}</p>
      {action}
    </div>
  );
}
