<?php

namespace App\Http\Controllers;

use App\Classes\Services\RoleService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\ValidationException;


class RoleController extends Controller
{
    private RoleService $roleService;

    public function __construct()
    {
        $this->roleService = new RoleService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $permissions = Permission::all()->map(function ($permission) {
            return [
                'id' => $permission->id,
                'name' => $permission->name,
            ];
        })->toArray();

        return Inertia::render('management/role/role', [
            'roles' => $this->roleService->Index($request),
            'permissions' => $permissions,
        ]);
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

        $validator = $this->roleService->DataValidation($request, 'post');
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
        try {
            $this->roleService->Create($request);
            return redirect()->back()->with('success', 'Role created successfully!');
        } catch (\Exception $e) {
            return [
                'status' => false,
                'msg' => 'Failed to create Role. Please try again.',
            ];
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        return view('admin.role.index', compact('role'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        $validator = $this->roleService->DataValidation($request, 'patch', $role);
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
        try {
            $this->roleService->Update($request, $role);
            return redirect()->back()->with('success', 'Role updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to update role. Please try again.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        // $name = $role->name;
        // $this->roleService->Delete($role);

        // return back()->with('success', "Role ($role->name) successfully updated.");

                try {
            $this->roleService->Delete($role);
            return redirect()->back()
                ->with('success', 'Role deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to delete role. Please try again.']);
        }        
    }
}
