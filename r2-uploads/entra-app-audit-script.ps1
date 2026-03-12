<#!
.SYNOPSIS
    Export Entra ID app registrations with credential expiry dates.
.DESCRIPTION
    Uses Microsoft Graph to export app registrations, owners, and secret/cert expiry.
    Requires Graph SDK and App.Read.All permissions.
.EXAMPLE
    .\entra-app-audit-script.ps1 -OutputPath .\entra-apps.csv
#>
[CmdletBinding()]
param(
    [string]$OutputPath = "./entra-app-audit-2026-03-12.csv"
)

if (-not (Get-Module -ListAvailable -Name Microsoft.Graph)) {
    Write-Error "Microsoft.Graph module not found. Install-Module Microsoft.Graph"
    exit 1
}

Import-Module Microsoft.Graph -ErrorAction Stop

$scopes = @("Application.Read.All", "Directory.Read.All")
Connect-MgGraph -Scopes $scopes | Out-Null

$apps = Get-MgApplication -All

$results = foreach ($app in $apps) {
    $secrets = ($app.PasswordCredentials | ForEach-Object { $_.EndDateTime }) -join "; "
    $certs = ($app.KeyCredentials | ForEach-Object { $_.EndDateTime }) -join "; "

    [pscustomobject]@{
        DisplayName = $app.DisplayName
        AppId = $app.AppId
        CreatedDateTime = $app.CreatedDateTime
        SecretExpiry = $secrets
        CertExpiry = $certs
    }
}

$results | Sort-Object DisplayName | Export-Csv -NoTypeInformation -Path $OutputPath
Write-Host "Exported" $results.Count "app registrations to" $OutputPath
