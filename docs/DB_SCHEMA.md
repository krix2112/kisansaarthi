# KisanSaarthi Database Schema Specification

This document lists all PostgreSQL tables in Supabase. Detailed column definitions and constraints are to be completed by team owners.

## Table Specifications

### 1. `farmers`
- **Description:** Stores farmer profile and authentication details.
- **Columns:** *(Team to complete)*

### 2. `mandis`
- **Description:** Master directory of government procurement centers / mandis.
- **Columns:** *(Team to complete)*

### 3. `slots`
- **Description:** Mandi capacity slots available for procurement scheduling.
- **Columns:** *(Team to complete)*

### 4. `bookings`
- **Description:** Procurement slot bookings made by farmers via app or voice AI.
- **Columns:** *(Team to complete)*

### 5. `queue_events`
- **Description:** Real-time mandi queue entry and movement logs.
- **Columns:** *(Team to complete)*

### 6. `procurements`
- **Description:** Recorded crop weight, moisture, and quality grading event records.
- **Columns:** *(Team to complete)*

### 7. `payments`
- **Description:** Payment processing state and payout tracking for procured produce.
- **Columns:** *(Team to complete)*

### 8. `price_cache`
- **Description:** Cached crop MSP and market price records fetched from Data.gov.in.
- **Columns:** *(Team to complete)*

### 9. `calls`
- **Description:** Log of telephony calls handled by the KisanSaarthi Voice AI agent.
- **Columns:** *(Team to complete)*

### 10. `proof_events`
- **Description:** On-chain proof hash logs anchored to Shardeum EVM testnet via AgroChain.
- **Columns:** *(Team to complete)*

### 11. `audit_logs`
- **Description:** System-wide operation and security audit trails.
- **Columns:** *(Team to complete)*
