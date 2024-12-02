# Use Cases

All use cases requires an authenticated user.

## Queries

- Ideally restricted to authenticated users

- GetCustomerById
  - Required fields: `customerId`
- GetCustomersListByCredit
  - Required fields: ``

## Commands

- Ideally restricted to authenticated users

- CustomerCreate
  - Required fields: `customerId`, `name`, `credit?`
- CustomerUpdate
  - Required fields: `customerId`, `name?`, `credit?`
- CustomerDelete
  - Required fields: `customerId`
- CustomerAddCredit
  - Required fields: `customerId`, `creditToAdd`
