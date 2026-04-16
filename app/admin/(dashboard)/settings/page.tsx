import { getSiteSettings } from '@/lib/queries/settings';
import { updateSiteSettings } from '@/lib/actions/settings';
import { getTranslations } from 'next-intl/server';
import { FormSwitch } from '@/components/admin/form-switch';
import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb';

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  const t = await getTranslations('admin.settings');
  const tf = await getTranslations('admin.forms');
  const tc = await getTranslations('admin.cards');

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: t('title') }]} />
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('title')}</h1>

      <form action={updateSiteSettings} className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">{tc('publicPages')}</h3>
          </div>
          <div className="p-6 space-y-5">
            <FormSwitch
              name="showExhibitions"
              label={t('showExhibitions')}
              description={t('showExhibitionsDesc')}
              defaultChecked={settings.showExhibitions}
            />
            <div className="h-px bg-gray-100" />
            <FormSwitch
              name="showBanner"
              label={t('showBanner')}
              description={t('showBannerDesc')}
              defaultChecked={settings.showBanner}
            />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            {tf('save')}
          </button>
        </div>
      </form>
    </div>
  );
}
