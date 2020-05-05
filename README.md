# Online at
### API - https://dta-simplechat-backend.herokuapp.com/
#### DOCS - https://documenter.getpostman.com/view/9069060/Szmb7L6K?version=latest

# To run
#### 1 - create .env file or set your environment variables as in the .env.example
#### 2 - npm run setup (to run migrations and seeds)

# To debug
#### 1 - npm run dev (to run migrations and seeds)

# Database
#### SQLite - To use SQLITE change DB_CONNECTION in .env or environment variables to sqlite
#### MySql - To use MySql change DB_CONNECTION in .env or environment variables to mysql

# Http methods
### Create user 
#### Request - POST - /user/create
```json
{
	"username" : "Erick"
}
```

#### Response
```json
{
	"id": 1,
	"username" : "Erick"
}
```

# Socket events
### (client) join-room
```json
{
	"userId" : 1
}
```

### (client) leave-room

### (client) writing-message

### (client) send-message
```json
{
	"message" : "e ai",
	"type" : "text"
}
```

### (server) user-joined
```json
{
	"id" : "e ai",
	"username" : "text",
	"lastMessges": [
		{
			"type": "text",
			"message": "opa",
			"date":"2020-05-04 12:42",
			"user": {
				"id": 1,
				"username": "Ricardo"
			}
		},
		{
			"type": "text",
			"message": "noiz",
			"date":"2020-05-04 12:40",
			"user": {
				"id": 2,
				"username": "Daniel"
			}
		}
	]
}
```

### (server) user-leaved
```json
{
	"id": 1,
	"username": "Ricardo"
}
```

### (server) user-writing-message
```json
{
	"id": 1,
	"username": "Ricardo"
}
```

### (server) user-send-message
```json
{
	"type": "text",
	"message": "noiz",
	"date":"2020-05-04 12:48",
	"user": {
		"id": 2,
		"username": "Daniel"
	}
}
```

# Test client 

cd test_client

npm install

node client.js
