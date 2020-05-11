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

### Upload file
#### Request - POST - /file/upload?type={image/audio}&duration_seconds={integer(optional)}
````
Form-data
file
````

#### Response
```json
{
	"id": 1,
	"name": "image",
	"extension": "jpg",
	"duration": null,
	"url": "http://backendurl.com/file/content/48b874b5-bf02-4af8-2252-90ca7chg6cb0",
	"thumbnailUrl": "http://backendurl.com/file/content/48b874b5-bf02-4af8-2252-90ca7chg6cb0"
}
```
or
```json
{
	"id": 1,
	"name": "voice",
	"extension": "mp4",
	"duration": 39,
	"url": "http://backendurl.com/file/content/48b874b5-bf02-4af8-9664-90ca7chg6cb0",
	"thumbnailUrl": null
}
```

# Socket events
### (client) client-connect

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
or
```json
{
	"type" : "audio",
  "duration": 34,
  "fileId": 1
}
```
or
```json
{
	"type" : "image",
  "fileId": 1
}
```

### (server) total-online
```json
{
	"total": 15
}
```

### (server) user-joined
```json
{
	"id" : 1,
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
			"type": "audio",
			"message": "",
			"date":"2020-05-04 12:40",
			"user": {
				"id": 2,
				"username": "Daniel"
			},
			"file": {
				"id": 1,
				"name": "voice",
				"extension": "mp4",
				"duration": 39,
				"url": "http://backendurl.com/file/content/48b874b5-bf02-4af8-9664-90ca7chg6cb0",
				"thumbnailUrl": null
			}
		},
		{
			"type": "image",
			"message": "",
			"date":"2020-05-04 12:40",
			"user": {
				"id": 2,
				"username": "Daniel"
			},
			"file": {
				"id": 1,
				"name": "image",
				"extension": "jpg",
				"duration": null,
				"url": "http://backendurl.com/file/content/48b874b5-bf02-4af8-2252-90ca7chg6cb0",
				"thumbnailUrl": "http://backendurl.com/file/content/48b874b5-bf02-4af8-2252-90ca7chg6cb0"
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
````
or
```json
{
			"type": "audio",
			"message": "",
			"date":"2020-05-04 12:40",
			"user": {
				"id": 2,
				"username": "Daniel"
			},
			"file": {
				"id": 1,
				"name": "voice",
				"extension": "mp4",
				"duration": 39,
				"url": "http://backendurl.com/file/content/48b874b5-bf02-4af8-9664-90ca7chg6cb0",
				"thumbnailUrl": null
			}
		}
````
or
```json
		{
			"type": "image",
			"message": "",
			"date":"2020-05-04 12:40",
			"user": {
				"id": 2,
				"username": "Daniel"
			},
			"file": {
				"id": 1,
				"name": "image",
				"extension": "jpg",
				"duration": null,
				"url": "http://backendurl.com/file/content/48b874b5-bf02-4af8-2252-90ca7chg6cb0",
				"thumbnailUrl": "http://backendurl.com/file/content/48b874b5-bf02-4af8-2252-90ca7chg6cb0"
			}
		}
```

# Test client 

cd test_client

npm install

node client.js
