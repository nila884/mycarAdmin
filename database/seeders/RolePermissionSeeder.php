<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdmin = Role::findByName('super-admin');
        $admin = Role::findByName('admin');
        $agency = Role::findByName('agency');
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

        // agency: can only view cars and agency
        $agency->givePermissionTo([
            "car.view",
            "car.create",
            "car.update",
            "user.view",

        ]);

        // user: only view car
        $user->givePermissionTo("car.view");
    }
}
