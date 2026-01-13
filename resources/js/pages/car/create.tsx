// @/pages/car/create.tsx
import CreateCarForm from '@/components/car/create-form';
import AppLayout from '@/layouts/app-layout';
import { Brand, CarDetailData, CarModel, Category, Color, CountryObject, Feature, FuelType, Seller, Version } from '@/lib/object'; // Import Car type
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

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
    countries: CountryObject[];
}

export default function Create({
    car,
    brands,
    carModels,
    categories,
    fuelTypes,
    versions,
    sellers,
    features,
    colors,
    countries,
}: CreateCarPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: car ? `Edit Car: ${car.version.car_model.brand.brand_name} ${car.version.car_model.model_name}` : 'Add New Car',
            href: car ? route('car.edit', car.id) : route('car.create'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={car ? 'Edit Car Form' : 'Add New Car Form'} />
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
                countries={countries}
            />
        </AppLayout>
    );
}
