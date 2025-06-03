import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import CreateForm from "@/components/car/create-form";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cars Create form',
        href: '/car/create',
    },
];
export default function list() {

   

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
    <Head title="Add new car form" />
  <CreateForm />
    </AppLayout>

  )
}