POST NEW AUTHOR
=============
curl --request POST \
  --url http://localhost:7000/api/authors \
  --header 'content-type: application/json' \
  --data '{"firstName": "Nguyen", "lastName": "A", "email": "anguyen@email.com", "password": "123456"}'

DEL AN AUTHOR
=============
curl --request DELETE \
  --url http://localhost:7000/api/authors/5f30e60a3e845936dc2626f9

POST NEW ARTICLE WITH AN AUTHOR
=============
curl --request POST \
  --url http://localhost:7000/api/authors/5f30e5dd3e845936dc2626f8/articles \
  --header 'content-type: application/json' \
  --data '{"title": "MongoDB", "date": "2020-08-11T17:11:22.124+00:00"}'

UPDATE AN ARTICLE WITH AN AUTHOR
=============
curl --request PUT \
  --url http://localhost:7000/api/authors/5f30e5dd3e845936dc2626f8/articles/5f30f3a96b3f324f943f45ef \
  --header 'content-type: application/json' \
  --data '{"title": "Titanic XXX"}'