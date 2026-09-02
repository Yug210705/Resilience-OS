import asyncio
import json
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
import structlog
from typing import AsyncGenerator

logger = structlog.get_logger()

router = APIRouter()

event_queues = []

def broadcast_event(event_type: str, data: dict):
    message_bytes = f"event: {event_type}\ndata: {json.dumps(data)}\n\n".encode("utf-8")
    for q in event_queues:
        q.put_nowait(message_bytes)
    logger.info("Broadcasted SAP Event", event_type=event_type, listeners=len(event_queues))

async def event_generator(request: Request) -> AsyncGenerator[bytes, None]:
    queue = asyncio.Queue()
    event_queues.append(queue)
    
    try:
        # Send initial event as UTF-8 bytes immediately
        init_data = json.dumps({'status': 'Connected to SAP Event Mesh (BTP)'})
        yield f"event: connection\ndata: {init_data}\n\n".encode("utf-8")
        
        while True:
            if await request.is_disconnected():
                break
                
            try:
                msg_bytes = await asyncio.wait_for(queue.get(), timeout=10.0)
                yield msg_bytes
            except asyncio.TimeoutError:
                # Send standard SSE keepalive comment bytes
                yield b": keep-alive\n\n"
    finally:
        if queue in event_queues:
            event_queues.remove(queue)

@router.get("/stream", summary="SAP Event Mesh Stream")
async def sap_events_stream(request: Request):
    return StreamingResponse(
        event_generator(request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
