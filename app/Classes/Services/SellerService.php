<?php

namespace App\Classes\Services;

use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidatorReturn;
use Illuminate\Support\Facades\Log; // Added for debugging, optional

class SellerService
{
    public function Index()
    {
        $sellers = Seller::paginate(15);
        // Ensure to return the transformed collection
        return $sellers->getCollection()->transform(function ($seller) {
            return [
                'id' => $seller->id,
                'seller_name' => $seller->seller_name, // Changed to seller_name for consistency
                'email' => $seller->email,
                'phone' => $seller->phone,
                'address' => $seller->address, // Added address
                'country' => $seller->country, // Added country
                'created_at' => $seller->created_at->format('Y-m-d'),
                'updated_at' => $seller->updated_at->format('Y-m-d'),
            ];
        });
        return $sellers;
    }

    public function Create(Request $request): Seller
    {
        $sellerName = trim(htmlspecialchars($request->seller_name));
        $phone = trim(htmlspecialchars($request->phone));
        $email = trim(htmlspecialchars($request->email));
        $address = trim(htmlspecialchars($request->address));
        $country = trim(htmlspecialchars($request->country));

        return Seller::create([
            "seller_name" => $sellerName,
            "phone" => $phone,
            "email" => $email,
            "address" => $address,
            "country" => $country,
        ]);
    }

    public function Update(Request $request, Seller $seller): Seller
    {
        $sellerName = trim(htmlspecialchars($request->input('seller_name')));
        $phone = trim(htmlspecialchars($request->input('phone')));
        $email = trim(htmlspecialchars($request->input('email')));
        $address = trim(htmlspecialchars($request->input('address')));
        $country = trim(htmlspecialchars($request->input('country')));

        $seller->update([
            "seller_name" => $sellerName,
            "phone" => $phone,
            "email" => $email,
            "address" => $address,
            "country" => $country,
        ]);

        return $seller;
    }

    public function Delete(Seller $seller): bool
    {
        return $seller->delete();
    }

    public function DataValidation(Request $request, String $method, Seller|bool $seller = null): ValidatorReturn
    {
        switch (strtolower($method)) {
            case 'post':
                return Validator::make($request->all(), [
                    "seller_name" => ["required", "string", "max:255"],
                    "phone" => ["nullable", "string", "max:20"],
                    "email" => ["required", "email", "max:255", "unique:sellers,email"],
                    "address" => ["nullable", "string", "max:255"],
                    "country" => ["nullable", "string", "max:255"],
                ]);
            case 'patch': // Use 'patch' for update operations
                return Validator::make($request->all(), [
                    "seller_name" => ["required", "string", "max:255"],
                    "phone" => ["nullable", "string", "max:20"],
                    "email" => ["required", "email", "max:255", Rule::unique("sellers", "email")->ignore($seller->id)],
                    "address" => ["nullable", "string", "max:255"],
                    "country" => ["nullable", "string", "max:255"],
                ]);
            default:
                // Log an error or throw an exception for unsupported methods
                Log::error("Unsupported validation method: {$method} in SellerService.");
                return Validator::make([], []); // Return an empty validator to prevent crashes
        }
    }
}