import Link from 'next/link';

interface Props {
  items: { label: string; href?: string }[];
}

export function AdminBreadcrumb({ items }: Props) {
  return (
    <nav className="text-sm text-gray-500">
      <ol className="flex items-center">
        <li>
          <Link href="/admin" className="text-gray-500 hover:text-gray-900 transition-colors">
            Administration
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            <span className="text-gray-300 mx-2">/</span>
            {item.href ? (
              <Link href={item.href} className="text-gray-500 hover:text-gray-900 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
