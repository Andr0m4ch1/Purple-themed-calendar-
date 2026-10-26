import io
import json
import logging
from fdk import response

notes_db = {}

def handler(ctx, data: io.BytesIO = None):
    try:
        
        body = json.loads(data.getvalue()) if data else {}
        action = body.get("action")
        date_str = body.get("date")
        
        if action == "save":
            content = body.get("content", "")
            notes_db[date_str] = content
            return response.Response(
                ctx, response_data=json.dumps({"message": f"Saved note for {date_str}"}),
                status_code=200, content_type="application/json"
            )
            
        elif action == "view":
            content = notes_db.get(date_str, "No entry found")
            return response.Response(
                ctx, response_data=json.dumps({"content": content}),
                status_code=200, content_type="application/json"
            )
        
        return response.Response(ctx, response_data=json.dumps({"error": "Unknown action"}), status_code=400)

    except Exception as ex:
        return response.Response(ctx, response_data=json.dumps({"error": str(ex)}), status_code=500)