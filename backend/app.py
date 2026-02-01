from fastapi import FastAPI
from config.cors import setup_cors
from config.database import init_db
from routes.pipeline import router as pipeline_router
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown

app = FastAPI(
    title="VectorShift Pipeline API",
    description="API for parsing and validating pipeline structures",
    version="1.0.0",
    lifespan=lifespan
)

# Setup CORS
setup_cors(app)

# Include routers
app.include_router(pipeline_router)

@app.get('/', tags=["health"])
def read_root():
    """Health check endpoint"""
    return {'status': 'ok', 'message': 'VectorShift Pipeline API is running'}
