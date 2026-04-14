from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import predict, shipments, chokepoints, news, alerts, analytics, health

app = FastAPI(title="ANUBIS API", description="Supply Intelligence System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

frontend_path = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist')

if os.path.exists(frontend_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_path, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        path = os.path.join(frontend_path, full_path)
        if os.path.isfile(path):
            return FileResponse(path)
        return FileResponse(os.path.join(frontend_path, "index.html"))
else:
    @app.get("/")
    def read_root():
        return {"message": "ANUBIS Backend is alive! Frontend dist not found."}

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(status_code=500, content={"error": str(exc), "code": "INTERNAL_ERROR"})

# Include Routers
app.include_router(predict.router, prefix="/api/v1")
app.include_router(shipments.router, prefix="/api/v1")
app.include_router(chokepoints.router, prefix="/api/v1")
app.include_router(news.router, prefix="/api/v1")
app.include_router(alerts.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(health.router, prefix="/api/v1")
