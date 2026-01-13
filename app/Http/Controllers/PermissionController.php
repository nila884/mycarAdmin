<?php

namespace App\Http\Controllers;

use App\Classes\Services\PermissionService;
use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

// use App\classes\service\PermissionService;

class PermissionController extends Controller
{
    private PermissionService $permissionService;

    public function __construct()
    {
        $this->permissionService = new PermissionService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $permissions = $this->permissionService->Index($request);

        $modules = Module::get()->pluck('name', 'id')->map(function ($item, $key) {
            return [
                'id' => $key,
                'name' => $item,
            ];
        })->values();
        $actions = ['view', 'create', 'update', 'delete'];

        return Inertia::render('management/permission/permission',
            [
                'permissions' => $permissions,
                'modules' => $modules,
                'actions' => $actions,
            ]
        );
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
        $actions = implode(',', $actions);

        $data = $request->validate([
            'module' => ['required', 'exists:modules,id'],
            'actions' => ['required', 'array', 'in:'.$actions],
        ]);

        $permission = $this->permissionService->Create($request);

        return back()->with('success', 'Permission successfully created.');
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
        return view('admin.permission.index', compact('permission'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Permission $permission)
    {

        // The actions array defined here should match the one in your index/store methods
        $actions = ['view', 'create', 'update', 'delete'];
        $actionsString = implode(',', $actions);

        // 1. Validate the incoming module and actions data
        $request->validate([
            'module' => ['required', 'exists:modules,id'],
            'actions' => ['required', 'array', 'in:'.$actionsString],
        ]);

        // 2. Call the service to synchronize the permissions for the module
        // The service will handle the complex logic of creating or deleting individual permissions.
        $this->permissionService->Update($request, $permission);

        // 3. Return a general success message (since multiple permissions were affected)
        return redirect()->route('permission.index')->with('success', 'Permissions for module successfully updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {

        $name = $permission->name;

        $this->permissionService->Delete($permission);

        return back()->with('success', "Permission ($permission->name) successfully updated.");
    }
}
