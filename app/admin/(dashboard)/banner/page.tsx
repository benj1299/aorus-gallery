import Link from 'next/link';
import { getBannerAdmin } from '@/lib/queries/banner';
import { upsertBanner } from '@/lib/actions/banner';
import { BannerForm } from '@/components/admin/banner-form';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import type { TranslatableField } from '@/lib/i18n-content';

export default async function AdminBannerPage() {
  const banner = await getBannerAdmin();

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/admin">Administration</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Bannière</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bannière d&apos;accueil</h1>
        <p className="text-gray-500 text-sm mt-1">Configurez la bannière affichée en haut de la page d&apos;accueil.</p>
      </div>

      <BannerForm
        action={upsertBanner}
        defaultValues={banner ? {
          title: banner.title as TranslatableField,
          subtitle: banner.subtitle as TranslatableField | null,
          imageUrl: banner.imageUrl,
          linkUrl: banner.linkUrl,
          visible: banner.visible,
        } : undefined}
      />
    </div>
  );
}
