<#!
.SYNOPSIS
    Export Active Directory users with status, last logon, and group memberships.
.DESCRIPTION
    Exports user audit data to CSV for reporting and cleanup reviews. Safe read-only.
.PARAMETER OutputPath
    Path for the CSV export. Default is a dated file in the current directory.
.PARAMETER IncludeDisabled
    Include disabled accounts (default: true).
.PARAMETER IncludeGroups
    Include group memberships as a semicolon-separated list (default: false).
.EXAMPLE
    .\ad-user-audit-script.ps1 -IncludeGroups -OutputPath .\ad-users.csv
#>
[CmdletBinding()]
param(
    [string]$OutputPath = "./ad-user-audit-2026-03-12.csv",
    [bool]$IncludeDisabled = $true,
    [switch]$IncludeGroups,
    [string]$SearchBase
)

Import-Module ActiveDirectory -ErrorAction Stop

$filter = if ($IncludeDisabled) { "*" } else { "Enabled -eq 'True'" }

$props = @(
    "Enabled",
    "Title",
    "Department",
    "Manager",
    "LastLogonDate",
    "PasswordLastSet"
)

$params = @{ Filter = $filter; Properties = $props }
if ($SearchBase) { $params["SearchBase"] = $SearchBase }

$users = Get-ADUser @params

$results = foreach ($user in $users) {
    $groups = if ($IncludeGroups) {
        (Get-ADPrincipalGroupMembership $user | Select-Object -ExpandProperty Name) -join "; "
    } else {
        ""
    }

    [pscustomobject]@{
        Name = $user.Name
        UserPrincipalName = $user.UserPrincipalName
        Enabled = $user.Enabled
        Title = $user.Title
        Department = $user.Department
        Manager = $user.Manager
        LastLogonDate = $user.LastLogonDate
        PasswordLastSet = $user.PasswordLastSet
        Groups = $groups
    }
}

$results | Sort-Object Name | Export-Csv -NoTypeInformation -Path $OutputPath
Write-Host "Exported" $results.Count "users to" $OutputPath
