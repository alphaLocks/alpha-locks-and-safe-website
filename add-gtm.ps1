# Google Tag Manager Installation Script
# This script adds GTM code to all HTML files in the website

$gtmHeadCode = @"
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T8PQWVZ');</script>
<!-- End Google Tag Manager -->
"@

$gtmBodyCode = @"
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T8PQWVZ"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
"@

# Get all HTML files
$basePath = $PSScriptRoot
$htmlFiles = Get-ChildItem -Path $basePath -Filter "*.html" -Recurse

$totalFiles = $htmlFiles.Count
$updatedFiles = 0
$skippedFiles = 0
$errorFiles = 0

Write-Host "Found $totalFiles HTML files to process..." -ForegroundColor Cyan
Write-Host ""

foreach ($file in $htmlFiles) {
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $modified = $false
        
        # Skip if GTM is already installed
        if ($content -match "GTM-T8PQWVZ") {
            Write-Host "SKIP: $($file.FullName) - GTM already installed" -ForegroundColor Yellow
            $skippedFiles++
            continue
        }
        
        # Skip template/partial files (not full HTML pages)
        if ($content -notmatch "<!DOCTYPE|<html") {
            Write-Host "SKIP: $($file.FullName) - Not a full HTML page" -ForegroundColor Yellow
            $skippedFiles++
            continue
        }
        
        # Add GTM head code after <head> tag
        if ($content -match "<head[^>]*>") {
            $headMatch = $Matches[0]
            $content = $content -replace [regex]::Escape($headMatch), "$headMatch`n$gtmHeadCode"
            $modified = $true
        }
        
        # Add GTM body code after <body...> tag
        if ($content -match "<body[^>]*>") {
            $bodyMatch = $Matches[0]
            $content = $content -replace [regex]::Escape($bodyMatch), "$bodyMatch`n$gtmBodyCode"
            $modified = $true
        }
        
        if ($modified) {
            # Save the file
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
            Write-Host "UPDATED: $($file.FullName)" -ForegroundColor Green
            $updatedFiles++
        } else {
            Write-Host "SKIP: $($file.FullName) - Could not find head/body tags" -ForegroundColor Yellow
            $skippedFiles++
        }
    }
    catch {
        Write-Host "ERROR: $($file.FullName) - $($_.Exception.Message)" -ForegroundColor Red
        $errorFiles++
    }
}

Write-Host ""
Write-Host "========== SUMMARY ==========" -ForegroundColor Cyan
Write-Host "Total files found: $totalFiles"
Write-Host "Files updated: $updatedFiles" -ForegroundColor Green
Write-Host "Files skipped: $skippedFiles" -ForegroundColor Yellow
Write-Host "Files with errors: $errorFiles" -ForegroundColor Red
Write-Host "=============================" -ForegroundColor Cyan
