scp *.py pi2:/var/www/api/
scp localbank.wsgi pi2:/var/www/api/

cd frontend
npm run build
scp -r build/* pi2:/var/www/api/frontend/
