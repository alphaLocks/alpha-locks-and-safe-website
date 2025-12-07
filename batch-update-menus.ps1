# Batch Navigation Menu Update Script
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Navigation Menu Batch Updater" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$files = Get-ChildItem -Path . -Filter "index.html" -Recurse | Where-Object { $_.FullName -notlike "*\wp-*" }
$totalFiles = $files.Count
$updated = 0
$processed = 0

Write-Host "Found $totalFiles HTML files to process" -ForegroundColor Yellow
Write-Host ""

# Define replacement patterns
$automotiveOld = '(<li[^>]*class="[^"]*menu-item-287"[^>]*>\s*<a[^>]*href="[^"]*automotive[^"]*"[^>]*>Automotive&nbsp;</a>\s*</li>)'
$automotiveNew = '<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-287"><a href="../ƒÜù-automotive-locksmith-services-car-lockouts-key-replacement/index.html" class="elementor-sub-item">Automotive&nbsp;</a><ul class="sub-menu elementor-nav-menu--dropdown"><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-3001"><a href="../emergency-auto-locksmith/index.html" class="elementor-sub-item">Emergency Auto Locksmith</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-3002"><a href="../key-fob-programming-and-reprogramming/index.html" class="elementor-sub-item">Key Fob Programming &amp; Reprogramming</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-3003"><a href="../transponder-key-replacement/index.html" class="elementor-sub-item">Transponder Key Replacement</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-3004"><a href="../key-duplication/index.html" class="elementor-sub-item">Key Duplication</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-3005"><a href="../broken-key-extraction/index.html" class="elementor-sub-item">Broken Key Extraction</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-3006"><a href="../ignition-repair-and-replacement/index.html" class="elementor-sub-item">Ignition Repair &amp; Replacement</a></li></ul></li>'

$commercialOld = '(<li[^>]*class="[^"]*menu-item-288"[^>]*>\s*<a[^>]*href="[^"]*commercial[^"]*"[^>]*>Commercial</a>\s*</li>)'
$commercialNew = '<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-288"><a href="../commercial/index.html" class="elementor-sub-item">Commercial</a><ul class="sub-menu elementor-nav-menu--dropdown"><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-2001"><a href="../master-key-system/index.html" class="elementor-sub-item">Master Key System</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-2002"><a href="../commercial-emergency-service/index.html" class="elementor-sub-item">Commercial Emergency Service</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-2003"><a href="../commercial-locks-installation/index.html" class="elementor-sub-item">Commercial Locks Installation</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-2004"><a href="../office-locks/index.html" class="elementor-sub-item">Office Locks</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-2005"><a href="../electronic-access-control-systems/index.html" class="elementor-sub-item">Electronic Access Control Systems</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-2006"><a href="../panic-bars-and-exit-devices/index.html" class="elementor-sub-item">Panic Bars and Exit Devices</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-2007"><a href="../high-security-lock-installation/index.html" class="elementor-sub-item">High-Security Lock Installation</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-2008"><a href="../commercial-lock-rekeying/index.html" class="elementor-sub-item">Commercial Lock Rekeying</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-2009"><a href="../file-cabinet-and-storage-lock-solutions/index.html" class="elementor-sub-item">File Cabinet and Storage Lock Solutions</a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-2010"><a href="../door-closers-and-security-bars/index.html" class="elementor-sub-item">Door Closers and Security Bars</a></li></ul></li>'

foreach ($file in $files) {
    $processed++
    
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        $original = $content
        $changed = $false
        
        # Update Automotive menu
        if ($content -match $automotiveOld -and $content -notmatch "menu-item-has-children menu-item-287") {
            $content = $content -replace $automotiveOld, $automotiveNew
            $changed = $true
        }
        
        # Update Commercial menu
        if ($content -match $commercialOld -and $content -notmatch "menu-item-has-children menu-item-288") {
            $content = $content -replace $commercialOld, $commercialNew
            $changed = $true
        }
        
        if ($changed) {
            [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
            $updated++
        }
        
        if ($processed % 50 -eq 0) {
            Write-Host "Progress: $processed / $totalFiles files processed, $updated updated" -ForegroundColor Yellow
        }
        
    }
    catch {
        Write-Host "Error processing $($file.Name): $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "Update Complete!" -ForegroundColor Green
Write-Host "Files processed: $processed" -ForegroundColor White
Write-Host "Files updated: $updated" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
