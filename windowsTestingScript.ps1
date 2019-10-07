Write-Output "Running Script"
ask deploy --profile "default" --target "lambda"
ask dialog -r testInput.json