import uuid
from datetime import datetime, date


def serialize_row(row):
    result = {}
    for key, val in row.items():
        if isinstance(val, uuid.UUID):
            result[key] = str(val)
        elif isinstance(val, (datetime, date)):
            result[key] = val.isoformat()
        else:
            result[key] = val
    return result
