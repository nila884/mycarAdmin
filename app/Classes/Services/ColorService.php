<?php

namespace App\Classes\Services;

use App\Models\Color;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidatorReturn;

class colorService
{
    public function Index()
    {

        $colors = Color::paginate(15);
        $colors->getCollection()->transform(function ($color) {
            return [
                'id' => $color->id,
                'name' => $color->name,
                'hex_code' => $color->hex_code,
                'created_at' => $color->created_at->format('Y-m-d'),
                'updated_at' => $color->updated_at->format('Y-m-d'),
            ];
        });

        return $colors;
    }

    public function Create(Request $request)
    {
        $name = trim(strtolower(htmlspecialchars($request->name)));
        $hex_code = trim(strtolower(htmlspecialchars($request->hex_code)));
             
        return Color::create(['name' => $name, 'hex_code' => $hex_code]);
    }

    public function Update(Request $request, Color $color): color
    {

        $name = trim(strtolower(htmlspecialchars($request->name)));
        $hex_code = trim(strtolower(htmlspecialchars($request->hex_code)));
  
        $color->update(['name' => $name, 'hex_code' => $hex_code]);
        return $color;
    }

    public function Delete(Color $color): bool
    {
        return $color->delete();
    }

    /**
     * Validation
     */
    public function DataValidation(Request $request, string $method, Color|bool|null $color = null): ?ValidatorReturn
    {
       
        switch (strtolower($method)) {
            case 'post':
                return Validator::make($request->all(), [
                        "brand_name" => ["required","string","max:255", "unique:colors,name"],
                    'hex_code' => ["string", "unique:colors,hex_code", "regex:/^#([A-Fa-f0-9]{6})$/"],
                ]);
            case 'patch':
                
                return Validator::make($request->all(), [
                    
                    'name' => ["required", "string", "max:255",Rule::unique('colors', 'name')->ignore($color->id)],
                    'hex_code' => ["nullable","string", "regex:/^#([A-Fa-f0-9]{6})$/",Rule::unique('colors', 'hex_code')->ignore($color->id)],
                ]);
            default:
                return null;
        }
    }
}
