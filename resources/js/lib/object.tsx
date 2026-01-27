export interface Dimensions {
    length_mm: number | null;
    width_mm: number | null;
    height_mm: number | null;
    // Add any other keys you expect in the JSON column
}
// export type Car = {
//     id:string;

//     car_brand_id: Brand;
//     version_id: Version;
//     category_id: Category;
//     fuel_type_id: FuelType;
//     seller_id: Seller;
//     mileage: number | null;
//     chassis_number: string;
//     registration_year: string | null;
//     manifactured_year: string | null;
//     color: string;
//     status: boolean | null;
//     transmission: 'automatic' | 'manual' | undefined;
//     streering: 'right' | 'left' | undefined;
//     seating_capacity: string | null;
//     engine_code: string | null;
//     engine_size: string | null;
//     model_code: string | null;
//     wheel_driver: string | null;
//     m_3: string | null;
//     doors: string | null;
//     dimensions: Dimensions,
//     location: string | null;
//     weight: string | null;
//     price: string | null;
//     promo: string | null;
//     publication_status: string;
//     features:Feature[];
//     image: File | null;
//     images: File[];
// };

// export interface CarDetail {
//     id: string;
//     version: Version;
//     category_id: string | null;
//     category: string;
//     fuel_type_id: string | null;
//     fuel_type: string;
//     version_id: string | null;
//     version_name: string;
//     seller_id: string | null;
//     seller_name: string;
//     mileage: number;
//     chassis_number: string;
//     registration_year: string | null;
//     manifactured_year: string | null;
//     steering: string|null;
//     price: number;
//     promo: number;
//     color: string;
//     weight: string | null;
//     status: boolean; // true for new, false for used
//     transmission: string;
//     seating_capacity: string | null;
//     engine_code: string | null;
//     engine_size: string | null;
//     model_code: string | null;
//     wheel_driver: string | null;
//     m_3: string | null;
//     doors: string | null;
//     dimensions: Dimensions,
//     location: string | null;
//     publication_status: string;
//     car_selling_status: string;
//     features: Feature[];
//     image_url: string | null; // Main image URL
//     images: string[]; // Additional image URLs
//     existing_images?: Image[];
//     images_to_delete: []; // Initialize empty, will be populated on removal
//     created_at: string;
//     updated_at: string;
// }

export interface Price {
    id: string;
    car_id: string;
    price: number;
    discount: number;
    discount_type: string;
    is_current: boolean;
    final_price: string;
}

export interface CarDetailData {
    id: string;
    image_main: Image;
    price: Price;
    version: Version;
    category: Category;
    seller: Seller;
    origin_country: CountryObject;
    fuel_type: FuelType;
    spect: {
        chassis_number: string;
        registration_year: number;
        manifactured_year: number;
        color: string;
        mileage: number;
        transmission: string;
        steering: string;
        seating_capacity: number;
        doors: number;
        status: string;
        engine_code: string;
        engine_size: number;
        model_code: string;
        wheel_driver: string;
        m_3: number;
        dimensions: Dimensions;
        weight: number;
    };
    location: string;
    car_selling_status: string;
    publication_status: string;
    interior_color: Color;
    exterior_color: Color;
    cost_price: number;
    min_profit_margin: number;
    images: Image[];
    features: Feature[];
    updated_at: string;
    created_at: string;
}
export type Color = {
    id: string;
    name: string;
    hex_code: string;
};
export type Brand = {
    id: string;
    brand_name: string;
};
export type CarModel = {
    id: string;
    brand_id: string;
    brand: Brand;
    model_name: string;
};
export type Category = {
    id: string;
    category_name: string;
};
export type FuelType = {
    id: string;
    fuel_type: string;
};
export type Version = {
    id: string;
    version_name: string;
    car_model_id: string;
    car_model: CarModel;
    version_year: string; //must be string
};
export interface Seller {
    id: number;
    seller_name: string;
    phone: string;
    avatar: string | null;
    description: string | null;
    country: string;
    address: string;
        created_at: string;
    updated_at: string;
}
export type Feature = {
    id: string;
    feature_name: string;
    icon?: string; // Optional icon field
    description?: string; // Optional description field
};

export type Image = {
    id: string;
    car_id: string;
    image_path: string;
    is_main: boolean;
};
export type Role = {
    id: string;
    name: string;
};
export type UserData = {
    id: string;
    name: string;
    email: string;
    roles: Role[];
    created_at: string;
    updated_at: string;
};

export interface CountryObject {
    id: number;
    country_name: string;
    code: string; // e.g., 'JP', 'RW'
    prefix: string; // e.g., '+81'
    currency: string | null;
    import_regulation_information: string | null;
    flags: string | null;
    gateway_ports?: PortObject[];
    cities?: CityObject[];
    created_at?: string;
    updated_at?: string;
}

export interface PortObject {
    id: number;
    name: string;
    code: string | null;
    country_id: number;
    country?: CountryObject;
    updated_at?: string;
    created_at?: string;
}

export interface ShippingRateObject {
    id: number;
    transport_mode: 'sea' | 'land';
    from_country_id: number;
    from_country?: CountryObject;
    from_port_id: number | null;
    from_port?: PortObject | null;
    to_country_id: number;
    to_country?: CountryObject;
    to_port_id: number | null;
    to_port?: PortObject | null;
    price_roro: string;
    price_container: string;

    is_current: boolean;
    updated_at: string;
}

// export interface DeliveryTariffObject {
//     id: number;
//     adress_name: string;
//     country_id: number;
//     country?: CountryObject;
//     from_port_id: number | null;
//     from_country_id: number | null;
//     tarif_per_tone: string;
//     driver_fee: string;
//     clearing_fee: string;

//     weight_range: string | null;

//     origin_display?: string;
// }

export interface CityObject {
    id: number;
    name: string;
    country_id: number;
    is_hub: boolean;
}

export interface DeliveryDriverAgencyObject {
    id: number | null;
    name: string;
    business_registration_number: string;
    tax_identification_number?: string;
    person?: string;
    phone?: string;
    email?: string;
    address?: string;
    fleet_size: number | string;
    is_active: boolean;
    // Relationships can be added here if agencies are linked to countries
    country?: CountryObject;
}

export interface DeliveryTariffObject {
    id: number | null;

    // Raw Data
    service_type: 'self_pickup' | 'individual_driver' | 'agency';
    delivery_method: 'drive_away' | 'car_carrier' | 'container';
    adress_name: string;
    tarif_per_tone: number;
    driver_fee: number;
    clearing_fee: number;
    agency_service_fee: number;
    weight_range: string;

    // IDs for Form Binding
    from_country_id: string | number;
    from_port_id: string | number | null;
    from_city_id: string | number | null;
    country_id: string | number;
    to_city_id: string | number | null;
    delivery_driver_agency_id: string | number | null;
    is_current: boolean;

    // Full Nested Relationships
    country?: CountryObject;
    origin_country?: CountryObject;
    origin_port?: PortObject;
    from_city?: CityObject;
    to_city?: CityObject;
    delivery_driver_agency?: DeliveryDriverAgencyObject;
}

export interface Order {
    id: number;
    order_number: string;
    status: string;
    vehicle: {
        name: string;
        chassis_number: string;
        image: string | null;
    };
    pricing: {
        total_amount: number;
        currency: string;
    };
    dates: {
        created_at: string;
    };
}