# Database

## Collections and fields

- Customers
  - `customerId`: uuid
  - `name`: string
  - `credit`: number
  - `createdAt`: date
  - `updatedAt`: date

## Improvements

- Customers
  - `userId`: uuid -> Improvements: Add a reference to the user attached to the customer
  - `address`, `phone`, `dni`, ...

- Users
  - `userId`: uuid
  - `username`: string
  - `password`: string
  - `email`: string
  - `role`: CUSTOMER | ADMIN
  - `createdAt`: date
  - `updatedAt`: date
