# OLX clone

My attempt to recreate the basic functionality of https://www.olx.ua/uk/ on Nest.js and PostgreSQL.
Development in progress, functionality will be added over time.

## .env file

| DATA               | VALUE                           |
| ------------------ | ------------------------------- |
| DATABASE_URL       | "your db connection url"        |
| JWT_ACCESS_SECRET  | "your jwt access token secret"  |
| JWT_REFRESH_SECRET | "your jwt refresh token secret" |
| SALT               | "your salt"                     |

## Endpoints and request examples

```mermaid
graph TD;
    /-->/api;
    /-->/user;
    /-->/auth;
    /-->/sale-post;
    /user-->/myaccount_'GET'
    /auth-->/register_'POST'
    /auth-->/login_'POST'
    /auth-->/refresh_'POST'
    /sale-post-->@query(search?=searchTitle)'GET'
    /sale-post-->/create_'POST'
    /sale-post-->/update:id_'PATCH'
    /sale-post-->/delete:id_'DELETE'
    /sale-post-->/:id_'GET'
```

### Swagger API

- `@GET` /api

### Auth

- `@POST` register

```go
{
	"email":  "someemail@gmail.com",
	"phone":  "somephone",
	"name":  "somename",
	"password":  "somepassword"
}
```

- `@POST` login

```go
{
	"email":  "someemail@gmail.com",
	"phone":  "somephone",
	"name":  "somename",
	"password":  "somepassword"
}
```

- `@POST` refresh

```go
{
	Cookie: REFRESH_TOKEN
}
```

### Sale-post

- `@POST` create

```go
{
	"title":  "PlayStation 5",
	"description":  "New PlayStation 5, out of box",
	"location":  "Kharkiv",
	"phone":  "1234567890",
	"price":  500
}
```

- `@UPDATE` update

```go
{
	?"title":  "PlayStation 6",
	?"description":  "New PlayStation 6, out of box",
	?"location":  "Kharkiv",
	?"phone":  "0987654321",
	?"price":  500
}
```
