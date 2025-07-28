import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from '@inertiajs/react';
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Brand, CarModel, Category, Feature, FuelType, Seller, Version, CarDetail, Image } from "@/lib/object";

interface CreateFormProps {
    brands: Brand[];
    carModels: CarModel[];
    versions: Version[];
    categories: Category[];
    fuelTypes: FuelType[];
    features: Feature[];
    sellers: Seller[];
    car?: CarDetail;
}

// === UPDATED CarForm TYPE ===
type CarForm = {
    car_model_id: string;
    car_brand_id: string;
    version_id: string;
    category_id: string;
    fuel_type_id: string;
    seller_id: string;
    mileage: number | null;
    chassis_number: string;
    registration_year: number | null;
    manufacture_year: number | null;
    color: string;
    status: boolean | null;
    transmission: 'automatic' | 'manual' | undefined;
    car_sells_status: 'sold' | 'selling' | 'reserved' | undefined;
    streering: 'right' | 'left' | undefined;
    steating_capacity: number | null;
    engine_code: string | null;
    engine_size: number | null;
    model_code: string | null;
    wheel_driver: string | null;
    m_3: number | null;
    doors: number | null;
    location: string | null;
    weight: number | null;
    price: number | null;
    promo: number | null;
    publication_status: 'published' | 'pendding' | 'archived' | undefined;
    image: File | null;
    images: File[]; // Newly uploaded files
    existing_images: Image[]; 
    images_to_delete: number[];
    features: Feature[];
};

// === NEW TYPE FOR IMAGE PREVIEWS ===
type ImagePreviewItem = {
    src: string; // The URL to display
    type: 'existing' | 'new'; // To distinguish existing images from newly added files
    id?: number; // Only present for existing images from the backend
    file?: File; // Only present for newly added File objects
};


// === UPDATED getInitialFormData FUNCTION ===
const getInitialFormData = (car?: CarDetail): CarForm => {
    return {
        car_model_id: car?.car_model_id?.toString() || "",
        car_brand_id: car?.car_brand_id?.toString() || "",
        version_id: car?.version_id?.toString() || "",
        category_id: car?.category_id?.toString() || "",
        fuel_type_id: car?.fuel_type_id?.toString() || "",
        seller_id: car?.seller_id?.toString() || "",
        mileage: car?.mileage || null,
        chassis_number: car?.chassis_number || "",
        registration_year: car?.registration_year || null,
        manufacture_year: car?.manufacture_year || null,
        color: car?.color || "",
        status: car?.status || null,
        transmission: car?.transmission || undefined,
        car_sells_status: car?.car_sells_status === 'sold' || car?.car_sells_status === 'selling' || car?.car_sells_status === 'reserved'
            ? car.car_sells_status
            : undefined,
        streering: car?.streering || undefined,
        steating_capacity: car?.steating_capacity || null,
        engine_code: car?.engine_code || null,
        engine_size: car?.engine_size || null,
        model_code: car?.model_code || null,
        wheel_driver: car?.wheel_driver || null,
        m_3: car?.m_3 || null,
        doors: car?.doors || null,
        location: car?.location || null,
        weight: car?.weight || null,
        price: car?.price || null,
        promo: car?.promo || null,
        publication_status: car?.publication_status === 'published' || car?.publication_status === 'pendding' || car?.publication_status === 'archived'
            ? car.publication_status
            : undefined,
        image: null,
        images: [], // New files start empty
        existing_images:car?.existing_images||[],
        images_to_delete: [], // Initialize empty, will be populated on removal
        features: car?.features || [],
    };
};

