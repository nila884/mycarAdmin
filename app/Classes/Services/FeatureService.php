<?php

namespace App\Classes\Services;

use App\Models\Feature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str; // Import Storage facade
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidatorReturn; // Import Str facade for slug generation

class FeatureService
{
    public function Index()
    {
        $features = Feature::paginate(15);
        // Map features to include full URL for icon
        $features->getCollection()->transform(function ($feature) {
            return [
                'id' => $feature->id,
                'feature_name' => $feature->feature_name,
                'description' => $feature->description,
                'icon' => $feature->icon ? $feature->icon : null, // Generate full URL
                'is_active' => $feature->is_active,
                'is_main' => $feature->is_main,
                'created_at' => $feature->created_at->format('Y-m-d'),
                'updated_at' => $feature->updated_at->format('Y-m-d'),
            ];
        });

        return $features;
    }

    public function Create(Request $request)
    {

        $name = strtolower(trim(htmlspecialchars($request->feature_name)));
        $description = trim(htmlspecialchars($request->description));
        $iconPath = null;

        if ($request->hasFile('icon')) {
            $file = $request->file('icon');
            $fileName = time().'_'.Str::slug($name).'.'.$file->getClientOriginalExtension();
            $iconPath = $file->storeAs('feature_icons', $fileName, 'public'); // Store in 'feature_icons' directory
        }

        return Feature::create([
            'feature_name' => $name,
            'description' => $description,
            'is_main' => $request->is_main,
            'icon' =>$iconPath,
        ]);
    }

    public function Update(Request $request, Feature $feature): Feature
    {
        $name = strtolower(trim(htmlspecialchars($request->feature_name)));
        $description = trim(htmlspecialchars($request->description));

        $iconPath = $feature->icon; // Keep existing icon path by default

        if ($request->hasFile('icon')) {
            // Delete old icon if it exists
            if ($feature->icon && Storage::disk('public')->exists($feature->icon)) {
                Storage::disk('public')->delete($feature->icon);
            }

            $file = $request->file('icon');
            $fileName = time().'_'.Str::slug($name).'.'.$file->getClientOriginalExtension();
            $iconPath = $file->storeAs('feature_icons', $fileName, 'public'); // Store new icon
        } elseif ($request->input('clear_icon')) { // Frontend can send 'clear_icon' to remove image
            if ($feature->icon && Storage::disk('public')->exists($feature->icon)) {
                Storage::disk('public')->delete($feature->icon);
            }
            $iconPath = null; // Set icon path to null to remove it from the database
        }

        $feature->update([
            'feature_name' => $name,
            'description' => $description,
            'is_main' => $request->is_main,
            'icon' => Storage::url($iconPath),
        ]);

        return $feature;
    }

    public function Delete(Feature $feature): bool
    {
        // Delete associated icon file when deleting the feature
        if ($feature->icon && Storage::disk('public')->exists($feature->icon)) {
            Storage::disk('public')->delete($feature->icon);
        }

        return $feature->delete();
    }

    public function DataValidation(Request $request, string $method, Feature|bool|null $feature = null): ?ValidatorReturn
    {
        switch (strtolower($method)) {
            case 'post':
                return Validator::make($request->all(), [
                    'feature_name' => ['required', 'string', 'max:255', 'unique:features,feature_name', 'regex:/^[a-zA-Z0-9\s\'-]+$/'],
                    'description' => ['required', 'string', 'min:10'],
                    'is_main' => ['boolean'],
                    'icon' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:1024'],

                ]);
            case 'patch':
                return Validator::make($request->all(), [
                    'feature_name' => ['required', 'string', 'max:255', Rule::unique('features', 'feature_name')->ignore($feature->id), 'regex:/^[a-zA-Z0-9\s\'-]+$/'],
                    'description' => ['required', 'string', 'min:10'],
                    'icon' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:1024'],
                    'is_main' => ['boolean'],
                    'clear_icon' => ['boolean'], // For explicit icon removal
                ]);
            default:
                return null;
        }
    }
}
