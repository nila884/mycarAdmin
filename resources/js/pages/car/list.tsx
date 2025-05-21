
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const list = () => {
  const breadcrumbs: BreadcrumbItem[] = [
      {
          title: 'Car ',
          href: '/cars',
      },
  ];

  return (
           <AppLayout breadcrumbs={breadcrumbs}>
               <Head title="Appearance settings" />
   
           
           </AppLayout>
  )
}

export default list
