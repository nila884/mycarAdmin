'use client';

import VersionForm from '@/components/car/settings/version/versionForm';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
import { timeFormat } from '@/lib/utils';
import { BrandItem } from '@/pages/car/settings/brand';
import { CarModelItem } from '@/pages/car/settings/model';
import { Head, router } from '@inertiajs/react';
import { Trash2, CarFront } from 'lucide-react';

export interface VersionItem {
    id: number;
    car_model_id: number;
    car_model: CarModelItem;
    version_name: string;
    version_year: string;
    created_at: string;
    updated_at: string;
}

interface VersionProps {
    versions: {
        data: VersionItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    carModels: CarModelItem[];
    brands: BrandItem[];
}

export default function Version({ versions, carModels, brands }: VersionProps) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure? This will delete this specific version.')) {
            router.delete(route('carversion.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AppLayout>
            <Head title="Version Settings" />
            <CarSettingLayout>
                {/* Unified Header Style */}
                <div className="mb-6 flex items-center justify-between">
                    <HeadingSmall title="Car Version Management" />
                    <VersionForm carModels={carModels} brands={brands} />
                </div>

                {/* Unified Table Style */}
                <div className="overflow-hidden rounded-md border bg-white shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[80px]">Year</TableHead>
                                <TableHead>Version Name</TableHead>
                                <TableHead>Model / Brand</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="px-6 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {versions.data.length > 0 ? (
                                versions.data.map((version) => (
                                    <TableRow key={version.id} className="hover:bg-slate-50/50 group">
                                        {/* Year styled like ISO Code */}
                                        <TableCell className="font-mono text-xs text-slate-500">
                                            {version.version_year}
                                        </TableCell>

                                        {/* Name styled like Country Name */}
                                        <TableCell className="font-semibold text-slate-700">
                                            {version.version_name.toUpperCase()}
                                        </TableCell>

                                        {/* Model Hierarchy */}
                                        <TableCell>
                                            <span className="text-sm text-slate-600">
                                                {version.car_model.brand?.brand_name}
                                            </span>
                                            <span className="mx-2 text-slate-300">/</span>
                                            <span className="text-sm font-medium text-slate-900">
                                                {version.car_model.model_name}
                                            </span>
                                        </TableCell>

                                        {/* Date styled like Country Created At */}
                                        <TableCell className="text-xs text-slate-400">
                                            {timeFormat(version.created_at)}
                                        </TableCell>

                                        {/* Actions matched to Shipping design */}
                                        <TableCell className="px-6 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <VersionForm version={version} carModels={carModels} brands={brands} />
                                                
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    onClick={() => handleDelete(version.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-1">
                                            <CarFront className="h-5 w-5 opacity-20" />
                                            <span>No car versions found.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination (Simplified to match clean look) */}
                {versions.links && versions.links.length > 3 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="flex items-center gap-1">
                            {versions.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url || link.active}
                                    className={`px-3 py-1 text-xs font-medium rounded border transition-colors
                                        ${link.active 
                                            ? 'bg-slate-800 text-white border-slate-800' 
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                        } ${!link.url && 'opacity-30 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </CarSettingLayout>
        </AppLayout>
    );
}