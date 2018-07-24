#!/bin/bash

cd "$(dirname "$0")"

scp *.py pi2:/var/www/api/
scp localbank.wsgi pi2:/var/www/api/

cd frontend
npm run build
ssh pi2 "mkdir -p /var/www/api/frontend; rm -rf /var/www/api/frontend/*"
scp -r build/* pi2:/var/www/api/frontend/
