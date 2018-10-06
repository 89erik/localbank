#!/bin/bash

cd "$(dirname "$0")"

ssh pi2 "mkdir -p /var/www/localbank/backend && mkdir -p /var/www/localbank/frontend"

cd backend
scp -r *.py localbank.wsgi requirements.txt migreringer pi2:/var/www/localbank/backend/
ssh pi2 "ls /var/www/localbank/backend/venv &> /dev/null || virtualenv /var/www/localbank/backend/venv"
ssh pi2 "cd /var/www/localbank/backend && . venv/bin/activate && pip install -r requirements.txt"

cd ../frontend
npm run build
ssh pi2 "rm -rf /var/www/localbank/frontend/*"
scp -r build/* pi2:/var/www/localbank/frontend/
