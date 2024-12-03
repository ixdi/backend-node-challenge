# API

## Create a customer

`POST /v1/customer/create`

```json
{
  "name": string,
  "email": string
}
```

## Read a customer

`GET /v1/customer/search`

```json
{
  "customerId": uuid,
}
```

Response:

```json
{
  "customerId": uuid,
  "name": string,
  "credit": number,
}
```

## Update a customer

`POST /v1/customer/update`

```json
{
  "customerId": uuid,
  "name": string?,
  "credit": number?,
}
```

## Delete a customer

`POST /v1/customer/delete`

```json
{
  "customerId": uuid,
}
```

## Add credit to a customer

`POST /v1/customer/add-credit`

```json
{
  "customerId": uuid,
  "creditToAdd": number,
}
```

## List customers by credit

`GET /v1/customer/search-by-credit`

```json
{
}
```

Response:

```json
{
  "customers": [
    {
      "customerId": uuid,
      "name": string,
      "credit": number,
    }
  ]
}
```
