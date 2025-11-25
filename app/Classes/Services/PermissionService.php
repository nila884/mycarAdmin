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

        return $permissions;
    }

    public function Create(Request $request)
    {
        $mod = Module::find($request->module);
        foreach ($request->can_do as $v) {
            $name = trim(strtolower(htmlspecialchars($v.' '.$mod->name)));
            Permission::firstOrCreate(['name' => $name]);
        }

        return true;
    }

    public function Update(Request $request, Permission $permission): Permission
    {
        return $permission;
        // $name = trim(strtolower(htmlspecialchars($request->name)));
        // $permission->update(["name" => $name]);
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
                    'can_do' => ['required', 'array', 'in:'.$actions],
                    // "name"    => ["required", "unique:permissions,name"],
                ]);
            case 'patch':
                return Validator::make($request->all(), [
                    'module' => ['required', 'exists:modules,id'],
                    'can_do' => ['required', 'array', 'in:'.$actions],
                    // "name" => ["required", Rule::unique("permissions", "name")->ignore($permission->id)],
                ]);
            default:
                return null;
        }
    }
}