const CreateCarForm = ({ brands, carModels, categories, versions, features, fuelTypes, sellers, car }: CreateFormProps) => {
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

    const [selectedBrandId, setSelectedBrandId] = useState<string>('');
    const [filteredCarModels, setFilteredCarModels] = useState<CarModel[]>([]);
    const [selectedCarModelId, setSelectedCarModelId] = useState<string>('');
    const [filteredVersions, setFilteredVersions] = useState<Version[]>([]);

    // Initialize Inertia's useForm with updated CarForm type and initial data
    const { data, setData, post, processing, errors, reset } = useForm<CarForm>(
        car ? route('car.update', car.id) : route('car.store'),
        getInitialFormData(car)
    );

    // Effect to set main image preview and dropdowns when car prop changes (for edit mode)
    useEffect(() => {
        if (car) {
            setMainImagePreview(car.image_url || null);
            setSelectedBrandId(car.car_brand_id?.toString() || "");
            setSelectedCarModelId(car.car_model_id?.toString() || "");
        } else {
            setMainImagePreview(null);
            setSelectedBrandId('');
            setSelectedCarModelId('');
        }
    }, [car]);

    // Effects for filtering dependent dropdowns (Brands -> Models -> Versions)
    useEffect(() => {
        if (selectedBrandId) {
            setFilteredCarModels(carModels.filter(model => model.brand_id.toString() === selectedBrandId));
        } else {
            setFilteredCarModels([]);
        }
        if (!car && data.car_model_id && !carModels.some(model => model.id.toString() === data.car_model_id && model.brand_id.toString() === selectedBrandId)) {
            setData('car_model_id', '');
            setSelectedCarModelId('');
            setData('version_id', '');
        }
    }, [selectedBrandId, carModels, data.car_model_id, setData, car]);

    useEffect(() => {
        if (selectedCarModelId) {
            setFilteredVersions(versions.filter(version => version.car_model_id.toString() === selectedCarModelId));
        } else {
            setFilteredVersions([]);
        }
        if (!car && data.version_id && !versions.some(version => version.id.toString() === data.version_id && version.car_model_id.toString() === selectedCarModelId)) {
            setData('version_id', '');
        }
    }, [selectedCarModelId, versions, data.version_id, setData, car]);

    // Form submission handler
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (car) {
            // Use 'post' method for updates if your backend expects FormData and handles _method spoofing
            post(route('car.update', car.id), {
                onSuccess: () => {
                    alert('Car updated successfully!');
                },
                onError: (submissionErrors) => {
                },
                onFinish: () => { },
                forceFormData: true, // Crucial for sending files and arrays like images_to_delete
            });
        } else {
            post(route('car.store'), {
                onSuccess: () => {
                    reset();
                    setMainImagePreview(null);
                    setSelectedBrandId('');
                    setSelectedCarModelId('');
                    alert('Car created successfully!');
                },
                onError: (submissionErrors) => {
                },
            });
        }
    };

    // Main image upload handler
    const onDropMainImage = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = () => {
                setMainImagePreview(reader.result as string);
                setData('image', file);
            };
            reader.readAsDataURL(file);
        } else {
            setData('image', null);
            setMainImagePreview(null);
        }
    };

    // Multiple images upload handler
    const onDropMultipleImages = (acceptedFiles: File[]) => {
        const validTypes = ["image/jpeg", "image/png"];
        const newValidFiles = acceptedFiles.filter(
            (file) =>
                validTypes.includes(file.type) &&
                !data.images.some((f) => f.name === file.name && f.size === file.size) // Prevent duplicates of new files
        );

        if (newValidFiles.length > 0) {
            setData('images', [...data.images, ...newValidFiles]);
        }
    };
    const removeImage = (itemToRemove: ImagePreviewItem) => {


        if (itemToRemove.type === 'existing' && itemToRemove.id !== undefined && itemToRemove.id !== null) {
            const idToRemove = Number(itemToRemove.id); // Ensure ID is a number for comparison
          
            setData(prevData => {
                const updatedExistingImages = prevData.existing_images.filter(img => Number(img.id) !== idToRemove);

                const updatedImagesToDelete = [...prevData.images_to_delete, idToRemove];
                  
                return {
                    ...prevData,
                    images_to_delete: updatedImagesToDelete,
                    existing_images: updatedExistingImages, 
                };
            });
        } else if (itemToRemove.type === 'new' && itemToRemove.file) {
           
            URL.revokeObjectURL(itemToRemove.src); // Revoke the Object URL to free memory

            setData(prevData => {
                // Filter out the specific File object reference from the 'images' array
                const updatedNewFiles = prevData.images.filter(file => file !== itemToRemove.file);

                return {
                    ...prevData,
                    images: updatedNewFiles, // Update the new files array
                };
            });
        } 
    };


    const { getRootProps: getMainImageRootProps, getInputProps: getMainImageInputProps, isDragActive: isMainImageDragActive } = useDropzone({
        onDrop: onDropMainImage,
        maxFiles: 1,
        maxSize: 1000000, // 1MB
        accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

    const { getRootProps: getMultipleImagesRootProps, getInputProps: getMultipleImagesInputProps, isDragActive: isMultipleImagesDragActive } = useDropzone({
        onDrop: onDropMultipleImages,
        accept: { "image/jpeg": [], "image/png": [] },
        multiple: true,
        maxFiles: 6,
        maxSize: 2 * 1024 * 1024, // 2MB limit per file
    });

       const allImagesForPreviews: ImagePreviewItem[] = [
        // Map existing images from data.existing_images
        ...(data.existing_images || []).map(img => ({
            src: img.image_path ?? "", // img is already a string (the image path)
            id:img.id,
            type: "existing" as const,
        })),
        // Map newly added files from data.images
        ...(data.images || []).map(file => ({
            src: URL.createObjectURL(file), // Create object URL for display
            type: "new" as const,
            file: file // Store the actual File object for later comparison
        }))
    ];

    return (
        <div className="container mx-auto py-10 px-">
            <form onSubmit={onSubmit} className="space-y-6">
                {/* Car Model Select */}
                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-4">

                    <div className="grid gap-2">
                        <Label htmlFor="car_brand_id">Brand</Label>
                        <Select
                            onValueChange={(value) => {
                                setData('car_brand_id', value);
                                setSelectedBrandId(value); // Update selected brand ID state
                            }}
                            value={data.car_brand_id}
                        >
                            <SelectTrigger id="car_brand_id" disabled={processing}>
                                <SelectValue placeholder="Select brand" />
                            </SelectTrigger>
                            <SelectContent>
                                {brands.length > 0 ? (brands.map((brand) => (
                                    <SelectItem key={brand.id.toString()} value={brand.id.toString()}> {/* Value is ID */}
                                        {brand.brand_name}
                                    </SelectItem>
                                ))) : (
                                    <SelectItem value="placeholder" disabled> {/* Empty string for disabled placeholder */}
                                        No brands available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.car_brand_id} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="car_model_id">Model</Label>
                        <Select
                            onValueChange={(value) => {
                                setData('car_model_id', value);
                                setSelectedCarModelId(value); // Update selected car model ID state
                            }}
                            value={data.car_model_id}
                            disabled={processing || !selectedBrandId || filteredCarModels.length === 0}
                        >
                            <SelectTrigger id="car_model_id">
                                <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredCarModels.length > 0 ? (filteredCarModels.map((model) => (
                                    <SelectItem key={model.id.toString()} value={model.id.toString()}> {/* Value is ID */}
                                        {model.model_name}
                                    </SelectItem>
                                ))) : (
                                    <SelectItem value="placeholder" disabled>
                                        No models available for selected brand
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.car_model_id} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="version_id">Version</Label>
                        <Select
                            onValueChange={(value) => {
                                setData('version_id', value)
                            }}
                            value={data.version_id}
                            disabled={processing || !selectedCarModelId || filteredVersions.length === 0}
                        >
                            <SelectTrigger id="version_id">
                                <SelectValue placeholder="Select version" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredVersions.length > 0 ? (filteredVersions.map((version) => (
                                    <SelectItem key={version.id.toString()} value={version.id.toString()}> {/* Value is ID */}
                                        {version.version_name + " " + version.version_year}
                                    </SelectItem>
                                ))) : (
                                    <SelectItem value="placeholder" disabled>
                                        No versions available for selected model
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.version_id} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category_id">Category</Label>
                        <Select
                            onValueChange={(value) => setData('category_id', value)}
                            value={data.category_id}
                        >
                            <SelectTrigger id="category_id" disabled={processing}>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.length > 0 ? (categories.map((category) => (
                                    <SelectItem key={category.id.toString()} value={category.id.toString()}>
                                        {category.category_name}
                                    </SelectItem>
                                ))) : (
                                    <SelectItem value="placeholder" disabled>
                                        No categories available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.category_id} className="mt-2" />
                    </div>

                    {/* Fuel Type Select */}
                    <div className="grid gap-2">
                        <Label htmlFor="fuel_type_id">Fuel Type</Label>
                        <Select
                            onValueChange={(value) => setData('fuel_type_id', value)}
                            value={data.fuel_type_id}
                        >
                            <SelectTrigger id="fuel_type_id" disabled={processing}>
                                <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                            <SelectContent>
                                {fuelTypes.length > 0 ? (fuelTypes.map((fuelType) => (
                                    <SelectItem key={fuelType.id.toString()} value={fuelType.id.toString()}>
                                        {fuelType.fuel_type}
                                    </SelectItem>
                                ))) : (
                                    <SelectItem value="placeholder" disabled>
                                        No fuel types available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.fuel_type_id} className="mt-2" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-4">
                    {/* Transmission Select */}
                    <div className="grid gap-2">
                        <Label htmlFor="transmission">Transmission</Label>
                        <Select
                            onValueChange={(value) => setData('transmission', value as 'automatic' | 'manual')}
                            value={data.transmission || ""} // Ensure value is a string
                        >
                            <SelectTrigger id="transmission" disabled={processing}>
                                <SelectValue placeholder="Select transmission" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="automatic">Automatic</SelectItem>
                                <SelectItem value="manual">Manual</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.transmission} className="mt-2" />
                    </div>

                    {/* Steering Select */}
                    <div className="grid gap-2">
                        <Label htmlFor="streering">Steering</Label>
                        <Select
                            onValueChange={(value) => setData('streering', value as 'right' | 'left')}
                            value={data.streering || ""} // Ensure value is a string
                        >
                            <SelectTrigger id="streering" disabled={processing}>
                                <SelectValue placeholder="Select steering" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="right">Right</SelectItem>
                                <SelectItem value="left">Left</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.streering} className="mt-2" />
                    </div>

                    {/* Status Select */}
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            onValueChange={(value) => setData('status', value === 'new' ? true : false)}
                            value={data.status === true ? 'new' : (data.status === false ? 'used' : '')}
                        >
                            <SelectTrigger id="status" disabled={processing}>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="used">Used</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    {/* Publication Status Select */}
                    <div className="grid gap-2">
                        <Label htmlFor="publication_status">Publication Status</Label>
                        <Select
                            onValueChange={(value) => setData('publication_status', value as 'published' | 'pendding' | 'archived')}
                            value={data.publication_status}
                        >
                            <SelectTrigger id="publication_status" disabled={processing}>
                                <SelectValue placeholder="Select publication status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.publication_status} className="mt-2" />
                    </div>
                    {/* Car selling Status Select */}
                    <div className="grid gap-2">
                        <Label htmlFor="car_sells_status">Car selling Status</Label>
                        <Select
                            onValueChange={(value) => setData('car_sells_status', value as 'sold' | 'selling' | 'reserved')}
                            value={data.car_sells_status}
                        >
                            <SelectTrigger id="car_sells_status" disabled={processing}>
                                <SelectValue placeholder="Select selling status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="selling">Selling</SelectItem>
                                <SelectItem value="sold">Sold</SelectItem>
                                <SelectItem value="reserved">Reserved</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.publication_status} className="mt-2" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-4">
                    {/* Color Select */}
                    <div className="grid gap-2">
                        <Label htmlFor="color">Color</Label>
                        <Select
                            onValueChange={(value) => setData('color', value)}
                            value={data.color}
                        >
                            <SelectTrigger id="color" disabled={processing}>
                                <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="red">Red</SelectItem>
                                <SelectItem value="blue">Blue</SelectItem>
                                <SelectItem value="yellow">Yellow</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.color} className="mt-2" />
                    </div>

                    {/* Wheel Drive Select */}
                    <div className="grid gap-2">
                        <Label htmlFor="wheel_driver">Wheel Drive</Label>
                        <Select
                            onValueChange={(value) => setData('wheel_driver', value)}
                            value={data.wheel_driver || ""}
                        >
                            <SelectTrigger id="wheel_driver" disabled={processing}>
                                <SelectValue placeholder="Select wheel drive" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fwd">FWD</SelectItem>
                                <SelectItem value="rwd">RWD</SelectItem>
                                <SelectItem value="awd">AWD</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.wheel_driver} className="mt-2" />
                    </div>

                    {/* Seller Select */}
                    <div className="grid gap-2">
                        <Label htmlFor="seller_id">Seller</Label>
                        <Select
                            onValueChange={(value) => setData('seller_id', value)}
                            value={data.seller_id}
                        >
                            <SelectTrigger id="seller_id" disabled={processing}>
                                <SelectValue placeholder="Select seller" />
                            </SelectTrigger>
                            <SelectContent>
                                {sellers.length > 0 ? (sellers.map((seller) => (
                                    <SelectItem key={seller.id.toString()} value={seller.id.toString()}>
                                        {seller.seller_name}
                                    </SelectItem>
                                ))) : (
                                    <SelectItem value="placeholder" disabled>
                                        No sellers available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.seller_id} className="mt-2" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-4">
                    {/* Chassis Number Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="chassis_number">Chassis Number</Label>
                        <Input
                            id="chassis_number"
                            placeholder="Chassis Number"
                            type="text"
                            value={data.chassis_number}
                            onChange={e => setData('chassis_number', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.chassis_number} className="mt-2" />
                    </div>

                    {/* Engine Code Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="engine_code">Engine Code</Label>
                        <Input
                            id="engine_code"
                            placeholder="Engine Code"
                            type="text"
                            value={data.engine_code || ""}
                            onChange={e => setData('engine_code', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.engine_code} className="mt-2" />
                    </div>

                    {/* Model Code Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="model_code">Model Code</Label>
                        <Input
                            id="model_code"
                            placeholder="Model Code"
                            type="text"
                            value={data.model_code || ""}
                            onChange={e => setData('model_code', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.model_code} className="mt-2" />
                    </div>

                    {/* Seating Capacity Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="steating_capacity">Seating Capacity</Label>
                        <Input
                            id="steating_capacity"
                            placeholder="Seating Capacity"
                            type="number"
                            value={data.steating_capacity !== null ? data.steating_capacity : ""}
                            onChange={e => setData('steating_capacity', e.target.value === "" ? null : Number(e.target.value))}
                            disabled={processing}
                        />
                        <InputError message={errors.steating_capacity} className="mt-2" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-4">
                    {/* Mileage Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="mileage">Mileage</Label>
                        <Input
                            id="mileage"
                            placeholder="Mileage"
                            type="number"
                            value={data.mileage !== null ? data.mileage : ""}
                            onChange={e => setData('mileage', e.target.value === "" ? null : Number(e.target.value))}
                            disabled={processing}
                        />
                        <InputError message={errors.mileage} className="mt-2" />
                    </div>

                    {/* Weight Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                            id="weight"
                            placeholder="Weight"
                            type="number"
                            value={data.weight !== null ? data.weight : ""}
                            onChange={e => setData('weight', e.target.value === "" ? null : Number(e.target.value))}
                            disabled={processing}
                        />
                        <InputError message={errors.weight} className="mt-2" />
                    </div>

                    {/* Price Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                            id="price"
                            placeholder="Price"
                            type="number"
                            value={data.price !== null ? data.price : ""}
                            onChange={e => setData('price', e.target.value === "" ? null : Number(e.target.value))}
                            disabled={processing}
                        />
                        <InputError message={errors.price} className="mt-2" />
                    </div>

                    {/* Promo Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="promo">Promo</Label>
                        <Input
                            id="promo"
                            placeholder="Promo"
                            type="number"
                            value={data.promo !== null ? data.promo : ""}
                            onChange={e => setData('promo', e.target.value === "" ? null : Number(e.target.value))}
                            disabled={processing}
                        />
                        <InputError message={errors.promo} className="mt-2" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-4">
                    {/* Registration Year Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="registration_year">Registration Year</Label>
                        <Input
                            id="registration_year"
                            placeholder="Registration Year"
                            type="number"
                            value={data.registration_year !== null ? data.registration_year : ""}
                            onChange={e => setData('registration_year', e.target.value === "" ? null : Number(e.target.value))}
                            disabled={processing}
                        />
                        <InputError message={errors.registration_year} className="mt-2" />
                    </div>

                    {/* Manufacture Year Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="manufacture_year">Manufacture Year</Label>
                        <Input
                            id="manufacture_year"
                            placeholder="Manufacture Year"
                            type="number"
                            value={data.manufacture_year !== null ? data.manufacture_year : ""}
                            onChange={e => setData('manufacture_year', e.target.value === "" ? null : Number(e.target.value))}
                            disabled={processing}
                        />
                        <InputError message={errors.manufacture_year} className="mt-2" />
                    </div>

                    {/* M^3 Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="m_3">M^3</Label>
                        <Input
                            id="m_3"
                            placeholder="M^3"
                            type="number"
                            value={data.m_3 !== null ? data.m_3 : ""}
                            onChange={e => setData('m_3', e.target.value === "" ? null : Number(e.target.value))}
                            disabled={processing}
                        />
                        <InputError message={errors.m_3} className="mt-2" />
                    </div>

                    {/* Doors Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="doors">Doors</Label>
                        <Input
                            id="doors"
                            placeholder="Doors"
                            type="number"
                            value={data.doors !== null ? data.doors : ""}
                            onChange={e => setData('doors', e.target.value === "" ? null : Number(e.target.value))}
                            disabled={processing}
                        />
                        <InputError message={errors.doors} className="mt-2" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-4">
                    {/* Location Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            placeholder="Location"
                            type="text"
                            value={data.location || ""}
                            onChange={e => setData('location', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.location} className="mt-2" />
                    </div>
                    {/* engine size input*/}
                    <div className="grid gap-2">
                        <Label htmlFor="engine_size">Engine size</Label>
                        <Input
                            id="engine_size"
                            placeholder="Engine size"
                            type="number"
                            value={data.engine_size !== null ? data.engine_size : ""}
                            onChange={e => setData('engine_size', e.target.value === "" ? null : Number(e.target.value))}
                            disabled={processing}
                        />
                        <InputError message={errors.engine_size} className="mt-2" />
                    </div>
                </div>

                {/* Car Options Checkboxes */}
                <div>
                    <div className="mb-4">
                        <Label className="text-base">Car options</Label>
                        <p className="text-sm text-muted-foreground">
                            Select car options.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-4">
                        {features.length > 0 ? (features.map((feature) => (
                            <div key={feature.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={feature.id.toString()}
                                    checked={data.features.some(f => f.id === feature.id)}
                                    disabled={processing}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setData('features', [...data.features, feature]);
                                        } else {
                                            setData('features', data.features.filter(f => f.id !== feature.id));
                                        }
                                    }}
                                />
                                <Label
                                    htmlFor={feature.feature_name}
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    {feature.feature_name.replace(/_/g, ' ').replace(/\b\w/g, s => s.toUpperCase())}
                                </Label>
                            </div>
                        ))) : (
                            <p className="text-sm text-muted-foreground">No features available.</p>
                        )}
                    </div>
                </div>

                {/* Main Car Image Upload */}
                <div className="grid gap-2">
                    <Label htmlFor="image">Main Car Image</Label>
                    <div
                        {...getMainImageRootProps()}
                        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer
                            ${isMainImageDragActive ? 'border-primary' : 'border-gray-300'}
                            ${errors.image ? 'border-destructive' : ''}
                        `}
                    >
                        <input id="image" {...getMainImageInputProps()} />
                        <p>{isMainImageDragActive ? "Drop the image here..." : "Drag & drop main image or click to select"}</p>
                        <p className="text-xs text-gray-500 mt-1">(PNG, JPG, JPEG up to 1MB)</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Upload a single JPEG/PNG image for the main car image.</p>
                    <InputError message={errors.image} className="mt-2" />
                    {mainImagePreview && (
                        <div className="mt-2">
                            <img src={mainImagePreview} alt="Main Image Preview" className="h-40 w-auto object-contain rounded shadow" />
                        </div>
                    )}
                </div>

                {/* Multiple Car Images Upload */}
                <div className="grid gap-2">
                    <Label htmlFor="images">Additional Car Images</Label>
                    <div
                        {...getMultipleImagesRootProps()}
                        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer
                            ${isMultipleImagesDragActive ? 'border-primary' : 'border-gray-300'}
                            ${errors.images ? 'border-destructive' : ''}
                        `}
                    >
                        <input id="images" {...getMultipleImagesInputProps()} />
                        <p>{isMultipleImagesDragActive ? "Drop images here..." : "Drag & drop images or click to select (max 6)"}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Upload JPEG/PNG images only. Max 6 images.</p>
                    <InputError message={errors.images} className="mt-2" />
                    {allImagesForPreviews.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                            {allImagesForPreviews.map((item) => ( // Iterate over ImagePreviewItem
                                <div key={item.id} className="relative group"> {/* Use item.src as key */}
                                    <img
                                        src={item.src}
                                        alt={`Preview`}
                                        className="rounded shadow object-cover h-40 w-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(item)} // Pass the entire item to removeImage
                                        className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-80 hover:opacity-100"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Button type="submit" disabled={processing} className="w-fit">
                    {processing ? 'Submitting...' : 'Submit'}
                </Button>
            </form>
        </div>
    );
}

export default CreateCarForm;