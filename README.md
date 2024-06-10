Aby poprawnie skompilowac i uruchomic skrypt nalezy:
1. Stworzyc folder z plikiem "env/bucketPass.env"
2. Umiescic w nim 
  `AWS_ACCESS_KEY_ID=twoj_access_key_id
   AWS_SECRET_ACCESS_KEY=twoj_sekretny_klucz
   AWS_BUCKET_NAME=developer-task
   AWS_PREFIX_NAME=x-wing/`
3. Skompilowac projekt odpowienio komenda `npx tsc`
4. Uruchomic skrypt komenda `node .\dist\index.js`
5. Wszystkie informacje wyswietla sie w terminalu