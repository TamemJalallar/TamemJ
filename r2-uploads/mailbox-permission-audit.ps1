<#!
.SYNOPSIS
    Export Exchange Online mailbox permissions.
.DESCRIPTION
    Exports Full Access, Send As, and Send on Behalf permissions for all mailboxes.
    Requires ExchangeOnlineManagement module.
.EXAMPLE
    .\mailbox-permission-audit.ps1 -OutputPath .\mailbox-permissions.csv
#>
[CmdletBinding()]
param(
    [string]$OutputPath = "./mailbox-permission-audit-2026-03-12.csv"
)

if (-not (Get-Module -ListAvailable -Name ExchangeOnlineManagement)) {
    Write-Error "ExchangeOnlineManagement module not found. Install-Module ExchangeOnlineManagement"
    exit 1
}

Import-Module ExchangeOnlineManagement -ErrorAction Stop

Connect-ExchangeOnline -ShowBanner:$false

$mailboxes = Get-EXOMailbox -ResultSize Unlimited

$results = foreach ($mb in $mailboxes) {
    $fullAccess = (Get-EXOMailboxPermission -Identity $mb.UserPrincipalName | Where-Object { $_.AccessRights -contains "FullAccess" -and -not $_.IsInherited } | Select-Object -ExpandProperty User) -join "; "
    $sendAs = (Get-EXORecipientPermission -Identity $mb.UserPrincipalName | Where-Object { $_.AccessRights -contains "SendAs" } | Select-Object -ExpandProperty Trustee) -join "; "
    $sendOnBehalf = ($mb.GrantSendOnBehalfTo | ForEach-Object { $_.Name }) -join "; "

    [pscustomobject]@{
        Mailbox = $mb.UserPrincipalName
        DisplayName = $mb.DisplayName
        FullAccess = $fullAccess
        SendAs = $sendAs
        SendOnBehalf = $sendOnBehalf
    }
}

$results | Sort-Object Mailbox | Export-Csv -NoTypeInformation -Path $OutputPath
Write-Host "Exported" $results.Count "mailboxes to" $OutputPath
