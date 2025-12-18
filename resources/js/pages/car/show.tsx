// @/pages/car/create.tsx
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {  CarDetailData} from "@/lib/object"; // Import Car type
import CarShowDetails from "@/components/car/car-show-details";




interface CreateCarPageProps {
  car: CarDetailData
}

export default function Show({ car}: CreateCarPageProps) {

console.log(car);

  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "car Details",
      href: car ? route('car.show', car.id) : "#",
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={"Car details"} />
      <CarShowDetails
        car={car}
      />
    </AppLayout>
  );
}
