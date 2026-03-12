<#!
.SYNOPSIS
    Report (and optionally disable) stale AD computer objects.
.DESCRIPTION
    Finds computer accounts with last logon timestamp older than StaleDays.
    By default, exports a report only. Use -DisableStale to disable.
.PARAMETER StaleDays
    Number of days since last logon to consider stale.
.PARAMETER OutputPath
    CSV output path.
.PARAMETER DisableStale
    Disable stale computer accounts (requires permissions).
.EXAMPLE
    .\ad-stale-computer-cleanup.ps1 -StaleDays 90 -OutputPath .\stale-computers.csv
#>
[CmdletBinding(SupportsShouldProcess=$true)]
param(
    [int]$StaleDays = 90,
    [string]$OutputPath = "./ad-stale-computers-2026-03-12.csv",
    [switch]$DisableStale,
    [string]$SearchBase
)

Import-Module ActiveDirectory -ErrorAction Stop

$cutoff = (Get-Date).AddDays(-1 * $StaleDays)

$params = @{
    Filter = "*"
    Properties = @("LastLogonTimestamp","Enabled")
}
if ($SearchBase) { $params["SearchBase"] = $SearchBase }

$computers = Get-ADComputer @params | Where-Object {
    $_.LastLogonTimestamp -and
    ([datetime]::FromFileTime($_.LastLogonTimestamp)) -lt $cutoff
}

$results = foreach ($computer in $computers) {
    $lastLogon = [datetime]::FromFileTime($computer.LastLogonTimestamp)
    if ($DisableStale) {
        if ($PSCmdlet.ShouldProcess($computer.Name, "Disable AD computer account")) {
            Disable-ADAccount -Identity $computer.DistinguishedName
        }
    }
    [pscustomobject]@{
        Name = $computer.Name
        DistinguishedName = $computer.DistinguishedName
        Enabled = $computer.Enabled
        LastLogon = $lastLogon
        StaleDays = (New-TimeSpan -Start $lastLogon -End (Get-Date)).Days
    }
}

$results | Sort-Object StaleDays -Descending | Export-Csv -NoTypeInformation -Path $OutputPath
Write-Host "Found" $results.Count "stale computers. Report written to" $OutputPath
