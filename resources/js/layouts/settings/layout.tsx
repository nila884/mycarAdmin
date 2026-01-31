import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react'; // Added usePage
import { type PropsWithChildren } from 'react';

// 1. Change hardcoded paths to Route Names
const sidebarNavItems: (Omit<NavItem, 'href'> & { routeName: string })[] = [
    {
        title: 'Profile',
        routeName: 'profile.edit',
        icon: null,
    },
    {
        title: 'Password',
        routeName: 'password.edit',
        icon: null,
    },
    {
        title: 'Appearance',
        routeName: 'appearance', // Update this to your actual route name
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // 2. Use usePage to get the current URL reliably in Inertia
    const { url } = usePage();

    return (
        <div className="px-4 py-6">
            <Heading title="Settings" description="Manage your profile and account settings" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => {
                            // 3. Generate the dynamic URL based on the route name
                            const href = route(item.routeName);
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
                                    <Link href={route(href)} prefetch>
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