import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

// Use route names instead of hardcoded paths
const sidebarNavItems = [
    {
        title: 'Modules',
        routeName: 'management.modules', // Use your actual Laravel route name
        icon: null,
    },
    {
        title: 'Permissions',
        routeName: 'management.permissions',
        icon: null,
    },
    {
        title: 'Roles',
        routeName: 'management.roles',
        icon: null,
    },
];

export default function Layout({ children }: PropsWithChildren) {
    const { url } = usePage();

    // Safety check for SSR
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="px-4 py-6">
            <Heading title="Management" description="Manage permission and role" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => {
                            // Ziggy's route() function handles the secret prefix automatically
                            const href = route(item.routeName);
                            
                            // Check if current path matches the link path
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