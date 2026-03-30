import { getBannerAdmin } from '@/lib/queries/banner';
import { upsertBanner } from '@/lib/actions/banner';
import { BannerForm } from '@/components/admin/banner-form';
import type { TranslatableField } from '@/lib/i18n-content';

export default async function AdminBannerPage() {
  const banner = await getBannerAdmin();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Home Banner</h1>
        <p className="text-gray-500 text-sm mt-1">Configure the banner displayed at the top of the homepage.</p>
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
