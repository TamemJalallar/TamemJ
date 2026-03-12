<#!
.SYNOPSIS
    Assign or remove Microsoft 365 licenses in bulk using Graph.
.DESCRIPTION
    Reads a CSV file with UserPrincipalName and SkuId columns.
    Supports Assign or Remove actions.
.EXAMPLE
    .\m365-bulk-license-script.ps1 -CsvPath .\licenses.csv -Action Assign
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$CsvPath,
    [ValidateSet("Assign","Remove")]
    [string]$Action = "Assign"
)

if (-not (Get-Module -ListAvailable -Name Microsoft.Graph)) {
    Write-Error "Microsoft.Graph module not found. Install-Module Microsoft.Graph"
    exit 1
}

Import-Module Microsoft.Graph -ErrorAction Stop

$scopes = @("User.ReadWrite.All", "Organization.Read.All")
Connect-MgGraph -Scopes $scopes | Out-Null

$rows = Import-Csv $CsvPath

foreach ($row in $rows) {
    $user = Get-MgUser -UserId $row.UserPrincipalName
    if (-not $user) {
        Write-Warning "User not found: $($row.UserPrincipalName)"
        continue
    }

    $sku = $row.SkuId
    if ($Action -eq "Assign") {
        Set-MgUserLicense -UserId $user.Id -AddLicenses @(@{SkuId=$sku}) -RemoveLicenses @()
        Write-Host "Assigned" $sku "to" $row.UserPrincipalName
    } else {
        Set-MgUserLicense -UserId $user.Id -AddLicenses @() -RemoveLicenses @($sku)
        Write-Host "Removed" $sku "from" $row.UserPrincipalName
    }
}

Write-Host "Completed bulk license" $Action
