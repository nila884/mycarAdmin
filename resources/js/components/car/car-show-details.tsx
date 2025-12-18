import { CarDetailData } from '@/lib/object';
import React from 'react';

// Define the structure of the car data expected from the backend's read method


// Define the props for the CarShowDetails component
interface CarShowDetailsProps {
    car: CarDetailData;
}

const CarShowDetails: React.FC<CarShowDetailsProps> = ({ car }) => {    
    if (!car) {
        return <div className="text-center py-10 text-gray-500">Car details not found.</div>;
    }

    const formatFeatureName = (name: string) => {
        return name.replace(/_/g, ' ').replace(/\b\w/g, s => s.toUpperCase());
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 font-inter">
            <div className="bg-white overflow-hidden">
                <div className="relative h-96 flex items-center justify-center">
                    
                   {car.images.map((image) => {
        if (image.is_main) {
            return (
                <img
                    key={image.id}
                    src={image.image_path} 
                    alt={`${car.version.car_model.brand.brand_name} ${car.version.car_model.model_name}`}
                    className="object-contain h-full w-full rounded-t-xl"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://placehold.co/800x400/E0E0E0/616161?text=Image+Not+Found`;
                    }}
                />
            );
        }
        return null;
    })}
    {car.image_main === null && <div className="text-gray-400 text-lg">No Main Image Available</div>}
                </div>

                <div className="p-6 space-y-8">
                    <div className="border-b pb-6 border-gray-200">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            {car.version.car_model.brand.brand_name} {car.version.car_model.model_name} {car.version.version_name}
                        </h1>
                        <p className="text-2xl font-semibold text-primary-600 mb-4">${car.price.price.toLocaleString()}</p>
                        {car.price.discount  && (
                           <>
                            <p className="text-lg text-gray-600">
                                Promo Discount: <span className="font-medium">-${car.price.discount.toLocaleString()}</span>
                            </p>
                             <p className="text-3xl font-semibold text-primary-600 mb-4">${car.price.final_price.toLocaleString()}</p>
                           </>
                        )}
                       
                        <div className="flex flex-wrap gap-4   text-sm mt-4">
                            <span className="bg-gray-100 px-3 py-1 rounded-full">Mileage: {car.spect.mileage} KM</span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full">Color: {car.spect.color}</span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full">Status: {car.spect.status ? 'New' : 'Used'}</span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full">Transmission: {car.spect.transmission}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-4">
                            <h3 className="text-lg font-semibold    mb-2">General Info</h3>
                            <ul className="text-sm   space-y-1">
                                <li><strong>Category:</strong> {car.category.category_name}</li>
                                <li><strong>Fuel Type:</strong> {car.fuel_type.fuel_type}</li>
                                <li><strong>Seller:</strong> {car.seller.seller_name}</li>
                                <li><strong>Chassis No.:</strong> {car.spect.chassis_number}</li>
                                <li><strong>Registration Year:</strong> {car.spect.registration_year}</li>
                                <li><strong>Manufacture Year:</strong> {car.spect.manufacture_year}</li>
                                <li><strong>Weight:</strong> {car.spect.weight} KG</li>
                                <li><strong>Steering:</strong> {car.spect.steering}</li>
                                <li><strong>Seating Capacity:</strong> {car.spect.seating_capacity}</li>
                                <li><strong>Doors:</strong> {car.spect.doors}</li>
                                <li><strong>Location:</strong> {car.location}</li>
                            </ul>
                        </div>

                        <div className="p-4  ">
                            <h3 className="text-lg font-semibold    mb-2">Engine & Performance</h3>
                            <ul className="text-sm   space-y-1">
                                <li><strong>Engine Code:</strong> {car.spect.engine_code || 'N/A'}</li>
                                <li><strong>Engine Size:</strong> {car.spect.engine_size ? `${car.spect.engine_size}L` : 'N/A'}</li>
                                <li><strong>Model Code:</strong> {car.spect.model_code || 'N/A'}</li>
                                <li><strong>Wheel Drive:</strong> {car.spect.wheel_driver || 'N/A'}</li>
                                <li><strong>M³:</strong> {car.spect.m_3 || 'N/A'}</li>
                            </ul>
                        </div>

                        <div className="p-4  ">
                            <h3 className="text-lg font-semibold  mb-2">Other Details</h3>
                            <ul className="text-sm space-y-1">
                                <li><strong>Dimensions:</strong>
                                <ul className="ml-4">
                               <li><strong>Height:</strong> {car.spect.dimensions.height_mm|| 'N/A'}mm</li>
                               <li><strong>Width:</strong> {car.spect.dimensions.width_mm|| 'N/A'}mm</li>
                               <li><strong>Length:</strong> {car.spect.dimensions.length_mm|| 'N/A'}mm</li>
                                </ul>
                                </li>
                                <li><strong>Interior color:</strong> {car.interior_color?.name|| 'N/A'} <span className="block w-5 h-5" style={{ backgroundColor: car.interior_color?.hex_code || car.interior_color?.name }}></span></li>
                                <li><strong>Exterior color:</strong> {car.exterior_color?.name|| 'N/A'} <span className="block w-5 h-5" style={{ backgroundColor: car.exterior_color?.hex_code || car.exterior_color?.name }}></span></li>
                                
                                <li><strong>Publication Status:</strong> {car.publication_status}</li>
                                <li><strong>Selling Status:</strong> {car.car_selling_status}</li>
                                <li><strong>Added On:</strong> {new Date(car.created_at).toLocaleDateString()}</li>
                                <li><strong>Last Updated:</strong> {new Date(car.updated_at).toLocaleDateString()}</li>
                            </ul>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="border-t pt-6 border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                           {car.features.map((feature)=>(
                            <div key={feature.id} className="flex flex-col items-center p-4  rounded-lg bg-gray-50">
                                <img
                                src={feature.icon}
                                className="w-10 h-10 mb-2"
                                alt='no icon'
                               />
                                <span className="text-sm">{ formatFeatureName (feature.feature_name)}</span>
                            </div>
                           ))}
                          
                        </div>
                    </div>

                    {car.images && car.images.length > 0 && (
                        <div className="border-t pt-6 border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {car.images.map((image, index) => (
                                    <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                                        <img
                                            src={image.image_path}
                                            alt={`Car gallery image ${index + 1}`}
                                            className="object-cover w-full h-full"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = `https://placehold.co/400x225/E0E0E0/616161?text=Image+Not+Found`;
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CarShowDetails;
