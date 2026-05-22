# Architecture

## Data flow (stub — populated each phase)

Mac mini → HA webhook → todo entities → Lovelace dashboard (iPad)

Phase 1: Reminders bridge (one-way sync)
Phase 2–4: Custom Lit cards with WebSocket subscriptions
Phase 5: HACS publication
