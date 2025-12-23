import React from 'react';
import { useForm, router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Plus, Trash2, Building2 } from 'lucide-react';
import { CountryObject, CityObject } from '@/lib/object';

interface Props {
    country: CountryObject;
}

const ManageCities: React.FC<Props> = ({ country }) => {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        country_id: country.id,
        is_hub: false
    });

    const handleAddCity = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('cities.store'), {
            onSuccess: () => reset('name'),
        });
    };

    const handleDeleteCity = (id: number) => {
        if (confirm('Are you sure you want to remove this city?')) {
            router.delete(route('cities.destroy', id));
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" /> Cities
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-slate-400" />
                        Cities in {country.country_name}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleAddCity} className="flex gap-2 pt-4">
                    <div className="flex-1">
                        <Input 
                            placeholder="Add city name..." 
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={processing || !data.name}>
                        <Plus className="w-4 h-4" />
                    </Button>
                </form>

                <div className="mt-6 space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {country.cities && country.cities.length > 0 ? (
                        country.cities.map((city: CityObject) => (
                            <div key={city.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50/50 group">
                                <span className="text-sm font-medium">{city.name}</span>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDeleteCity(city.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-4 text-slate-400 text-sm">No cities registered.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ManageCities;