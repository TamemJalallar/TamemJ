<#!
.SYNOPSIS
    Export MFA registration status for Entra ID users.
.DESCRIPTION
    Uses Microsoft Graph reports endpoint to export MFA registration details.
    Requires Reports.Read.All permission.
.EXAMPLE
    .\entra-mfa-status-script.ps1 -OutputPath .\mfa-status.csv
#>
[CmdletBinding()]
param(
    [string]$OutputPath = "./entra-mfa-status-2026-03-12.csv"
)

if (-not (Get-Module -ListAvailable -Name Microsoft.Graph)) {
    Write-Error "Microsoft.Graph module not found. Install-Module Microsoft.Graph"
    exit 1
}

Import-Module Microsoft.Graph -ErrorAction Stop

$scopes = @("Reports.Read.All", "Directory.Read.All")
Connect-MgGraph -Scopes $scopes | Out-Null

$details = Get-MgReportAuthenticationMethodUserRegistrationDetail -All

$results = foreach ($row in $details) {
    [pscustomobject]@{
        UserPrincipalName = $row.UserPrincipalName
        DisplayName = $row.DisplayName
        IsMfaRegistered = $row.IsMfaRegistered
        MethodsRegistered = ($row.MethodsRegistered -join "; ")
        IsAdmin = $row.IsAdmin
    }
}

$results | Sort-Object UserPrincipalName | Export-Csv -NoTypeInformation -Path $OutputPath
Write-Host "Exported" $results.Count "records to" $OutputPath
