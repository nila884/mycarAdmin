<?php

namespace App\Classes\Services;

use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidatorReturn;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    public function Index(Request $request)
    {
        $permissions = Permission::paginate(15);
        $permissions->getCollection()->transform(function ($permission) {
            return [
                'id' => $permission->id,
                'name' => $permission->name,
                'guard_name' => $permission->guard_name,
                'created_at' => $permission->created_at->format('Y-m-d'),
                'updated_at' => $permission->updated_at->format('Y-m-d'),
            ];
        });

        return $permissions;
    }

    public function Create(Request $request)
    {
        $mod = Module::find($request->module);
        foreach ($request->actions as $v) {
            $name = trim(strtolower(htmlspecialchars($v.' '.$mod->name)));
            Permission::firstOrCreate(['name' => $name]);
        }

        return true;
    }

    public function Update(Request $request, Permission $representativePermission): bool
    {

        $newModuleId = $request->input('module');
        $newActions = $request->input('actions');

        $availableActions = ['view', 'create', 'update', 'delete'];

        // 2. Look up the new Module name
        $mod = Module::find($newModuleId);
        if (! $mod) {
            return false;
        }
        $moduleName = strtolower($mod->name); // e.g., 'user'
        $guardName = 'web';

        $existingPermissions = Permission::where('name', 'like', "% {$moduleName}")->get();

        foreach ($availableActions as $action) {
            $fullPermissionName = strtolower($action).' '.$moduleName;

            if (in_array($action, $newActions)) {
                Permission::firstOrCreate([
                    'name' => $fullPermissionName,
                    'guard_name' => $guardName,
                ]);
            } else {
                // Action is UNSELECTED: Ensure it DOES NOT EXIST
                $permissionToDelete = $existingPermissions->firstWhere('name', $fullPermissionName);

                if ($permissionToDelete) {
                    $permissionToDelete->delete();
                }
            }
        }

        return true;
    }

    public function Delete(Permission $permission): bool
    {
        return $permission->delete();
    }

    /**
     * Validation
     */
    public function DataValidation(Request $request, string $method, Permission|bool|null $permission = null): ?ValidatorReturn
    {
        $actions = implode(',', config('permission.action'));
        switch (strtolower($method)) {
            case 'post':
                return Validator::make($request->all(), [
                    'module' => ['required', 'exists:modules,id'],
                    'actions' => ['required', 'array', 'in:'.$actions],
                    // "name"    => ["required", "unique:permissions,name"],
                ]);
            case 'patch':
                return Validator::make($request->all(), [
                    'module' => ['required', 'exists:modules,id'],
                    'actions' => ['required', 'array', 'in:'.$actions],
                    // "name" => ["required", Rule::unique("permissions", "name")->ignore($permission->id)],
                ]);
            default:
                return null;
        }
    }
}
