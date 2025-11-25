<?php

namespace App\Http\Controllers\admin;

use App\Classes\Services\UserService;
use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;
use SDamian\LaravelManPagination\Pagination;
use Spatie\Permission\Models\Role;

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
        // if ((Gate::denies('manage user'))) {
        //     return view('admin.error.notAuthorize');
        // }

        $data = Validator::make($request->all(), [
            'user' => ['nullable', 'string'],
            'status' => ['nullable', 'string'],
            'date' => ['nullable', 'string'],
            'role_id' => ['nullable'],
            'simple_date' => ['nullable'],
        ])->validated();

        $user = User::query();
        $users = $this->userService->Index($data, $user);
        // dd($purchases->get());
        // $total = $users->count();
        // $pagination = new Pagination(['options_select' => config('pagination.options_select')]);
        // $pagination->paginate($total);
        // $limit = $pagination->limit();
        // $offset = $pagination->offset();
        $users = $users->orderBy('users.id', 'desc')->paginate(15);
        $roles = Role::all();
        $Countries = Country::all();

        // $statusAll=Status::where("module", "user")->get();
        // $status = Status::where("module", "user")->get()->pluck("name", "id");
        return view('admin.users.index', compact('users', 'Countries', 'roles'));
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
        $data = $this->userService->DataValidation($request, 'post');
        if ($data->fails()) {
            return back()->withInput()->withErrors($data);
        }
        $user = $this->userService->Create($request);

        // dd($user);
        return redirect()->route('user.index')->with('success', 'User successfully created.');
    }

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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $data = $this->userService->DataValidation($request, 'patch', $user);
        if ($data->fails()) {
            return back()->withInput()->withErrors($data, 'err_'.$user->id)->with('err', $user->id);
        }
        $user = $this->userService->Update($request, $user);

        return redirect()->route('user.index')->with('success', "User ($user->first_name) successfully updated.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $name = $user->name;
        $this->userService->Delete($user);

        return redirect()->route('user.index')->with('success', "User ($user->first_name) successfully updated.");
    }

    /**
     * Update the specified resource in storage.
     */
    public function change_password(Request $request, User $user)
    {
        $data = $this->userService->DataValidation($request, 'patch', $user, true);
        if ($data->fails()) {
            return back()->withInput()->withErrors($data, 'err_pswd_'.$user->id)->with('err_pwsd', $user->id);
        }
        $user = $this->userService->ChangePassword($request, $user);

        return back()->with('success', "Reset password for ($user->first_name), successfully reset.");
    }
}
