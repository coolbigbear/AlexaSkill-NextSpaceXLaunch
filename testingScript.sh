ask deploy --profile "default" --target "lambda"
ask dialog -r testInput.json
sleep 10
awslogs get /aws/lambda/SpaceXLaunches ALL -s1d | egrep -wi --color "error|info"  