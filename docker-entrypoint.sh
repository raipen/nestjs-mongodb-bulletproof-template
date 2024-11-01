echo "wait db server"
./wait-for-it.sh  db:27017

echo "start node server"
npm run build

npm run start:prod
