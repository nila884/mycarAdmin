// @/pages/car/create.tsx
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import CreateCarForm from "@/components/car/create-form";
import { Car,Brand,Feature,FuelType,Seller,CarModel,Category, Version, CarDetail } from "@/lib/object"; // Import Car type




interface CreateCarPageProps {
  car?: CarDetail; // Optional car prop for editing
  brands: Brand[];
  carModels: CarModel[];
  categories: Category[];
  fuelTypes: FuelType[];
  versions: Version[];
  sellers: Seller[];
  features: Feature[];
}

export default function Create({ car, brands, carModels, categories, fuelTypes, versions, sellers, features }: CreateCarPageProps) {



  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: car ? `Edit Car: ${car.brand_name} ${car.model_name}` : 'Add New Car',
      href: car ? route('car.edit', car.id) : route('car.create'),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={car ? "Edit Car Form" : "Add New Car Form"} />
      <CreateCarForm
        car={car}
        brands={brands}
        carModels={carModels}
        categories={categories}
        fuelTypes={fuelTypes}
        versions={versions}
        sellers={sellers}
        features={features}
      />
    </AppLayout>
  );
}
