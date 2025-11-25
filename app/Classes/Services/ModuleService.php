<?php
namespace App\Classes\Services;


use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidatorReturn;

class ModuleService
{
  public function Index()
  {
   
    $modules =  Module::paginate(15);
    $modules->getCollection()->transform(function($module){
      return[
        'id'=>$module->id,
        'name'=>$module->name,
        'created_at'=>$module->created_at->format('Y-m-d'),
        'updated_at'=>$module->updated_at->format('Y-m-d'),
      ];
    });
  return $modules ;
  }
  public function Create(Request $request)
  {
    $name = trim(strtolower(htmlspecialchars($request->name)));
    return Module::create(["name" => $name]);
  }
  public function Update(Request $request, Module $module): Module
  {
    $name = trim(strtolower(htmlspecialchars($request->name)));
    $module->update(["name" => $name]);
    return $module;
  }

  public function Delete(Module $module): bool
  {
    return $module->delete();
  }
  /**
   * Validation
   *
   * @param  Request $request
   * @param  string $method
   * @param  Module|bool $module
   * @return ValidatorReturn|null
   */
  public function DataValidation(Request $request, String $method, Module|bool $module = null): ValidatorReturn|null
  {
    switch (strtolower($method)) {
      case 'post':
        return Validator::make($request->all(), [
          "name" => ["required", "unique:modules,name"]
        ]);
      case 'patch':
        return Validator::make($request->all(), [
          "name" => ["required", Rule::unique("modules", "name")->ignore($module->id)]
        ]);
      default:
        return null;
    }
  }
}
