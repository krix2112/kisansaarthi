# KisanSaarthi API Contract Specification

This document details all API endpoints across the backend and voice-ai modules. Request and response schemas are to be completed by team owners.

## Endpoints

### 1. Farmer Management
#### `POST /farmers`
- **Description:** Register a new farmer in the system.
- **Request Body:** *(Team to complete)*
- **Response Schema:** *(Team to complete)*

#### `GET /farmers/:id/queue`
- **Description:** Retrieve current queue position and ETA for a specific farmer.
- **Request Parameters:** `:id` - Farmer UUID
- **Response Schema:** *(Team to complete)*

#### `GET /farmers/:id/status`
- **Description:** Retrieve current booking and procurement status for a farmer.
- **Request Parameters:** `:id` - Farmer UUID
- **Response Schema:** *(Team to complete)*

---

### 2. Slot Booking
#### `POST /bookings`
- **Description:** Create a new procurement slot booking.
- **Request Body:** *(Team to complete)*
- **Response Schema:** *(Team to complete)*

---

### 3. Mandi Operations & Staff
#### `POST /staff/arrivals`
- **Description:** Record arrival of a farmer at the mandi check-in desk.
- **Request Body:** *(Team to complete)*
- **Response Schema:** *(Team to complete)*

#### `POST /staff/procurement`
- **Description:** Record crop weight and quality grading; triggers AgroChain proof anchoring.
- **Request Body:** *(Team to complete)*
- **Response Schema:** *(Team to complete)*

---

### 4. Payments
#### `PATCH /payments/:id`
- **Description:** Update payment processing/paid state; triggers AgroChain proof anchoring.
- **Request Parameters:** `:id` - Payment UUID
- **Request Body:** *(Team to complete)*
- **Response Schema:** *(Team to complete)*

---

### 5. Mandi Market Prices
#### `GET /mandis/:id/prices`
- **Description:** Fetch current crop price data for a specified mandi.
- **Request Parameters:** `:id` - Mandi UUID
- **Response Schema:** *(Team to complete)*

---

### 6. System Health
#### `GET /health`
- **Description:** Health check status endpoint for uptime monitoring.
- **Response Schema:** *(Team to complete)*

---

### 7. Voice AI Webhooks & Tools
#### `POST /voice/webhook`
- **Description:** Telephony provider webhook for incoming voice calls.
- **Request Body:** *(Team to complete)*
- **Response Schema:** *(Team to complete)*

#### `POST /voice/tool/get-slot`
- **Description:** Voice agent tool call to query available procurement slots.
- **Request Body:** *(Team to complete)*
- **Response Schema:** *(Team to complete)*

#### `POST /voice/tool/get-queue`
- **Description:** Voice agent tool call to query live queue status.
- **Request Body:** *(Team to complete)*
- **Response Schema:** *(Team to complete)*

#### `POST /voice/tool/get-price`
- **Description:** Voice agent tool call to query current crop prices.
- **Request Body:** *(Team to complete)*
- **Response Schema:** *(Team to complete)*

#### `POST /voice/tool/get-payment`
- **Description:** Voice agent tool call to query farmer payout status.
- **Request Body:** *(Team to complete)*
- **Response Schema:** *(Team to complete)*
