export type Car = {
    id:number;
  
    car_brand_id: Brand;
    version_id: Version;
    category_id: Category;
    fuel_type_id: FuelType;
    seller_id: Seller;
    mileage: number | null;
    chassis_number: string;
    registration_year: number | null;
    manufacture_year: number | null;
    color: string;
    status: boolean | null;
    transmission: 'automatic' | 'manual' | undefined;
    streering: 'right' | 'left' | undefined;
    steating_capacity: number | null;
    engine_code: string | null;
    engine_size: number | null;
    model_code: string | null;
    wheel_driver: string | null;
    m_3: number | null;
    doors: number | null;
    dimensions: string | null;
    location: string | null;
    weight: number | null;
    price: number | null;
    promo: number | null;
    publication_status: string;
    features:Feature[];
    image: File | null;
    images: File[];
};

export interface CarDetail {
    id: number;
    car_brand_id: number | null;
    brand_name: string;
   
    model_name: string;
    category_id: number | null;
    category: string;
    fuel_type_id: number | null;
    fuel_type: string;
    version_id: number | null;
    version_name: string;
    seller_id: number | null;
    seller_name: string;
    mileage: number;
    chassis_number: string;
    registration_year: number | null;
    manufacture_year: number | null;
    price: number;
    promo: number;
    color: string;
    weight: number | null;
    status: boolean; // true for new, false for used
    transmission: 'automatic' | 'manual';
      streering: 'right' | 'left';
    steating_capacity: number | null;
    engine_code: string | null;
    engine_size: number | null;
    model_code: string | null;
    wheel_driver: string | null;
    m_3: number | null;
    doors: number | null;
    dimensions: string | null; // Assuming JSON string or similar
    location: string | null;
    publication_status: string;
    car_sells_status: string;
    features: Feature[];
    image_url: string | null; // Main image URL
    images: string[]; // Additional image URLs
    existing_images?: Image[];
    images_to_delete: []; // Initialize empty, will be populated on removal
    created_at: string;
    updated_at: string;
}


export type Brand={
  id:number;
  brand_name:string;
  model_name?: string;
}
export type CarModel={
  id:number;
  brand_id:number;
  model_name:string;
}
export type Category={
  id:number;
  category_name:string;
}
export type FuelType={
  id:number;
  fuel_type:string;
}
export type Version={
  id:number;
  version_name:string;
  car_model_id:number
  model_name:string
  version_year:string//must be number
}
export type Seller={
  id:number;
  seller_name:string;
  phone_number?: string;
  email?: string;
  address?: string;
}
export type Feature={
  id:number;
  feature_name:string;
  icon?: string; // Optional icon field
  description?: string; // Optional description field
}

export type Image={
  id:number;
  car_id:number;
  image_path:string;
  is_main:boolean;
}