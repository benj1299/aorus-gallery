import { cardStyles } from './form-styles';

interface FormCardProps {
  title: string;
  children: React.ReactNode;
}

export function FormCard({ title, children }: FormCardProps) {
  return (
    <div className={cardStyles}>
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}
