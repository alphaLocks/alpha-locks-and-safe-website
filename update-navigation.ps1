# Update navigation menus across all static pages using template files.
# The templates should contain "__BASE__" placeholders that get replaced
# with the right relative prefix for each file.

$ErrorActionPreference = "Stop"

$root = (Get-Location).Path
$desktopTemplate = Get-Content -Path "nav-desktop-template.html" -Raw -Encoding UTF8
$mobileTemplate = Get-Content -Path "nav-mobile-template.html" -Raw -Encoding UTF8

$files = Get-ChildItem -Path . -Filter "index.html" -Recurse |
    Where-Object { $_.FullName -notmatch "\\wp-" }

foreach ($file in $files) {
    try {
        $relativeDir = $file.DirectoryName.Substring($root.Length).TrimStart("\")
        $depth = if ([string]::IsNullOrWhiteSpace($relativeDir)) { 0 } else { ($relativeDir -split "\\").Count }
        $base = ("../" * $depth)

        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8 -ErrorAction Stop
        if (-not $content) { continue }
        $original = $content

        $desktopBlock = $desktopTemplate -replace "__BASE__", $base
        $mobileBlock = $mobileTemplate -replace "__BASE__", $base

        $content = [regex]::Replace(
            $content,
            "<nav[^>]*elementor-nav-menu--main[^>]*>.*?</nav>",
            [System.Text.RegularExpressions.MatchEvaluator] { $desktopBlock },
            [System.Text.RegularExpressions.RegexOptions]::Singleline
        )

        $content = [regex]::Replace(
            $content,
            "<nav[^>]*elementor-nav-menu--dropdown[^>]*elementor-nav-menu__container[^>]*>.*?</nav>",
            [System.Text.RegularExpressions.MatchEvaluator] { $mobileBlock },
            [System.Text.RegularExpressions.RegexOptions]::Singleline
        )

        if ($content -ne $original) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        }
    } catch {
        Write-Warning "Skip $($file.FullName): $_"
    }
}

Write-Host "Navigation updated for $($files.Count) files."
