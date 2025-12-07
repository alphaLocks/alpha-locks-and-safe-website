# PowerShell script to fix relative URLs in JSON-LD schema
# This script converts relative URLs to absolute URLs in the yoast-schema-graph

$baseUrl = "https://alphalockandsafe.com"
$rootPath = $PSScriptRoot

# Get all HTML files
$htmlFiles = Get-ChildItem -Path $rootPath -Filter "index.html" -Recurse

$totalFiles = $htmlFiles.Count
$fixedFiles = 0

Write-Host "Found $totalFiles HTML files to process..." -ForegroundColor Cyan

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Check if file contains yoast-schema-graph
    if ($content -match 'yoast-schema-graph') {
        
        # Fix @id fields that start with / (relative paths)
        # Pattern: "@id": "/something/" -> "@id": "https://alphalockandsafe.com/something/"
        $content = $content -replace '"@id":\s*"(/[^"]*)"', "`"@id`": `"$baseUrl`$1`""
        
        # Fix url fields that start with / (relative paths)
        # Pattern: "url": "/something/" -> "url": "https://alphalockandsafe.com/something/"
        $content = $content -replace '"url":\s*"(/[^"]*)"', "`"url`": `"$baseUrl`$1`""
        
        # Fix item fields in breadcrumbs that start with /
        # Pattern: "item": "/" -> "item": "https://alphalockandsafe.com/"
        $content = $content -replace '"item":\s*"(/[^"]*)"', "`"item`": `"$baseUrl`$1`""
        
        # Fix urlTemplate in SearchAction
        # Pattern: "urlTemplate": "/?s={search_term_string}" -> "urlTemplate": "https://alphalockandsafe.com/?s={search_term_string}"
        $content = $content -replace '"urlTemplate":\s*"(/[^"]*)"', "`"urlTemplate`": `"$baseUrl`$1`""
        
        # Fix contentUrl fields
        $content = $content -replace '"contentUrl":\s*"(/[^"]*)"', "`"contentUrl`": `"$baseUrl`$1`""
        
        # Fix target arrays with relative URLs
        $content = $content -replace '"target":\s*\[\s*"(/[^"]+)"\s*\]', "`"target`": [`"$baseUrl`$1`"]"
        
        # Check if content was modified
        if ($content -ne $originalContent) {
            # Save the file
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
            $fixedFiles++
            Write-Host "Fixed: $($file.FullName)" -ForegroundColor Green
        }
    }
}

Write-Host "`nComplete! Fixed $fixedFiles out of $totalFiles files." -ForegroundColor Cyan
