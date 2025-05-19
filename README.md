# City backend

## Installation

Install node.js 18+, clone the repository, then

`npm install`

By default the API is accessible at `http://localhost:3000`. You may want to setup a reverse proxy like Nginx to make it accessible on a public url.

## Warning

Frontend and backend must be in the same directory and keep original folder names

## dev run
`npm run dev`

## Run
`npm run build`
`npm run start`

## Nginx
```text
server {
	listen 80;
	server_name localhost;

	location / {
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
		proxy_pass http://127.0.0.1:3000;
	}
    
    location ^~ /og/ {
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_pass http://127.0.0.1:3000;
    }

	location ~ \.(js|ico|svg|css|png|jpeg|json) {
		root /path/to/build;
	}
}
```

Alternatively, you can use Docker