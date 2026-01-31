import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CityObject, CountryObject } from '@/lib/object';
import { router, useForm } from '@inertiajs/react';
import { Building2, MapPin, Plus, Trash2 } from 'lucide-react';
import React from 'react';

interface Props {
    country: CountryObject;
}

const ManageCities: React.FC<Props> = ({ country }) => {
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        country_id: country.id,
        is_hub: false,
    });

    const handleAddCity = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('shipping.cities.store'), {
            onSuccess: () => reset('name'),
        });
    };

    const handleDeleteCity = (id: number) => {
        if (confirm('Are you sure you want to remove this city?')) {
            router.delete(route('shipping.cities.destroy', id));
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Building2 className="h-4 w-4 text-emerald-600" /> Cities
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-slate-400" />
                        Cities in {country.country_name}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleAddCity} className="flex gap-2 pt-4">
                    <div className="flex-1">
                        <Input placeholder="Add city name..." value={data.name} onChange={(e) => setData('name', e.target.value)} />
                    </div>
                    <Button type="submit" disabled={processing || !data.name}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </form>

                <div className="mt-6 max-h-[300px] space-y-2 overflow-y-auto pr-2">
                    {country.cities && country.cities.length > 0 ? (
                        country.cities.map((city: CityObject) => (
                            <div key={city.id} className="group flex items-center justify-between rounded-lg border bg-slate-50/50 p-3">
                                <span className="text-sm font-medium">{city.name}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 opacity-0 transition-opacity group-hover:opacity-100"
                                    onClick={() => handleDeleteCity(city.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="py-4 text-center text-sm text-slate-400">No cities registered.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ManageCities;
