# Lucarne Family — Service Reference

All services are in the `lucarne_family` domain and are callable from **Developer Tools → Services** or via `hass.callService()` / `hass.services.async_call()` in automations.

---

## `lucarne_family.add_task`

Add a task to a family member's or household todo list.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `member` | string | yes | Member slug, or `"household"` for the shared list |
| `summary` | string | yes | Task title (max 200 characters) |
| `type` | string | no | `"routine"` or `"chore"` (default: `"chore"`) |
| `recurrence` | string | no | RRULE string (empty string = one-off) |
| `icon` | string | no | Single emoji icon |
| `due` | datetime | no | Optional due date/time |
| `source` | string | no | Creation source: `"manual"`, `"template"`, or `"apple"` (default: `"manual"`) |
| `assignee` | string | no | Member slug to assign; only accepted when `member == "household"` |

**Fires event**: `lucarne_family_task_added` with `{member, uid, type, summary}`

**Validation errors**:
- `member` not in known slugs and not `"household"` → `ServiceValidationError`
- `recurrence` non-empty and not a valid RRULE in the supported set → schema error
- `source` not in `{"manual", "template", "apple"}` → schema error
- `assignee` on a non-household member → `ServiceValidationError`
- `assignee` not a known member slug → `ServiceValidationError`

**Example call (Developer Tools)**:
```yaml
service: lucarne_family.add_task
data:
  member: anna
  summary: Brush teeth
  type: routine
  recurrence: FREQ=DAILY
  icon: 🦷
```

---

## `lucarne_family.update_task_metadata`

Update metadata fields on an existing task. Only the fields provided are changed.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uid` | string | yes | The task's unique identifier (UUID) |
| `icon` | string | no | New emoji icon |
| `recurrence` | string | no | New RRULE string |
| `type` | string | no | New type: `"routine"` or `"chore"` |
| `assignee` | string | no | New assignee member slug (household tasks only) |

**Fires event**: `lucarne_family_task_metadata_updated`

**Validation errors**:
- `uid` not found in task_metadata → `ServiceValidationError`
- `recurrence` non-empty and not a valid RRULE → schema error
- `type` not in `{"routine", "chore"}` → schema error
- `assignee` on a non-household task → `ServiceValidationError`
- `assignee` not a known member slug → `ServiceValidationError`

**Example call**:
```yaml
service: lucarne_family.update_task_metadata
data:
  uid: "550e8400-e29b-41d4-a716-446655440000"
  recurrence: FREQ=WEEKLY;BYDAY=MO,WE,FR
  icon: 🏃
```

---

## `lucarne_family.delete_task`

Delete a task and its metadata row. Completion log rows are preserved for audit history.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uid` | string | yes | The task's unique identifier (UUID) |

**Fires event**: `lucarne_family_task_deleted`

**Validation errors**:
- `uid` not found in task_metadata → `ServiceValidationError`

**Example call**:
```yaml
service: lucarne_family.delete_task
data:
  uid: "550e8400-e29b-41d4-a716-446655440000"
```

---

## `lucarne_family.toggle_task`

Toggle a task's completion status (needs_action ↔ completed) and append a completion log entry.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uid` | string | yes | The task's unique identifier (UUID) |

**Fires event**: `lucarne_family_task_toggled`

**Validation errors**:
- `uid` not found in task_metadata → `ServiceValidationError`

**Example call**:
```yaml
service: lucarne_family.toggle_task
data:
  uid: "550e8400-e29b-41d4-a716-446655440000"
```

---

## `lucarne_family.upload_avatar`

Upload an avatar image for a family member.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `member` | string | yes | Member slug |
| `image_data` | string | yes | Base64-encoded image bytes |
| `mime_type` | string | yes | `"image/png"`, `"image/jpeg"`, or `"image/webp"` |

**Constraints**:
- Max file size: 2 MB
- Max pixel count: 16,777,216 total pixels (e.g. 4096 × 4096)
- File type is validated via magic bytes independent of `mime_type`
- Written to `<config>/www/lucarne/avatars/<slug>.<ext>`
- Served at `/local/lucarne/avatars/<slug>.<ext>`

**Fires event**: `lucarne_family_avatar_uploaded`

**Validation errors**:
- `member` not in known slugs → `ServiceValidationError`
- Decoded bytes exceed 2 MB → `ServiceValidationError`
- Declared `mime_type` doesn't match actual image magic bytes → `ServiceValidationError`
- Image exceeds 16,777,216 total pixels → `ServiceValidationError`

**Example call** (from Python/automation, base64-encode the file first):
```yaml
service: lucarne_family.upload_avatar
data:
  member: anna
  image_data: "iVBORw0KGgoAAAANSUhEUgAA..."
  mime_type: image/png
```

---

## WebSocket API

### `lucarne_family/get_family`

Read the full family state in one round-trip. Used by the chores card.

**Request**:
```json
{"id": 1, "type": "lucarne_family/get_family"}
```

**Response**:
```json
{
  "members": [
    {
      "slug": "anna",
      "name": "Anna",
      "color": "#f5c89c",
      "avatar": "/local/lucarne/avatars/anna.png",
      "created_at": "2024-09-01T08:00:00",
      "preset": "school-age",
      "todo_entity_id": "todo.anna",
      "streak_counter_id": "counter.anna_streak"
    }
  ],
  "task_metadata": [
    {
      "item_uid": "550e8400-...",
      "member_slug": "anna",
      "assignee_slug": "",
      "type": "routine",
      "recurrence": "FREQ=DAILY",
      "icon": "🦷",
      "source": "template",
      "apple_uid": "",
      "created_at": "2024-09-01T08:00:00+00:00"
    }
  ],
  "reset_time": "04:00",
  "streak_check_time": "21:00",
  "household_entity_id": "todo.lucarne_household"
}
```

Auth: any logged-in HA user (no admin required).
