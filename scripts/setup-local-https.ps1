param()

$ErrorActionPreference = "Stop"
$workspace = Split-Path -Parent $PSScriptRoot
$certificateDirectory = Join-Path $workspace ".certs"
$certificatePath = Join-Path $certificateDirectory "ellis-local-dev.pfx"
$environmentPath = Join-Path $workspace ".env.local"

New-Item -ItemType Directory -Force -Path $certificateDirectory | Out-Null
$passphraseBytes = New-Object byte[] 24
$random = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$random.GetBytes($passphraseBytes)
$random.Dispose()
$passphrase = [Convert]::ToBase64String($passphraseBytes)
$securePassphrase = ConvertTo-SecureString -String $passphrase -AsPlainText -Force
$certificate = New-SelfSignedCertificate -DnsName "localhost", "127.0.0.1" -Type SSLServerAuthentication -KeyExportPolicy Exportable -CertStoreLocation "Cert:\CurrentUser\My" -FriendlyName "Ellis AI Studio local development"
Export-PfxCertificate -Cert $certificate -FilePath $certificatePath -Password $securePassphrase | Out-Null

@(
  "VITE_HTTPS_PFX_PATH=.certs/ellis-local-dev.pfx"
  "VITE_HTTPS_PFX_PASSPHRASE=$passphrase"
) | Set-Content -Path $environmentPath -Encoding utf8

Write-Host "Created $certificatePath and .env.local. Trust the certificate in your browser before opening https://127.0.0.1:3000."
