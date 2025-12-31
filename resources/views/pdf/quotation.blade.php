<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Quotation No.{{ $order->order_number }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 11px;
            color: #1a1a1a;
            margin: 0;
            padding: 20px;
            line-height: 1.4;
        }

        /* Use tables for layout instead of floats for AWS stability */
        .layout-table {
            width: 100%;
            border: none;
            border-collapse: collapse;
        }

        .header-border {
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }

        .recipient-box {
            border: 1px solid #000;
            padding: 10px;
            width: 45%;
            margin: 20px 0;
        }

        /* Itemized Table Styling */
        .items-table {
            width: 100%;
            border-collapse: collapse;
        }
        .items-table th {
            background-color: #f2f2f2;
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        .items-table td {
            border: 1px solid #000;
            padding: 8px;
            vertical-align: top;
        }

        .total-row {
            font-weight: bold;
            background-color: #eee;
        }

        .bank-section {
            margin-top: 30px;
            border: 1px solid #ccc;
            padding: 10px;
        }

        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
    </style>
</head>
<body>

    <table class="layout-table header-border">
        <tr>
            <td style="width: 50%;">
                <strong style="font-size: 16px;">BE FORWARD CO., LTD.</strong><br>
                1-32-2 KOJIMACHO, CHOFU-SHI, TOKYO 182-0026 JAPAN<br>
                TEL: +81 42 440 3440
            </td>
            <td style="width: 50%;" class="text-right">
                <h1 style="margin: 0; font-size: 28px;">QUOTE</h1>
                <strong>ISSUE DATE:</strong> {{ $issue_date }}<br>
                <strong>QUOTE NUMBER:</strong> {{ $order->order_number }}<br>
                <strong>VALID UNTIL:</strong> {{ $valid_until }}
            </td>
        </tr>
    </table>

    <div class="recipient-box">
        <div style="text-decoration: underline; font-weight: bold;">Messrs.</div>
        <strong style="font-size: 12px;">{{ strtoupper($user->name) }}</strong><br>
        {{ $user->email }}<br>
        TEL: {{ $user->phone_number }}
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
                    <strong>{{ $car->version->carModel->brand->name }} {{ $car->version->carModel->name }}</strong><br>
                    CHASSIS: {{ $car->chassis_number }}<br>
                    TRANS: {{ $car->transmission }} | COLOR: {{ $car->exterior_color }}
                </td>
                <td>1 UNIT</td>
                <td>US$ {{ number_format($order->fob_price, 2) }}</td>
                <td>US$ {{ number_format($order->fob_price, 2) }}</td>
            </tr>
            <tr>
                <td colspan="4" class="text-right">SEA FREIGHT ({{ strtoupper($order->shipping_method) }})</td>
                <td>US$ {{ number_format($order->sea_freight, 2) }}</td>
            </tr>
            <tr>
                <td colspan="4" class="text-right">LAND TRANSIT & CLEARING FEES</td>
                <td>US$ {{ number_format($order->land_transit + $order->clearing_fee, 2) }}</td>
            </tr>
            <tr class="total-row">
                <td colspan="4" class="text-right">TOTAL AMOUNT (USD):</td>
                <td>US$ {{ number_format($order->total_amount, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="bank-section">
        <strong style="display: block; margin-bottom: 5px;">BANK ACCOUNT DETAILS:</strong>
        <table class="layout-table" style="font-size: 10px;">
            <tr><td width="30%">BANK NAME:</td><td>{{ $bank_details['name'] }}</td></tr>
            <tr><td>SWIFT CODE:</td><td>{{ $bank_details['swift'] }}</td></tr>
            <tr><td>ACCOUNT NO:</td><td>{{ $bank_details['account'] }}</td></tr>
            <tr><td>ACCOUNT NAME:</td><td>{{ $bank_details['name_on_account'] }}</td></tr>
        </table>
    </div>

</body>
</html>