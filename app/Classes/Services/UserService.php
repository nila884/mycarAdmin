<?php
namespace App\Classes\Services;



use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Validator as ValidatorReturn;

class UserService
{
  public function Index($data, $query)
  {
    // $users =  User::orderBy('id', 'desc')->paginate(15);
    // return $users;

    if (count($data) > 0) {
      if ($user = $data["user"] ?? "") {
        $query->orWhere(DB::raw("concat(first_name, ' ',last_name)"), 'LIKE', "%" . $user . "%")
          ->orWhere(DB::raw("concat(last_name, ' ',fist_name)"), 'LIKE', "%" . $user . "%")
          ->orWhere("phone", '=', $user)
          ->orWhere("email", 'LIKE', "%" . $user . "%");
        // dd($query->get());

      }
      if ($status = $data["status"] ?? "") {
        $query->where("users.status", $status);
      }

      if ($role = $data["role"] ?? "") {
        $query->where("users.role", $role);
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
        "first_name"      => trim(htmlspecialchars($request->first_name)),
        "last_name"      => trim(htmlspecialchars($request->last_name)),
        "email"     => trim(htmlspecialchars($request->email)),
        "phone" => trim(htmlspecialchars($request->phone)),
        "password"  => Hash::make(trim($request->password)),
        "status"    => "active",
        "role" => "user",
        "country_id" => $request->country_id
      ]);

      $role = Role::where("name", $user->role)->first();
      if ($role != null) {
        $user->assignRole($role);
      } else {
        $msg = "Role user not found";
        return $msg;
      }
      DB::commit();
      return $user;
    } catch (Exception $e) {
      DB::rollBack();
      return [
        $e->getMessage(),
        $e->getLine(),
        $e->getFile()
      ];
    }
  }
  public function Update(Request $request, User $user): User
  {
    $user->update([
        "first_name"      => trim(htmlspecialchars($request->first_name)),
        "last_name"      => trim(htmlspecialchars($request->last_name)),
      "email"     => trim(htmlspecialchars($request->email)),
      "phone" => trim(htmlspecialchars($request->phone)),
      "status"    => $request->status,
      "role" => $request->role,
      "country" => $request->country_id

    ]);
    if ($user->status == config('status.user.suspended')) {
      $user->tokens()->delete();
      Session::getHandler()->destroy($user->session_id);
      // $request->user('sanctum')->currentAccessToken()->delete();
      // AccountSuspendedJob::dispatch($user);
    }
    DB::table('model_has_roles')->where('model_id', $user->id)->delete();
    $user->assignRole(Role::where("name", $request->role)->first());
    return $user;
  }
  public function ChangePassword(Request $request, User $user)
  {
    $user->update(["password" => Hash::make(trim($request->password)),]);
    $password = $request->password;
    // SentNewPasswordJob::dispatch($user, $password);
    return $user;
  }

  public function Delete(User $user): bool
  {
    return $user->delete();
  }
  /**
   * Validation
   *
   * @param  Request $request
   * @param  string $method
   * @param  User|bool $user
   * @return ValidatorReturn|null
   */
  public function DataValidation(Request $request, String $method, User|bool $user = null, $pswd = false): ValidatorReturn|null
  {
    if ($pswd) {
      return Validator::make($request->all(), [
        "password"  => ["required", Password::min(8)->numbers()->letters()->mixedCase()],
      ]);
    }
    switch (strtolower($method)) {
      case 'post':
        return Validator::make($request->all(), [
          "first_name"      => ["required", "string"],
          "last_name"      => ["required", "string"],
          "email"     => ["required", "unique:users,email"],
          "phone" => ["required", "unique:users,phone"],
          "password"  => ["required", Password::min(8)->numbers()->letters()->mixedCase()],
          "country_id" => ['required']
        ]);
      case 'patch':
        return Validator::make($request->all(), [
          "first_name"      => ["required", "string"],
          "last_name"      => ["required", "string"],
          "email"     => ["required", Rule::unique("users", "email")->ignore($user->id)],
          "phone" => ["required",  Rule::unique("users", "phone")->ignore($user->id)],
          "status"    => ["required"],
          "role" => ['required'],
          "country_id" => ['required', "exists:countries,id"]

        ]);
      default:
        return null;
    }
  }

}
