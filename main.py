from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import users as users_router
from routers import stego as stego_router
from routers import history as history_router

# Create all database tables defined in models
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="K-Means Clustering Steganography API",
    version="1.0.0",
    description="Hide secret messages inside images & audio using K-Means + LSB.",
)

# ---------------------------------------------------------------------------
# CORS – allow the two most common React dev-server ports
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=[],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(users_router.router)
app.include_router(stego_router.router)
app.include_router(history_router.router)


@app.get("/")
def root():
    return {"message": "K-Means Steganography API is running."}
