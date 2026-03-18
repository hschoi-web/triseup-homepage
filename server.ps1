$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://localhost:3001/')
$listener.Start()
Write-Host "Server started on http://localhost:3001"
while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    $path = $request.Url.LocalPath
    if ($path -eq '/') { $path = '/index.html' }
    $filePath = Join-Path 'C:\Users\GROUNDK\triseup-homepage' $path
    if (Test-Path $filePath -PathType Leaf) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath)
        $ct = 'application/octet-stream'
        if ($ext -eq '.html') { $ct = 'text/html; charset=utf-8' }
        if ($ext -eq '.css') { $ct = 'text/css' }
        if ($ext -eq '.js') { $ct = 'application/javascript' }
        if ($ext -eq '.png') { $ct = 'image/png' }
        if ($ext -eq '.svg') { $ct = 'image/svg+xml' }
        $response.ContentType = $ct
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
    }
    $response.Close()
}
