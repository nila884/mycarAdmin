'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface FeatureItem {
    id: number;
    feature_name: string;
    description: string;
    is_main: boolean;
    icon: string | null;
}

interface FeatureGridProps {
    features: FeatureItem[];
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
    if (features.length === 0) {
        return <p className="text-center text-muted-foreground py-10">No features listed for this vehicle.</p>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
                <Card 
                    key={feature.id} 
                    className={`relative overflow-hidden transition-all hover:shadow-md ${
                        feature.is_main ? 'border-primary/50 bg-primary/5' : 'border-border'
                    }`}
                >
                    {feature.is_main && (
                        <div className="absolute top-2 right-2">
                            <Star className="size-4 fill-primary text-primary" />
                        </div>
                    )}
                    
                    <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                        {/* Icon Container */}
                        <div className="size-12 flex items-center justify-center rounded-full bg-background border shadow-sm p-2">
                            {feature.icon ? (
                                <img 
                                    src={feature.icon} 
                                    alt={feature.feature_name} 
                                    className="size-full object-contain" 
                                />
                            ) : (
                                <div className="size-full bg-muted rounded-full animate-pulse" />
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="space-y-1">
                            <h4 className="font-semibold text-sm leading-tight">
                                {feature.feature_name}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {feature.description}
                            </p>
                        </div>

                        {feature.is_main && (
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                                Key Feature
                            </Badge>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default FeatureGrid;