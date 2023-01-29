export const corsConfig = {
    "origin": [
        "http://localhost:3002",
        "http://localhost:3001",
        "http://localhost:3000"
      ],
    "credentials": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    "optionsSuccessStatus": 200
}

/* JWT */
export const ACCESS_TOKEN_TIME = 10
export const REFRESH_TOKEN_TIME = 300