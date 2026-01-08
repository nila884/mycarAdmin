<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Quotation No.{{ $order->order_number }}</title>
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
        
        .bank-section { margin-top: 30px; border: 1px solid #333; padding: 10px; }
        .text-right { text-align: right; }
        
        /* New: Visual Improvements */
        .watermark {
            position: fixed;
            top: 25%;
            left: 10%;
            transform: rotate(-45deg);
            font-size: 100px;
            color: rgba(220, 220, 220, 0.2);
            z-index: -1000;
        }

        .summary-box {
            margin-top: 20px;
            float: right;
            width: 300px;
            border: 2px solid #d32f2f;
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
    </style>
</head>
<body>

    <div class="watermark">QUOTATION</div>

    <table class="layout-table header-border">
        <tr>
            <td style="width: 50%;">
                <strong style="font-size: 16px;">{{ $company['name'] }}</strong><br>
                {!! nl2br(e($company['address'])) !!}<br>
                EMAIL: {{ $company['email'] }}
            </td>
            <td style="width: 50%;" class="text-right">
                <h1 style="margin: 0; font-size: 28px; color: #d32f2f;">QUOTATION</h1>
                <strong>ISSUE DATE:</strong> {{ $issue_date }}<br>
                <strong>QUOTE NO:</strong> {{ $order->order_number }}<br>
                <strong>VALID UNTIL:</strong> {{ $valid_until }}
            </td>
        </tr>
    </table>

    <div class="recipient-box">
        <div style="text-decoration: underline; font-weight: bold;">Messrs.</div>
        <strong style="font-size: 12px;">{{ strtoupper($user->name) }}</strong><br>
        {{ $user->email }}<br>
        TEL: {{ $user->phone_number ?? 'N/A' }}
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th width="15%">Ref.No.</th>
                <th width="45%">Description</th>
                <th width="10%">Qty</th>
                <th width="15%">Unit Price</th>
                <th width="15%">Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $order->order_number }}</td>
                <td>
                    <strong>{{ strtoupper($car->version->carModel->brand->name) }} {{ strtoupper($car->version->carModel->name) }}</strong><br>
                    CHASSIS: {{ $car->chassis_number }}<br>
                    COLOR: {{ $car->exterior_color }} | TRANS: {{ $car->transmission }}
                </td>
                <td>1 UNIT</td>
                <td>US$ {{ number_format($order->fob_price, 2) }}</td>
                <td>US$ {{ number_format($order->fob_price, 2) }}</td>
            </tr>
            <tr>
                <td colspan="4" class="text-right">SEA FREIGHT ({{ strtoupper($order->shipping_method) }}) - {{ strtoupper($order->origin_port) }} TO {{ strtoupper($order->destination_port) }}</td>
                <td>US$ {{ number_format($order->sea_freight, 2) }}</td>
            </tr>
            <tr>
                <td colspan="4" class="text-right">LAND TRANSIT & CLEARING ({{ strtoupper($order->final_destination_city) }})</td>
                <td>US$ {{ number_format($order->land_transit + $order->clearing_fee, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <table class="layout-table">
        <tr>
            <td width="50%"></td>
            <td width="50%">
                <div class="summary-box">
                    <table class="layout-table summary-table">
                        <tr style="background: #d32f2f; color: #fff;">
                            <td><strong>TOTAL CIF AMOUNT</strong></td>
                            <td class="text-right"><strong>US$ {{ number_format($order->total_amount, 2) }}</strong></td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
    </table>

    <div class="bank-section">
        <strong style="display: block; margin-bottom: 5px; text-decoration: underline;">BANK ACCOUNT DETAILS (FOR TELEGRAPHIC TRANSFER):</strong>
        <table class="layout-table" style="font-size: 10px;">
            <tr><td width="25%">BANK NAME:</td><td><strong>{{ $bank_details['name'] }}</strong></td></tr>
            <tr><td>SWIFT CODE:</td><td><strong>{{ $bank_details['swift'] }}</strong></td></tr>
            <tr><td>ACCOUNT NUMBER:</td><td><strong>{{ $bank_details['account_number'] }}</strong></td></tr>
            <tr><td>ACCOUNT NAME:</td><td><strong>{{ $bank_details['account_name'] }}</strong></td></tr>
            <tr><td>BRANCH:</td><td>{{ $bank_details['branch'] ?? 'N/A' }}</td></tr>
        </table>
    </div>

    @if(isset($note))
    <div class="footer-note">
        <strong>Important Note:</strong> {{ $note }}
    </div>
    @endif

    <div class="stamp-area">
        Digitally generated by {{ $company['name'] }} System<br>
        No signature required.
    </div>

</body>
</html>