<?php

namespace App\Http\Controllers;

use App\Classes\Services\UserService;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    private UserService $userService;

    public function __construct()
    {
        $this->userService = new UserService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
    
    $users = $this->userService->index();

    $users->through(fn ($user) => new UserResource($user));

    return Inertia::render('user/list', [
        'users' => $users,
        'filters' => request()->only('search', 'sort'),
    ]);
        
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    // /**
    //  * Store a newly created resource in storage.
    //  */
    // public function store(Request $request)
    // {
    //     $data = $this->userService->DataValidation($request, 'post');
    //     if ($data->fails()) {
    //         return back()->withInput()->withErrors($data);
    //     }
    //     $user = $this->userService->Create($request);

    //     // dd($user);
    //     return redirect()->route('user.index')->with('success', 'User successfully created.');
    // }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return view('admin.user.index', compact('user'));
    }

    // /**
    //  * Update the specified resource in storage.
    //  */
    // public function update(Request $request, User $user)
    // {
    //     $data = $this->userService->DataValidation($request, 'patch', $user);
    //     if ($data->fails()) {
    //         return back()->withInput()->withErrors($data, 'err_'.$user->id)->with('err', $user->id);
    //     }
    //     $user = $this->userService->Update($request, $user);

    //     return redirect()->route('user.index')->with('success', "User ($user->first_name) successfully updated.");
    // }

    // /**
    //  * Remove the specified resource from storage.
    //  */
    // public function destroy(User $user)
    // {
    //     $name = $user->name;
    //     $this->userService->Delete($user);

    //     return redirect()->route('user.index')->with('success', "User ($user->first_name) successfully updated.");
    // }

    // /**
    //  * Update the specified resource in storage.
    //  */
    // public function change_password(Request $request, User $user)
    // {
    //     $data = $this->userService->DataValidation($request, 'patch', $user, true);
    //     if ($data->fails()) {
    //         return back()->withInput()->withErrors($data, 'err_pswd_'.$user->id)->with('err_pwsd', $user->id);
    //     }
    //     $user = $this->userService->ChangePassword($request, $user);

    //     return back()->with('success', "Reset password for ($user->first_name), successfully reset.");
    // }
}
