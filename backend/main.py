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

# Root handler to prevent 404s
@app.get("/")
def read_root():
    return {"message": "ANUBIS Backend is alive! Direct your browser to the Frontend."}

# Exception handler to return {"error": "message", "code": "ERROR_CODE"}
from fastapi.responses import JSONResponse

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
