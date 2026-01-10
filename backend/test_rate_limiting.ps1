# Test Rate Limiting Script
# Attempts to login 6 times to verify throttling (limit: 5/minute)

$url = "http://localhost:8000/api/v1/auth/login/"
$body = @{
    email    = "test@test.com"
    password = "wrongpassword"
} | ConvertTo-Json

Write-Host "🔒 Testing Rate Limiting on Login Endpoint" -ForegroundColor Cyan
Write-Host "URL: $url" -ForegroundColor Gray
Write-Host "Rate limit: 5 attempts/minute`n" -ForegroundColor Gray

for ($i = 1; $i -le 6; $i++) {
    Write-Host "Attempt $i`: " -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method POST -Body $body -ContentType "application/json" -ErrorAction SilentlyContinue
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ Allowed (200 OK)" -ForegroundColor Green
        }
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 429) {
            Write-Host "❌ THROTTLED (429 Too Many Requests)" -ForegroundColor Red
            
            if ($i -eq 6) {
                Write-Host "`n✅ SUCCESS: Rate limiting works correctly!" -ForegroundColor Green
                Write-Host "   6th attempt was blocked as expected." -ForegroundColor Green
                exit 0
            }
        }
        elseif ($_.Exception.Response.StatusCode -eq 400) {
            Write-Host "✓ Allowed (400 Bad Request - invalid credentials)" -ForegroundColor Yellow
        }
        else {
            Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Start-Sleep -Milliseconds 100
}

Write-Host "`n❌ FAILED: All 6 attempts were allowed!" -ForegroundColor Red
Write-Host "   Rate limiting is not working properly." -ForegroundColor Red
exit 1
