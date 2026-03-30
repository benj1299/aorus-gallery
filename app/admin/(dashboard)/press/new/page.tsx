import Link from 'next/link';
import { createPressArticle } from '@/lib/actions/press';
import { PressForm } from '@/components/admin/press-form';

export default function NewPressPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/press" className="text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to press
        </Link>
        <h1 className="text-2xl font-bold mt-2">New Press Article</h1>
      </div>
      <PressForm action={createPressArticle} />
    </div>
  );
}
