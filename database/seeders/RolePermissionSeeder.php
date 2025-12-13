<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdmin = Role::findByName('super-admin');
        $admin = Role::findByName('admin');
        $seller = Role::findByName('seller');
        $user = Role::findByName('user');

        $superAdmin->givePermissionTo(Permission::all());

        // admin can manage all modules except delete
        foreach (Module::all() as $module) {
            $admin->givePermissionTo([
                "{$module->name}.view",
                "{$module->name}.create",
                "{$module->name}.update",
            ]);
        }

        // seller: can only view cars and seller
        $seller->givePermissionTo([
            'car.view',
            'car.create',
            'car.update',
            'user.view',

        ]);

        // user: only view car
        $user->givePermissionTo('car.view');
    }
}
