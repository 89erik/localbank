#!/bin/bash

cd "$(dirname "$0")"

cd backend
scp *.py localbank.wsgi requirements.txt pi2:/var/www/api/
ssh pi2 "ls /var/www/api/venv &> /dev/null || virtualenv /var/www/api/venv"
ssh pi2 "cd /var/www/api && . venv/bin/activate && pip install -r requirements.txt"

cd ../frontend
npm run build
ssh pi2 "mkdir -p /var/www/api/frontend; rm -rf /var/www/api/frontend/*"
scp -r build/* pi2:/var/www/api/frontend/
