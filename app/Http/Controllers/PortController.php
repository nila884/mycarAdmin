<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Port;
use App\Classes\Services\PortService;
use App\Http\Resources\PortResource;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\JsonResponse;
use App\Models\Country;

class PortController extends Controller
{
    protected $portService;

    public function __construct(PortService $portService)
    {
        $this->portService = $portService;
    }

    public function index()
    {
        return Inertia::render('shipping/ports/list', [
            'ports' => $this->portService->Index(),
            'countries' => Country::orderBy('country_name', 'asc')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validator = $this->portService->DataValidation($request, 'post');
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
        $this->portService->Create($request);
        return redirect()->route('port.index')->with('success', 'Port created successfully!');
    }

    public function update(Request $request, Port $port)
    {
        $validator = $this->portService->DataValidation($request, 'patch', $port);
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
        $this->portService->Update($request, $port);
        return redirect()->route('port.index')->with('success', 'Port updated successfully!');
    }

    public function destroy(Port $port)
    {
        $this->portService->Delete($port);
        return redirect()->route('port.index')->with('success', 'Port deleted successfully!');
    }

    public function apiIndex(): JsonResponse
    {
        $ports = Port::with('country')->orderBy('name', 'asc')->get();
        return PortResource::collection($ports)->response();
    }
}