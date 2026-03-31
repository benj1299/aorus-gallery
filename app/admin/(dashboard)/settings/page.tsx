import { getSiteSettings } from '@/lib/queries/settings';
import { updateSiteSettings } from '@/lib/actions/settings';
import { FormSwitch } from '@/components/admin/form-switch';
import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb';

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Paramètres' }]} />
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Paramètres du site</h1>

      <form action={updateSiteSettings} className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">Pages publiques</h3>
          </div>
          <div className="p-6 space-y-5">
            <FormSwitch
              name="showExhibitions"
              label="Afficher la page Expositions"
              description="Affiche le lien Expositions dans le menu de navigation"
              defaultChecked={settings.showExhibitions}
            />
            <div className="h-px bg-gray-100" />
            <FormSwitch
              name="showBanner"
              label="Afficher la bannière d'accueil"
              description="Affiche la bannière visuelle sur la page d'accueil (sous le hero)"
              defaultChecked={settings.showBanner}
            />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
