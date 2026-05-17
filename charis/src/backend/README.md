# Charish API

Backend REST API for the Charish volunteer platform. Built with Python 3 / Flask, connected to PostgreSQL on AWS RDS, deployed via AWS App Runner.

---

## Tech Stack

- **Language:** Python 3.11
- **Framework:** Flask
- **Database:** PostgreSQL (AWS RDS)
- **Deploy:** AWS App Runner + Docker

---

## Run Locally

```bash
pip install -r requirements.txt
python3 main.py
```

API runs at `http://localhost:5000`

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_HOST` | RDS endpoint |
| `DB_PORT` | Database port (default: 5432) |
| `DB_NAME` | Database name |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_SSLMODE` | SSL mode (use `require` for RDS) |

---

## API Endpoints

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Check API is running |
| GET | `/db-check` | Check database connection |

---

### Users

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users` | List all users |
| GET | `/users/<id>` | Get a user |
| POST | `/users` | Create a user |
| PUT | `/users/<id>` | Update a user |

**Create user body:**
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "phone": "0912345678",
  "clothes_size": "M",
  "vegetarian": false,
  "pronouns": "she/her",
  "country": "Taiwan",
  "city": "Taipei"
}
```

---

### Organizations

| Method | Path | Description |
|--------|------|-------------|
| GET | `/organizations` | List all organizations |
| GET | `/organizations/<id>` | Get an organization |
| POST | `/organizations` | Create an organization |
| PUT | `/organizations/<id>` | Update an organization |

**Create organization body:**
```json
{
  "name": "Green Earth",
  "email": "org@example.com",
  "phone": "0211112222",
  "country": "Taiwan",
  "city": "Taipei",
  "address": "123 Main St"
}
```

---

### Events

| Method | Path | Description |
|--------|------|-------------|
| GET | `/events` | List all events |
| GET | `/events/<id>` | Get an event |
| GET | `/organizations/<org_id>/events` | List events by organization |
| POST | `/organizations/<org_id>/events` | Create an event |
| PUT | `/events/<id>` | Update an event |
| DELETE | `/events/<id>` | Delete an event |

**Create event body:**
```json
{
  "title": "Beach Cleanup",
  "description": "Join us to clean the beach",
  "country": "Taiwan",
  "city": "Taipei",
  "address": "Fulong Beach",
  "start_time": "2026-06-01T09:00:00",
  "end_time": "2026-06-01T17:00:00",
  "volunteers_amount": 20
}
```

---

### ApproveDoc

Manages volunteer applications for events.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/approvedocs` | List all applications |
| GET | `/approvedocs/<id>` | Get an application |
| POST | `/approvedocs` | User applies for an event |
| PUT | `/approvedocs/<id>/approve` | Organization approves → ticket auto-created |
| PUT | `/approvedocs/<id>/deny` | Organization denies application |

**Apply body:**
```json
{
  "users_id": "<user-uuid>",
  "event_id": "<event-uuid>",
  "question1": ["answer1"],
  "question2": ["answer2"],
  "question3": ["answer3"]
}
```

**Approve response:**
```json
{
  "message": "Approved",
  "ticket_id": 1
}
```

> When approved, a ticket with a QR code is automatically created for the user.

---

### Tickets

| Method | Path | Description |
|--------|------|-------------|
| GET | `/tickets` | List all tickets |
| GET | `/tickets/<id>` | Get a ticket |
| GET | `/tickets/scan/<qr_code>` | Organization looks up ticket by QR code |
| POST | `/tickets/scan/<qr_code>/use` | Organization scans QR code → marks used + coupon auto-created |
| POST | `/tickets/<id>/use` | Use a ticket by ID → coupon auto-created |

**Scan QR code response:**
```json
{
  "id": 1,
  "user_name": "Alice",
  "user_email": "alice@example.com",
  "event_title": "Beach Cleanup",
  "status": "approved",
  "get_rewards": false,
  "qr_code": "a3f9c12b4e6d8a01..."
}
```

**Use ticket body (by QR code or ID):**
```json
{
  "restaurant_id": "<restaurant-uuid>",
  "title": "Volunteer Reward Coupon",
  "discount_price": 50,
  "start_time": "2026-06-01T09:00:00",
  "end_time": "2026-06-30T23:59:00"
}
```

**Use ticket response:**
```json
{
  "message": "Ticket used",
  "coupon_id": 1
}
```

> When a ticket is used, a coupon is automatically created. The coupon's vegetarian flag is inherited from the user's profile.

---

### Coupons

| Method | Path | Description |
|--------|------|-------------|
| GET | `/coupons` | List all coupons |
| GET | `/coupons/<id>` | Get a coupon |

---

## Full Flow

```
1. Organization creates an Event
         ↓
2. User registers for the Event
   POST /approvedocs                →  ApproveDoc created (status: check)
         ↓
3. Organization approves the user
   PUT /approvedocs/<id>/approve    →  Ticket auto-created (with QR code)
         ↓
4. Organization selects restaurant + sets discount,
   scans user's QR code to check in
   POST /tickets/scan/<qr_code>/use →  Ticket marked as used
                                       Coupon auto-created
                                         - barcode: auto-generated
                                         - status: unused
                                         - vegetarian: from user profile
```

---

## Deploy to AWS App Runner

```bash
chmod +x deploy.sh
./deploy.sh
```

Then go to **AWS Console → App Runner → Create service → Container registry → ECR** and paste the image URI from the script output.
