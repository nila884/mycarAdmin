<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Proforma Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            font-size: 11px;
            color: #1a1a1a;
            margin: 0;
            padding: 10px;
            line-height: 1.4;
        }
        .layout-table { width: 100%; border-collapse: collapse; }
        .header-border { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .recipient-box { border: 1px solid #000; padding: 10px; width: 45%; margin: 20px 0; }
        
        .items-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .items-table th { background-color: #f2f2f2; border: 1px solid #000; padding: 8px; text-align: left; }
        .items-table td { border: 1px solid #000; padding: 8px; vertical-align: top; }
        
        .bank-section { margin-top: 30px; border: 2px solid #333; padding: 15px; background-color: #fafafa; }
        .text-right { text-align: right; }
        
        .watermark {
            position: fixed;
            top: 25%;
            left: 5%;
            transform: rotate(-45deg);
            font-size: 80px;
            color: rgba(200, 200, 200, 0.15);
            z-index: -1000;
        }

        .summary-box {
            margin-top: 20px;
            float: right;
            width: 300px;
            border: 2px solid #1a237e; /* Navy Blue for Invoice */
        }

        .summary-table td {
            padding: 10px;
            font-size: 14px;
        }

        .footer-note {
            margin-top: 20px;
            font-size: 9px;
            color: #555;
            border-top: 1px dashed #ccc;
            padding-top: 5px;
        }

        .stamp-area { margin-top: 40px; text-align: right; font-style: italic; color: #777; }
        .urgent-note { color: #d32f2f; font-weight: bold; margin-bottom: 10px; }
    </style>
</head>
<body>

    <div class="watermark">PROFORMA INVOICE</div>

    <table class="layout-table header-border">
        <tr>
            <td style="width: 50%;">
                <strong style="font-size: 16px;">{{ $company['name'] }}</strong><br>
                {!! nl2br(e($company['address'])) !!}<br>
                EMAIL: {{ $company['email'] }}
            </td>
            <td style="width: 50%;" class="text-right">
                <h1 style="margin: 0; font-size: 24px; color: #1a237e;">PROFORMA INVOICE</h1>
                <strong>DATE:</strong> {{ now()->format('d-M-Y') }}<br>
                <strong>INVOICE NO:</strong> {{ $invoice->invoice_number }}<br>
                <strong>REF QUOTE:</strong> {{ $order->order_number }}<br>
                <strong>VALID UNTIL:</strong> {{ $order->expires_at->format('d-M-Y') }}
            </td>
        </tr>
    </table>

    <div class="recipient-box">
        <div style="text-decoration: underline; font-weight: bold;">BILL TO:</div>
        <strong style="font-size: 12px;">{{ strtoupper($order->user->name) }}</strong><br>
        {{ $order->user->email }}<br>
        TEL: {{ $$order->user->phone_number ?? 'N/A' }}
    </div>

    <p class="urgent-note">Note: This vehicle is NOT reserved. Availability is guaranteed only upon receipt of payment.</p>

    <table class="items-table">
        <thead>
            <tr>
                <th width="15%">Ref.No.</th>
                <th width="45%">Description of Goods</th>
                <th width="10%">Qty</th>
                <th width="15%">Unit Price</th>
                <th width="15%">Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $order->order_number }}</td>
                <td>
                    <strong>{{ strtoupper($order->car->version->carModel->brand->name) }} {{ strtoupper($order->car->version->carModel->name) }}</strong><br>
                    CHASSIS: {{ $order->car->chassis_number }}<br>
                    COLOR: {{ $order->car->exteriorColor->name }} | YEAR: {{ $order->car->manufacture_year ?? 'N/A' }}
                </td>
                <td>1 UNIT</td>
                <td>US$ {{ number_format($order->fob_price, 2) }}</td>
                <td>US$ {{ number_format($order->fob_price, 2) }}</td>
            </tr>
            <tr>
                <td colspan="4" class="text-right">SEA FREIGHT ({{ strtoupper($order->shipping_method) }}) - {{ strtoupper($order->origin_port) }} TO {{ strtoupper($order->destination_port) }}</td>
                <td>US$ {{ number_format($order->sea_freight, 2) }}</td>
            </tr>
            @if(!$order->is_port_pickup)
            <tr>
                <td colspan="4" class="text-right">LAND TRANSIT & CLEARING ({{ strtoupper($order->final_destination_city) }})</td>
                <td>US$ {{ number_format($order->land_transit + $order->clearing_fee, 2) }}</td>
            </tr>
            @endif
        </tbody>
    </table>

    <table class="layout-table">
        <tr>
            <td width="50%">
                <p style="font-size: 9px;">* All prices are in US Dollars.<br>
                * Please mention Invoice No. <strong>{{ $invoice->invoice_number }}</strong> as reference during payment.</p>
            </td>
            <td width="50%">
                <div class="summary-box">
                    <table class="layout-table summary-table">
                        <tr style="background: #1a237e; color: #fff;">
                            <td><strong>TOTAL PAYABLE</strong></td>
                            <td class="text-right"><strong>US$ {{ number_format($order->total_amount, 2) }}</strong></td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
    </table>

    <div class="bank-section">
        <strong style="display: block; margin-bottom: 8px; text-decoration: underline;">PAYMENT INSTRUCTIONS (VIA TELEGRAPHIC TRANSFER):</strong>
        <table class="layout-table" style="font-size: 11px;">
            <tr><td width="30%">BENEFICIARY BANK:</td><td><strong>{{ $bank_details['name'] }}</strong></td></tr>
            <tr><td>SWIFT / BIC CODE:</td><td><strong>{{ $bank_details['swift'] }}</strong></td></tr>
            <tr><td>ACCOUNT NUMBER:</td><td><strong>{{ $bank_details['account_number'] }}</strong></td></tr>
            <tr><td>BENEFICIARY NAME:</td><td><strong>{{ $bank_details['account_name'] }}</strong></td></tr>
            <tr><td>BANK BRANCH:</td><td>{{ $bank_details['branch'] ?? 'N/A' }}</td></tr>
        </table>
    </div>

    <div class="footer-note">
        <strong>Terms & Conditions:</strong> 1. This Proforma Invoice is valid for 48 hours. 2. Prices include standard export documentation. 3. Title of the goods passes only after full payment is cleared.
    </div>

    <div class="stamp-area">
        Digitally issued for Banking Purposes<br>
        {{ $company['name'] }} - International Sales Dept.
    </div>

</body>
</html>