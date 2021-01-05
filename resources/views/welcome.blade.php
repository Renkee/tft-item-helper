<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="manifest" href="manifest.json">
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
    <title>TFT App</title>
    <script>
        // Check that service workers are supported
        if ('serviceWorker' in navigator) {
            // Use the window load event to keep the page load performant
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js');
            });
        }
    </script>
</head>
<body class="antialiased">
    <div id="app"><router-view></router-view></div>
    <script src="{{ mix('js/app.js') }}"></script>
</body>
</html>
