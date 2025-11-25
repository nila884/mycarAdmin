<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use App\Classes\Services\PermissionService;
// use App\classes\service\PermissionService;

class PermissionController extends Controller
{
    private PermissionService $permissionService;

    public function __construct()
    {
        $this->permissionService = new PermissionService();
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $permissions = $this->permissionService->Index($request);
        return $permissions;
        $modules = Module::get()->pluck("name", "id")->toArray();
        $actions = ['view', 'create', 'update', 'delete'];
        return view("admin.permission.index", compact("permissions", "modules", "actions"));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $actions = ['view', 'create', 'update', 'delete'];
        $actions = implode(",", $actions);

        $data = $request->validate([
            "module" => ["required", "exists:modules,id"],
            "can_do"  => ["required", "array", "in:" . $actions],
        ]);
        // if ($data->fails()) {
        //     return back()->withInput()->withErrors($data);
        // }
        $permission = $this->permissionService->Create($request);
        return $permission;
        return back()->with("success", "Permission successfully created.");
    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permission $permission)
    {
        return view("admin.permission.index", compact("permission"));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Permission $permission)
    {
        // dd($permission);
        $data = $request->validate([

            "name"    => ["required", "unique:permissions,name"],
        ]);
        // if ($data->fails()) {
        //     return back()->withInput()->withErrors($data, "err_" . $permission->id)->with("err", $permission->id);
        // }
        $permission = $this->permissionService->Update($request, $permission);
        return $permission;
        return back()->with("success", "Permission ($permission->name) successfully updated.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        $name = $permission->name;
        $this->permissionService->Delete($permission);
        return back()->with("success", "Permission ($permission->name) successfully updated.");
    }
}
