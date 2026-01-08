<?php
namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Country;
use App\Models\Port;
use App\Models\ShippingRate;
use App\Models\DeliveryTariff;

class ShippingLogisticSeeder extends Seeder
{
    public function run(): void
    {
        // --- 1. COUNTRIES ---
        $japanId = DB::table('countries')->insertGetId([
            'country_name' => 'Japan', 'code' => 'JP', 'prefix' => '+81', 'currency' => 'JPY', 'created_at' => now()
        ]);
        $sKoreaId = DB::table('countries')->insertGetId([
            'country_name' => 'South Korea', 'code' => 'KR', 'prefix' => '+82', 'currency' => 'KRW', 'created_at' => now()
        ]);
        $kenyaId = DB::table('countries')->insertGetId([
            'country_name' => 'Kenya', 'code' => 'KE', 'prefix' => '+254', 'currency' => 'KES', 'created_at' => now()
        ]);
        $tanzaniaId = DB::table('countries')->insertGetId([
            'country_name' => 'Tanzania', 'code' => 'TZ', 'prefix' => '+255', 'currency' => 'TZS', 'created_at' => now()
        ]);
        $rwandaId = DB::table('countries')->insertGetId([
            'country_name' => 'Rwanda', 'code' => 'RW', 'prefix' => '+250', 'currency' => 'RWF', 'created_at' => now()
        ]);
        $zimbabweId = DB::table('countries')->insertGetId([
            'country_name' => 'Zimbabwe', 'code' => 'ZW', 'prefix' => '+263', 'currency' => 'USD', 'created_at' => now()
        ]);

        // --- 2. PORTS ---
        $yokohamaId = DB::table('ports')->insertGetId(['name' => 'Yokohama', 'code' => 'JPYOK', 'country_id' => $japanId]);
        $busanId = DB::table('ports')->insertGetId(['name' => 'Busan', 'code' => 'KRBUS', 'country_id' => $sKoreaId]);
        $mombasaId = DB::table('ports')->insertGetId(['name' => 'Mombasa', 'code' => 'KEMOM', 'country_id' => $kenyaId]);
        $darEsSalaamId = DB::table('ports')->insertGetId(['name' => 'Dar Es Salaam', 'code' => 'TZDAR', 'country_id' => $tanzaniaId]);
        $kigaliId= City::create(["country_id"=>$rwandaId,"name" => "kigali",]);
        $gasenyiId=City::create(["country_id"=>$rwandaId,"name" => "gisenyi",]);
        $nairobiId=City::create(["country_id"=>$kenyaId,"name" => "nairobi",]);
        $harareId=City::create(["country_id"=>$zimbabweId,"name" => "harare",]);
        $dodomaId=City::create(["country_id"=>$tanzaniaId,"name" => "dodoma",]);


         // 1. SETUP GEOGRAPHY
        $japan = Country::where('code', 'JP')->first();
        $korea = Country::where('code', 'KR')->first();
        $kenya = Country::where('code', 'KE')->first();
        $tanzania = Country::where('code', 'TZ')->first();
        $rwanda = Country::where('code', 'RW')->first();
        $uganda = Country::where('code', 'UG')->first();

        $mombasa = Port::where('name', 'Mombasa')->first();
        $darEsSalaam = Port::where('name', 'Dar Es Salaam')->first();
        $rwanda->gatewayPorts()->sync([$mombasa->id, $darEsSalaam->id]);
        $tanzania->gatewayPorts()->sync([$darEsSalaam->id]);
        $kenya->gatewayPorts()->sync([$mombasa->id]);
        
        // --- SCENARIO 1: OVERSEAS IMPORT (SEA LEG) ---
        // Japan to Mombasa
        ShippingRate::create([
            'transport_mode' => 'sea',
            'from_port_id'=> $yokohamaId,
            'from_country_id' => $japan->id,
            'to_country_id' => $kenya->id,
            'to_port_id' => $mombasa->id,
            'price_roro' => 850.00,
            'price_container' => 1250.00,
            'is_current' => TRUE,
        ]);

        // Japan to Dar Es Salaam
        ShippingRate::create([
            'transport_mode' => 'sea',
            'from_port_id'=> $yokohamaId,
            'from_country_id' => $japan->id,
            'to_country_id' => $tanzania->id,
            'to_port_id' => $darEsSalaam->id,
            'price_roro' => 900.00,
            'price_container' => 1350.00,
            'is_current' => TRUE,            
        ]);

                // korea to Mombasa
        ShippingRate::create([
            'transport_mode' => 'sea',
            'from_port_id'=> $busanId,
            'from_country_id' => $korea->id,
            'to_country_id' => $kenya->id,
            'to_port_id' => $mombasa->id,
            'price_roro' => 850.00,
            'price_container' => 1250.00,
            'is_current' => TRUE,
            
        ]);

        // korea to Dar Es Salaam
        ShippingRate::create([
            'transport_mode' => 'sea',
            'from_port_id'=> $busanId,            
            'from_country_id' => $korea->id,
            'to_country_id' => $tanzania->id,
            'to_port_id' => $darEsSalaam->id,
            'price_roro' => 900.00,
            'price_container' => 1350.00,
            'is_current' => TRUE,
        ]);


        // Route: Mombasa -> Kigali (Rwanda)
        DeliveryTariff::create([
            'adress_name' => 'Kigali (via Mombasa)',
            'from_country_id'=> $kenya->id,
            'country_id' => $rwanda->id,
            'from_port_id' => $mombasa->id,
            'to_city_id' => $kigaliId->id,
            'tarif_per_tone' => 180.00, // Fuel/Trucking
            'driver_fee' => 70.00,
            'clearing_fee' => 120.00,
            'weight_range' => 'Standard SUV'
        ]);

        // Route: Dar Es Salaam -> Kigali (Rwanda)
        DeliveryTariff::create([
            'adress_name' => 'Kigali (via Dar Es Salaam)',
            'country_id' => $rwanda->id,
            'from_port_id' => $darEsSalaam->id,
            'tarif_per_tone' => 140.00,
            'driver_fee' => 50.00,
            'clearing_fee' => 90.00,
            'weight_range' => 'Standard SUV'
        ]);

        // --- SCENARIO 3: CROSS-BORDER NEIGHBOR TRADE (LOCAL LAND) ---
        // Example: A car in Tanzania sold to Rwanda
        DeliveryTariff::create([
            'adress_name' => 'Kigali (Direct Road)',
            'country_id' => $rwanda->id,
            'from_country_id' => $tanzania->id, // Starts in Country, not Port
            'tarif_per_tone' => 110.00,
            'driver_fee' => 80.00,
            'clearing_fee' => 60.00,
            'weight_range' => 'Local Pickup'
        ]);

        

        // --- SCENARIO 4: COASTAL INTERNAL DELIVERY ---
        // Example: Arrival at Mombasa Port, delivery to Nairobi City
        DeliveryTariff::create([
            'adress_name' => 'Nairobi City',
            'country_id' => $kenya->id,
            'from_port_id' => $mombasa->id,
            'tarif_per_tone' => 60.00,
            'driver_fee' => 20.00,
            'clearing_fee' => 0.00, // No border clearing needed
            'weight_range' => 'Domestic'
        ]);
    }
}
