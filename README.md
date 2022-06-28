A twitter clone using Node.js and Hapi

Assignment for DMAS course in WS16

http://babbler1.herokuapp.com

https://github.com/tthurnreiter/babbler

API Description:

GET /api/users: get all users
POST /api/users: create new user
DELETE /api/users: delete all users

GET /api/user/{id}: get single user
POST /api/user/{id}: edit user details
DELETE /api/user/{id}: delete single user

GET /api/user/{id}/following: get all user this user follows
POST /api/user/{id1}/following/{id2}: id1 follow id2
DELETE /api/user/{id1}/following/{id2}: id1 unfollow id2

POST /api/users/bulkdelete: accepts json array of user ids to delete. Example: [ "58529e723d887d39a04d4c56", "58528cae45fcaf37ac49377b" ]

GET /api/babble/{id}: get single babble
DELETE /api/babble/{id}: delete single babble

GET /api/babbles: get all babbles
POST /api/babbles: post new babble
DELETE /api/babbles: delete all babbles

POST /api/bubbles/bulkdelete: accepts json array of babble ids to delete. Example: [ "58529e723d887d39a04d4c56", "58528cae45fcaf37ac49377b" ]

GET /api/user/{id}/babbles: get all babbles by user
DELETE /api/user/{id}/babbles: delete all babbles by user
