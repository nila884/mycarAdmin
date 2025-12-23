<?php
namespace App\Http\Controllers;

use App\Classes\Services\DeliveryDriverAgencyService;
use App\Models\DeliveryDriverAgency;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeliveryDriverAgencyController extends Controller
{
    protected $service;

    public function __construct(DeliveryDriverAgencyService $service)
    {
        $this->service = $service;
    }

    public function index()
{
    return Inertia::render('shipping/agencies/list', [
        'agencies' => $this->service->Index() // Or use a Resource for better control
    ]);
}

    public function store(Request $request)
    {
        $this->service->Create($request);
        return redirect()->back()->with('success', 'Agency registered successfully.');
    }

    public function update(Request $request, DeliveryDriverAgency $agency)
    {
        $this->service->Update($request, $agency);
        return redirect()->back()->with('success', 'Agency updated successfully.');
    }

    public function destroy(DeliveryDriverAgency $agency)
    {
        $this->service->Delete($agency);
        return redirect()->back()->with('success', 'Agency removed successfully.');
    }
}