# TS Bank Digital Banking Backend

Backend API for the TS Bank Digital Banking System.

## Overview

The backend provides:

* Customer authentication
* Customer onboarding
* BVN verification
* NIN verification
* Administrative KYC approval
* Bank account creation
* ₦15,000 test opening balance
* Account balance
* Account name enquiry
* Transfers
* Transactions
* Notifications
* NibbsByPhoenix/NIBSS integration

## Architecture

```text
Frontend
   |
   v
TS Bank Backend
   |
   +---- MongoDB
   |
   +---- NibbsByPhoenix API
   |
   +---- Notification Service
```

The backend is responsible for enforcing all banking rules. Frontend restrictions are not considered security controls.

## KYC Flow

```text
Customer submits BVN/NIN
        |
        v
KYC = PENDING
        |
        v
Admin reviews/verifies
        |
   +----+----+
   |         |
   v         v
APPROVED   REJECTED
   |
   v
Account creation enabled
```

A customer cannot create an account until:

```text
kycStatus = APPROVED
```

## NibbsByPhoenix

Base URL:

```text
https://nibssbyphoenix.onrender.com
```

Swagger:

```text
https://nibssbyphoenix.onrender.com/api/docs/
```

Configured operations include:

```text
POST /api/auth/token
POST /api/insertBvn
POST /api/validateBvn
POST /api/insertNin
POST /api/validateNin
POST /api/account/create
GET  /api/account/name-enquiry/{accountNumber}
POST /api/transfer
GET  /api/transaction/{ref}
GET  /api/accounts
GET  /api/account/balance/{accountNumber}
```

## Local API

### Authentication

```text
/api/auth
```

### KYC

```text
POST /api/onboarding/bvn
POST /api/onboarding/nin
GET  /api/onboarding/status
```

### Accounts

```text
POST /api/accounts
GET  /api/accounts/me
GET  /api/accounts/balance
```

### Transfers

```text
GET  /api/transfers/name-enquiry/:accountNumber
POST /api/transfers
```

### Transactions

```text
GET /api/transactions
GET /api/transactions/:ref
```

## Environment Variables

The backend expects values similar to:

```env
PORT=5000

MONGODB_URI=...

JWT_SECRET=...

NIBSS_BASE_URL=https://nibssbyphoenix.onrender.com

NIBSS_API_KEY=...
NIBSS_API_SECRET=...

NIBSS_BVN_INSERT_PATH=/api/insertBvn
NIBSS_BVN_VALIDATE_PATH=/api/validateBvn

NIBSS_NIN_INSERT_PATH=/api/insertNin
NIBSS_NIN_VALIDATE_PATH=/api/validateNin

NIBSS_ACCOUNT_CREATE_PATH=/api/account/create

NIBSS_NAME_ENQUIRY_PATH=/api/account/name-enquiry

NIBSS_TRANSFER_PATH=/api/transfer

NIBSS_TRANSACTION_STATUS_PATH=/api/transaction

NIBSS_ACCOUNTS_PATH=/api/accounts

NIBSS_BALANCE_PATH=/api/account/balance
```

Never commit secrets to GitHub.

## Account Rules

Each customer may have a maximum of one bank account.

The account cannot be created until KYC is approved.

For assignment testing, accounts receive:

```text
Opening balance: ₦15,000
Currency: NGN
Status: ACTIVE
```

## NIBSS Authentication

The backend obtains a JWT from:

```text
POST /api/auth/token
```

The token is cached and sent using:

```http
Authorization: Bearer <token>
```

The backend should clear the cached token when NibbsByPhoenix returns 401 or 403.

## Error Handling

The backend should return appropriate HTTP status codes.

Examples:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
502 Bad Gateway
500 Internal Server Error
```

NIBSS integration failures should not be disguised as successful banking operations.

## Development

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Start production server:

```bash
npm start
```

Health check:

```text
GET http://localhost:5000/health
```

Expected response:

```json
{
  "success": true,
  "message": "TS-BANK API is running"
}
```

## Testing Sequence

Recommended test order:

1. Register customer.
2. Login.
3. Submit BVN or NIN.
4. Confirm KYC status is PENDING.
5. Login as admin.
6. Retrieve pending KYC.
7. Approve KYC.
8. Confirm customer status is APPROVED.
9. Confirm notification exists.
10. Create account.
11. Confirm account number.
12. Confirm ₦15,000 opening balance.
13. Retrieve account.
14. Retrieve balance.
15. Perform name enquiry.
16. Perform transfer.
17. Retrieve transaction history.
18. Retrieve transaction by reference.


Documentation: https://drive.google.com/drive/folders/1Mqw1ZWXtiOXaF9rplB_SYPM98
vsWmQt 

https://docs.google.com/document/d/1Ux-aoil60w11VBYqpeLFZ4FCBOlz-p8S/edit?usp=sharing&ouid=113925542362855292324&rtpof=true&sd=true
