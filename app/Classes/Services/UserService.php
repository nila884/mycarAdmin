<?php

namespace App\Classes\Services;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Validator as ValidatorReturn;
use Spatie\Permission\Models\Role;

class UserService
{
    public function Index($data, $query)
    {
        // $users =  User::orderBy('id', 'desc')->paginate(15);
        // return $users;

        if (count($data) > 0) {
            if ($user = $data['user'] ?? '') {
                $query->orWhere(DB::raw("concat(first_name, ' ',last_name)"), 'LIKE', '%'.$user.'%')
                    ->orWhere(DB::raw("concat(last_name, ' ',fist_name)"), 'LIKE', '%'.$user.'%')
                    ->orWhere('phone', '=', $user)
                    ->orWhere('email', 'LIKE', '%'.$user.'%');
                // dd($query->get());

            }
            if ($status = $data['status'] ?? '') {
                $query->where('users.status', $status);
            }

            if ($role = $data['role'] ?? '') {
                $query->where('users.role', $role);
                // dd($query->get());
            }
            //   if ($simple_date = $data['simple_date'] ?? "") {
            //     $query
            //       ->where("users.created_at","=", Carbon::parse(trim(htmlspecialchars( $simple_date))));
            //   }
            //   if ($date = $data["date"] ?? "") {
            //     $dateEx = explode("to", $data['date'], 2);
            //     $start = Carbon::parse(trim(htmlspecialchars($dateEx[0])));
            //     $end = Carbon::parse(trim(htmlspecialchars($dateEx[1])));
            //     if ($start != $end) {
            //       $query
            //         ->where("users.created_at", ">=", $start)
            //         ->where("users.created_at", "<=", $end);
            //     }
            //   }
        }

        return $query;
    }

    public function Create(Request $request)
    {
        // dd($request->all());
        DB::beginTransaction();
        try {
            $user = User::create([
                'first_name' => trim(htmlspecialchars($request->first_name)),
                'last_name' => trim(htmlspecialchars($request->last_name)),
                'email' => trim(htmlspecialchars($request->email)),
                'phone' => trim(htmlspecialchars($request->phone)),
                'password' => Hash::make(trim($request->password)),
                'status' => 'active',
                'role' => 'user',
                'country_id' => $request->country_id,
            ]);

            $role = Role::where('name', $user->role)->first();
            if ($role != null) {
                $user->assignRole($role);
            } else {
                $msg = 'Role user not found';

                return $msg;
            }
            DB::commit();

            return $user;
        } catch (Exception $e) {
            DB::rollBack();

            return [
                $e->getMessage(),
                $e->getLine(),
                $e->getFile(),
            ];
        }
    }

    public function Update(Request $request, User $user): User
    {
        $user->update([
            'first_name' => trim(htmlspecialchars($request->first_name)),
            'last_name' => trim(htmlspecialchars($request->last_name)),
            'email' => trim(htmlspecialchars($request->email)),
            'phone' => trim(htmlspecialchars($request->phone)),
            'status' => $request->status,
            'role' => $request->role,
            'country' => $request->country_id,

        ]);
        if ($user->status == config('status.user.suspended')) {
            $user->tokens()->delete();
            Session::getHandler()->destroy($user->session_id);
            // $request->user('sanctum')->currentAccessToken()->delete();
            // AccountSuspendedJob::dispatch($user);
        }
        DB::table('model_has_roles')->where('model_id', $user->id)->delete();
        $user->assignRole(Role::where('name', $request->role)->first());

        return $user;
    }

    public function ChangePassword(Request $request, User $user)
    {
        $user->update(['password' => Hash::make(trim($request->password))]);
        $password = $request->password;

        // SentNewPasswordJob::dispatch($user, $password);
        return $user;
    }

    /**
     * Handles user registration, conditional seller profile creation, and role assignment.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function registerUser(Request $request): User
    {

        // 1. Validation Logic
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Password::defaults()],
            'user_type' => 'required|string|in:user,seller',
        ];

        // Conditional Validation (Only for Sellers)
        if ($request->user_type === 'seller') {
            $rules = array_merge($rules, [
                'seller_name' => 'required|string|max:255',
                'phone' => 'required|string|max:50',
                'country' => 'required|string|max:255',
                'address' => 'required|string|max:255',
            ]);
        }

        // Perform validation here (throws exception on failure)
        $request->validate($rules);

        // We wrap the creation process in a transaction for safety
        DB::beginTransaction();
        try {
            // 2. Create the User
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // 3. Conditional Seller Creation
            if ($request->user_type === 'seller') {
                Seller::create([
                    'seller_name' => $request->seller_name,
                    'phone' => $request->phone,
                    'email' => $user->email,
                    'country' => $request->country,
                    'address' => $request->address,
                ]);
            }

            // 4. Spatie Role Assignment
            $roleName = $request->user_type; // 'seller' or 'simple_user'

            $role = Role::where('name', $roleName)->first();

            if ($role) {
                $user->assignRole($role);
            }

            DB::commit();

            return $user;

        } catch (\Exception $e) {
            DB::rollBack();
            // Optional: Re-throw a generic exception or log the error
            throw new Exception('User registration failed: '.$e->getMessage());
        }
    }

    public function Delete(User $user): bool
    {
        if ($user->id === 1) {
            if ($request->has('role_id') || $request->has('status')) {
                abort(403, 'The role or status of the Super Admin (ID 1) cannot be changed.');
            }
        }

        return $user->delete();
    }

    /**
     * Validation
     */
    public function DataValidation(Request $request, string $method, User|bool|null $user = null, $pswd = false): ?ValidatorReturn
    {
        if ($pswd) {
            return Validator::make($request->all(), [
                'password' => ['required', Password::min(8)->numbers()->letters()->mixedCase()],
            ]);
        }
        switch (strtolower($method)) {
            case 'post':
                return Validator::make($request->all(), [
                    'first_name' => ['required', 'string'],
                    'last_name' => ['required', 'string'],
                    'email' => ['required', 'unique:users,email'],
                    'phone' => ['required', 'unique:users,phone'],
                    'password' => ['required', Password::min(8)->numbers()->letters()->mixedCase()],
                    'country_id' => ['required'],
                ]);
            case 'patch':
                return Validator::make($request->all(), [
                    'first_name' => ['required', 'string'],
                    'last_name' => ['required', 'string'],
                    'email' => ['required', Rule::unique('users', 'email')->ignore($user->id)],
                    'phone' => ['required',  Rule::unique('users', 'phone')->ignore($user->id)],
                    'status' => ['required'],
                    'role' => ['required'],
                    'country_id' => ['required', 'exists:countries,id'],

                ]);
            default:
                return null;
        }
    }
}
