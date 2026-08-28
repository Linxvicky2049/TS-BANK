# TS Bank Digital Banking Frontend

Frontend application for the TS Bank Digital Banking System.

## Overview

The frontend provides the customer-facing banking interface for:

* Authentication
* Customer onboarding
* BVN/NIN submission
* KYC status
* Account creation
* Account dashboard
* Account balance
* Transfers
* Name enquiry
* Transaction history
* Notifications

## Backend Connection

The frontend connects to the TS Bank backend.

Recommended `.env` configuration:

```env
VITE_API_URL=http://localhost:5000
```

The frontend API client should construct:

```text
http://localhost:5000/api
```

Do NOT set:

```env
VITE_API_URL=http://localhost:5000/api
```

while also appending `/api` in the API client.

Otherwise requests become:

```text
/api/api/...
```

which is incorrect.

## API Structure

Frontend requests should use:

```text
/api/auth/...
/api/onboarding/...
/api/accounts/...
/api/transfers/...
/api/transactions/...
```

## KYC User Flow

### Step 1

Customer submits BVN or NIN.

### Step 2

Frontend displays:

```text
KYC Verification Pending

Your information has been submitted and is awaiting administrative verification.
```

### Step 3

Customer waits for admin approval.

The frontend should retrieve the current KYC status from:

```text
GET /api/onboarding/status
```

### Step 4

If approved:

```text
KYC Verification Approved

Your identity has been successfully verified.
You can now create your bank account.
```

### Step 5

If rejected:

```text
KYC Verification Rejected

Your KYC verification was rejected.
```

The rejection reason should be displayed when provided by the backend.

## KYC Status

The frontend should support:

```text
PENDING
APPROVED
REJECTED
```

Account creation should only be available when:

```text
APPROVED
```

However, the backend remains responsible for enforcing this rule.

## Account

Create account:

```text
POST /api/accounts
```

Retrieve account:

```text
GET /api/accounts/me
```

Retrieve balance:

```text
GET /api/accounts/balance
```

Expected opening balance:

```text
₦15,000
```

## Transfers

Name enquiry:

```text
GET /api/transfers/name-enquiry/:accountNumber
```

Transfer:

```text
POST /api/transfers
```

## Transactions

Transaction history:

```text
GET /api/transactions
```

Transaction details:

```text
GET /api/transactions/:ref
```

## Notifications

The frontend should provide an accessible notification mechanism.

Recommended:

* Notification bell
* Unread count
* Notification list
* KYC approval notification
* KYC rejection notification
* Mark as read

Example approval notification:

```text
KYC Verification Approved

Your KYC verification has been approved.
You can now create your bank account.
```

## Authentication

Authenticated requests must include the customer's authentication token according to the backend authentication implementation.

The frontend must not store or expose NIBSS API credentials.

The frontend communicates only with the TS Bank backend.

## Important Security Rule

Never place:

```text
NIBSS_API_KEY
NIBSS_API_SECRET
```

inside the frontend `.env`.

These credentials belong exclusively to the backend.

Frontend environment variables should contain only public configuration such as:

```env
VITE_API_URL=http://localhost:5000
```

## Development

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

The Vite development server will normally provide a local URL such as:

```text
http://localhost:5173
```

## Frontend Testing

Verify:

1. Registration works.
2. Login works.
3. BVN submission works.
4. NIN submission works.
5. KYC displays PENDING.
6. Account creation is unavailable while PENDING.
7. Admin approval changes status.
8. Customer receives approval notification.
9. Account creation becomes available.
10. Account number appears.
11. ₦15,000 balance appears.
12. Balance endpoint works.
13. Name enquiry works.
14. Transfer works.
15. Transactions appear.
16. Transaction details work.
17. No request contains `/api/api`.
18. Unauthorized users cannot access protected banking pages.
