import { string } from "zod";

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
//     manufacture_year: string | null;
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
//     manufacture_year: string | null;
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

export interface Price{
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
  version:Version;
  category: Category;
  seller:Seller;
  fuel_type: FuelType;
  spect:{
            chassis_number: string;
            registration_year: number;
            manufacture_year: number;
            color: string;
            mileage: number;
            transmission: string;
            steering: string;
            seating_capacity: number;
            doors: number;
            status: boolean;
            engine_code: string;
            engine_size: number;
            model_code: string;
            wheel_driver: string;
            m_3: number;
            dimensions: Dimensions;
            weight: number;

        }
   location: string;
   car_selling_status :string;
   publication_status: string;
   interior_color:Color;
   exterior_color:Color;
   images: Image[];
   features: Feature[];
   updated_at: string,
   created_at: string,
}
export type Color={
    id: string;
    name: string;
    hex_code: string
}
export type Brand={
  id:string;
  brand_name:string;
}
export type CarModel={
  id:string;
  brand_id:string;
  brand: Brand;
  model_name:string;
}
export type Category={
  id:string;
  category_name:string;
}
export type FuelType={
  id:string;
  fuel_type:string;
}
export type Version={
  id:string;
  version_name:string;
  car_model_id:string;
  car_model: CarModel;
  version_year:string//must be string
}
export type Seller={
  id:string;
  seller_name:string;
  phone_string?: string;
  email?: string;
  address?: string;
}
export type Feature={
  id:string;
  feature_name:string;
  icon?: string; // Optional icon field
  description?: string; // Optional description field
}

export type Image={
  id:string;
  car_id:string;
  image_path:string;
  is_main:boolean;
}