<?php
namespace App\Classes\Services;


use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Illuminate\Http\RedirectResponse;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Validator as ValidatorReturn;

class RoleService
{
  public function Index(Request $request)
  {
    $roles =  Role::paginate(15);
    return $roles;
  }
  public function Create(Request $request): Role|RedirectResponse
  {
    DB::beginTransaction();
    try {
      $name = trim(strtolower(htmlspecialchars($request->name)));
      $role =  Role::create(["name" => $name]);
      foreach ($request->permission as $perm) {
        
        $permission = Permission::findById($perm);
        $role->givePermissionTo($permission);
      }
      DB::commit();
      return $role;
    } catch (\Exception $e) {
      DB::rollBack();
      return back()->withInput()->with("error", "Error occured while save role");
    }
  }
  public function Update(Request $request, Role $role): Role|RedirectResponse
  {
    // dd($request->all());
    DB::beginTransaction();
    try {
      $name = trim(strtolower(htmlspecialchars($request->name)));
      //Revoke permission
      $p_all = Permission::all();
      $role->revokePermissionTo($p_all);

      $permission = Permission::whereIn("id", $request->permission)->get();
      $role->givePermissionTo($permission);
      $role->update(["name" => $name]);
      DB::commit();
      return $role;
    } catch (\Exception $e) {
      DB::rollBack();
      return back()->withInput()->with("error", "Error occured while save role");
    }

    
  }

  public function Delete(Role $role): bool
  {
    return $role->delete();
  }
  /**
   * Validation
   *
   * @param  Request $request
   * @param  string $method
   * @param  Role|bool $role
   * @return ValidatorReturn|null
   */
  public function DataValidation(Request $request, String $method, Role|bool $role = null): ValidatorReturn|null
  {
    $msg = ["permission.required" => "Select 1 or more permissions"];
    switch (strtolower($method)) {
      case 'post':
        return Validator::make($request->all(), [
          "name"        => ["required", "unique:roles,name"],
          "permission"  => ["required", "array", "exists:permissions,id"]
        ], $msg);
      case 'patch':
        return Validator::make($request->all(), [
          "name"        => ["required", Rule::unique("roles", "name")->ignore($role->id)],
          "permission"  => ["required", "array", "exists:permissions,id"]
        ], $msg);
      default:
        return null;
    }
  }
}
