// @/pages/car/create.tsx
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import CreateCarForm from "@/components/car/create-form";
import { Brand,Feature,FuelType,Seller,CarModel,Category, Version,  Color, CarDetailData } from "@/lib/object"; // Import Car type




interface CreateCarPageProps {
  car?: CarDetailData; // Optional car prop for editing
  brands: Brand[];
  carModels: CarModel[];
  categories: Category[];
  fuelTypes: FuelType[];
  versions: Version[];
  sellers: Seller[];
  features: Feature[];
  colors: Color[];
}

export default function Create({ car, brands, carModels, categories, fuelTypes, versions, sellers, features,colors }: CreateCarPageProps) {



  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: car ? `Edit Car: ${car.version.car_model.brand.brand_name} ${car.version.car_model.model_name}` : 'Add New Car',
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
        colors={colors}
      />
    </AppLayout>
  );
}
