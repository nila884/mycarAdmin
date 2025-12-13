<?php

namespace App\Classes\Services;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidatorReturn;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleService
{
    public function Index(Request $request)
    {
        // 1. Eager load permissions to avoid N+1 queries.
        $roles = Role::with('permissions')->paginate(15);

        $roles->getCollection()->transform(function ($role) {

            // Map the associated permissions to a simple array of ID and name
            $permissions = $role->permissions->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                ];
            })->values()->toArray();

            return [
                'id' => $role->id,
                'name' => $role->name,
                // CRITICAL: Include the eager-loaded and transformed permissions
                'permissions' => $permissions,
                'created_at' => $role->created_at->format('Y-m-d'),
                'updated_at' => $role->updated_at->format('Y-m-d'),
            ];
        });

        return $roles;
    }

    public function Create(Request $request): Role|RedirectResponse
    {
        DB::beginTransaction();
        try {
            $name = trim(strtolower(htmlspecialchars($request->name)));
            $role = Role::create(['name' => $name]);
            foreach ($request->permission as $perm) {

                $permission = Permission::findById($perm);
                $role->givePermissionTo($permission);
            }
            DB::commit();

            return $role;
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withInput()->with('error', 'Error occured while save role');
        }
    }

    public function Update(Request $request, Role $role): Role|RedirectResponse
    {
        if ($role->id === 1 || $role->name === 'super-admin') {
            abort(403, "The foundational 'super-admin' role cannot be modified.");
        }

        // dd($request->all());
        DB::beginTransaction();
        try {
            $name = trim(strtolower(htmlspecialchars($request->name)));
            // Revoke permission
            $p_all = Permission::all();
            $role->revokePermissionTo($p_all);

            $permission = Permission::whereIn('id', $request->permission)->get();
            $role->givePermissionTo($permission);
            $role->update(['name' => $name]);
            DB::commit();

            return $role;
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withInput()->with('error', 'Error occured while save role');
        }

    }

    public function Delete(Role $role): bool
    {
        if ($role->id === 1 || $role->name === 'super-admin') {
            abort(403, "The foundational 'super-admin' role cannot be deleted.");
        }

        return $role->delete();
    }

    /**
     * Validation
     */
    public function DataValidation(Request $request, string $method, Role|bool|null $role = null): ?ValidatorReturn
    {
        $msg = ['permission.required' => 'Select 1 or more permissions'];
        switch (strtolower($method)) {
            case 'post':
                return Validator::make($request->all(), [
                    'name' => ['required', 'unique:roles,name'],
                    'permission' => ['required', 'array', 'exists:permissions,id'],
                ], $msg);
            case 'patch':
                return Validator::make($request->all(), [
                    'name' => ['required', Rule::unique('roles', 'name')->ignore($role->id)],
                    'permission' => ['required', 'array', 'exists:permissions,id'],
                ], $msg);
            default:
                return null;
        }
    }
}
