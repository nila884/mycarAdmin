import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

// Using route names ensures the hidden prefix is always included
const sidebarNavItems = [
    { title: 'Category', routeName: 'car.settings.category' },
    { title: 'Brand', routeName: 'car.settings.brand' },
    { title: 'Model', routeName: 'car.settings.model' },
    { title: 'Fuel', routeName: 'car.settings.fuel' },
    { title: 'Feature', routeName: 'car.settings.feature' },
    { title: 'Seller', routeName: 'car.settings.seller' },
    { title: 'Version', routeName: 'car.settings.version' },
    { title: 'Color', routeName: 'car.settings.color' },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { url } = usePage();

    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="px-4 py-6">
            <Heading title="Settings" description="Manage your car settings" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => {
                            // Generate the absolute URL with the secret prefix
                            const href = route(item.routeName);
                            
                            // Check if the current browser URL matches this menu item
                            const isActive = url.startsWith(new URL(href).pathname);

                            return (
                                <Button
                                    key={`${item.routeName}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn('w-full justify-start', {
                                        'bg-muted': isActive,
                                    })}
                                >
                                    <Link href={href} prefetch>
                                        {item.title}
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}