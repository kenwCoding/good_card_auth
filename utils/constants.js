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