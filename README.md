# OLX clone

My attempt to recreate the basic functionality of https://www.olx.ua/uk/ on Nest.js and PostgreSQL.
Development in progress, functionality will be added over time.

## Main features

- User account creation ⬇
---
Added the ability to confirm the account by [phone number](https://www.twilio.com/en-us) to access the creation and work with ads for sale.

- Multi-session protection using [jwt-tokens](https://jwt.io) ⬇
---
Both access-token and refresh-tokens are used to protect sessions (up to 10 tokens per account), as well as IP whitelisting.

- Working with sales ads ⬇
---
Implemented the basic CRUD functionality to work with ads for sale.

- Full-featured search engine ⬇
---
With the help of [ElasticSearch](https://www.elastic.co) implemented a full-fledged search engine on a database of ads for sale. Find what you need even with typos!


## .env file

| DATA               | VALUE                           |
| ------------------ | ------------------------------- |
| DATABASE_URL       | "your db connection url"        |
| JWT_ACCESS_SECRET  | "your jwt access token secret"  |
| JWT_REFRESH_SECRET | "your jwt refresh token secret" |
| SALT               | "your salt"                     |
| TWILIO_ACCOUNT_SID | "your twilio account SID"       |
| TWILIO_AUTH_TOKEN  | "your twilio account token"     |
| TWILIO_SERVICE_SID | "your twilio service SID"       |

## Endpoints and request examples

```mermaid
graph TD;
    /-->/api;
    /-->/user;
    /-->/auth;
    /-->/api;
    /-->/sale-post;
    /-->/sms;
    /sms-->/init-verify;
    /sms-->/verify;
    /user-->/myaccount_'GET'
    /auth-->/register_'POST'
    /auth-->/login_'POST'
    /auth-->/refresh_'POST'
    /sale-post-->/search?=searchTitle'GET'
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

### SMS

```go
{
	"code": "Verification code from SMS"
}
```
