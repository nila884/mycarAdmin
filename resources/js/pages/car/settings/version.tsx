'use client';

import VersionForm from '@/components/car/settings/version/versionForm';
import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card} from '@/components/ui/card';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
import { cn, timeFormat } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Trash2, Calendar, CarFront } from 'lucide-react';
import React from 'react';
import { BrandItem } from './brand';
import { CarModelItem } from './model';

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
        meta: { // Pagination stats live here
            current_page: number;
            last_page: number;
            from: number;
            to: number;
            total: number;
            links: Array<{
                url: string | null;
                label: string;
                active: boolean;
            }>;
        };
    };
    carModels: CarModelItem[];
    brands: BrandItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Car settings', href: 'car.settings.brand' },
    { title: 'Versions', href: 'car.settings.version' },
];

export default function Version({ versions, carModels, brands }: VersionProps) {
    
         
    const handleDelete = (id: number) => {
        if (!confirm('Are you sure? This action cannot be undone.')) return;
        router.delete(route('car.settings.version.destroy', id), { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Version Settings" />

            <CarSettingLayout>
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
                        <HeadingSmall 
                            title="Car Versions" 
                            description="Manage your vehicle specific trim levels and years." 
                        />
                        <VersionForm carModels={carModels} brands={brands} />
                    </div>

                    {/* Table Section */}
                    <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="font-semibold">Version & Year</TableHead>
                                    <TableHead className="font-semibold">Model Hierarchy</TableHead>
                                    <TableHead className="font-semibold">Timestamps</TableHead>
                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {versions.data.length > 0 ? (
                                    versions.data.map((version) => (
                                        <TableRow key={version.id} className="group transition-colors">
                                            {/* Version Name and Year */}
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground">
                                                        {version.version_name.toUpperCase()}
                                                    </span>
                                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                                        <Calendar className="mr-1 size-3" />
                                                        {version.version_year}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Model and Brand Badge */}
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="font-normal border-primary/20 bg-primary/5 text-primary">
                                                        {version.car_model.brand?.brand_name}
                                                    </Badge>
                                                    <span className="text-muted-foreground">/</span>
                                                    <span className="font-medium">{version.car_model.model_name}</span>
                                                </div>
                                            </TableCell>

                                            {/* Timestamps */}
                                            <TableCell>
                                                <div className="text-xs space-y-1">
                                                    <p className="text-muted-foreground">Added: {timeFormat(version.created_at)}</p>
                                                    <p className="text-[10px] text-muted-foreground/70 italic">Updated: {timeFormat(version.updated_at)}</p>
                                                </div>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <VersionForm version={version} carModels={carModels} brands={brands} />
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() => handleDelete(version.id)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <CarFront className="size-8 opacity-20" />
                                                <p>No car versions found.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Pagination - Cleaned up styling */}
                   {/* 2. Fixed Pagination Logic */}
                    {versions.meta && versions.meta.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-border px-4 py-4 mt-4">
                            <div className="flex flex-1 items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Showing <span className="font-medium">{versions.meta.from}</span> to{' '}
                                    <span className="font-medium">{versions.meta.to}</span> of{' '}
                                    <span className="font-medium">{versions.meta.total}</span> results
                                </p>
                                
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm bg-background">
                                    {versions.meta.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url || link.active}
                                            className={cn(
                                                "relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-all",
                                                link.active 
                                                    ? "z-10 bg-primary text-primary-foreground ring-1 ring-primary" 
                                                    : "text-foreground ring-1 ring-inset ring-border hover:bg-muted",
                                                !link.url && "opacity-50 cursor-not-allowed",
                                                index === 0 && "rounded-l-md",
                                                index === versions.meta.links.length - 1 && "rounded-r-md"
                                            )}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
                <h4>test</h4>
            </CarSettingLayout>
        </AppLayout>
    );
}