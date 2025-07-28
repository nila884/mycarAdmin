import { CarDetail } from '@/lib/object';
import React from 'react';

// Define the structure of the car data expected from the backend's read method


// Define the props for the CarShowDetails component
interface CarShowDetailsProps {
    car: CarDetail;
}

const CarShowDetails: React.FC<CarShowDetailsProps> = ({ car }) => {
   
    if (!car) {
        return <div className="text-center py-10 text-gray-500">Car details not found.</div>;
    }
    // Helper to format feature names for display
    const formatFeatureName = (name: string) => {
        return name.replace(/_/g, ' ').replace(/\b\w/g, s => s.toUpperCase());
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 font-inter">
            <div className="bg-white overflow-hidden">
                {/* Main Image Section */}
                <div className="relative h-96 flex items-center justify-center">
                    {car.image_url ? (
                        <img
                            src={car.image_url}
                            alt={`${car.brand_name} ${car.model_name}`}
                            className="object-contain h-full w-full rounded-t-xl"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `https://placehold.co/800x400/E0E0E0/616161?text=Image+Not+Found`;
                            }}
                        />
                    ) : (
                        <div className="text-gray-400 text-lg">No Main Image Available</div>
                    )}
                </div>

                <div className="p-6 space-y-8">
                    {/* Basic Info Section */}
                    <div className="border-b pb-6 border-gray-200">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            {car.brand_name} {car.model_name} {car.version_name}
                        </h1>
                        <p className="text-2xl font-semibold text-primary-600 mb-4">${car.price.toLocaleString()}</p>
                        {car.promo > 0 && (
                            <p className="text-lg text-gray-600">
                                Promo Discount: <span className="font-medium">${car.promo.toLocaleString()}</span>
                            </p>
                        )}
                        <div className="flex flex-wrap gap-4   text-sm mt-4">
                            <span className="bg-gray-100 px-3 py-1 rounded-full">Mileage: {car.mileage} KM</span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full">Color: {car.color}</span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full">Status: {car.status ? 'New' : 'Used'}</span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full">Transmission: {car.transmission}</span>
                        </div>
                    </div>

                    {/* Detailed Specifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-4">
                            <h3 className="text-lg font-semibold    mb-2">General Info</h3>
                            <ul className="text-sm   space-y-1">
                                <li><strong>Category:</strong> {car.category}</li>
                                <li><strong>Fuel Type:</strong> {car.fuel_type}</li>
                                <li><strong>Seller:</strong> {car.seller_name}</li>
                                <li><strong>Chassis No.:</strong> {car.chassis_number}</li>
                                <li><strong>Registration Year:</strong> {car.registration_year}</li>
                                <li><strong>Manufacture Year:</strong> {car.manufacture_year}</li>
                                <li><strong>Weight:</strong> {car.weight} KG</li>
                                <li><strong>Steering:</strong> {car.streering}</li>
                                <li><strong>Seating Capacity:</strong> {car.steating_capacity}</li>
                                <li><strong>Doors:</strong> {car.doors}</li>
                                <li><strong>Location:</strong> {car.location}</li>
                            </ul>
                        </div>

                        <div className="p-4  ">
                            <h3 className="text-lg font-semibold    mb-2">Engine & Performance</h3>
                            <ul className="text-sm   space-y-1">
                                <li><strong>Engine Code:</strong> {car.engine_code || 'N/A'}</li>
                                <li><strong>Engine Size:</strong> {car.engine_size ? `${car.engine_size}L` : 'N/A'}</li>
                                <li><strong>Model Code:</strong> {car.model_code || 'N/A'}</li>
                                <li><strong>Wheel Drive:</strong> {car.wheel_driver || 'N/A'}</li>
                                <li><strong>M³:</strong> {car.m_3 || 'N/A'}</li>
                            </ul>
                        </div>

                        <div className="p-4  ">
                            <h3 className="text-lg font-semibold  mb-2">Other Details</h3>
                            <ul className="text-sm space-y-1">
                                <li><strong>Dimensions:</strong> {car.dimensions || 'N/A'}</li>
                                <li><strong>Publication Status:</strong> {car.publication_status}</li>
                                <li><strong>Selling Status:</strong> {car.car_sells_status}</li>
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
                            <div key={feature.id}>
                                <img
                                src={feature.icon}
                                alt='no icon'
                               />
                                <span>{feature.feature_name}</span>
                            </div>
                           ))}
                          
                        </div>
                    </div>

                    {/* Additional Images Section */}
                    {car.existing_images && car.existing_images.length > 0 && (
                        <div className="border-t pt-6 border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {car.existing_images.map((image, index) => (
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
