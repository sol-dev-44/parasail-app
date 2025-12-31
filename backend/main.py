from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Parasail API", version="0.1.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Parasail API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# Weather API endpoints (placeholder)
@app.get("/api/weather/current")
async def get_current_weather():
    """Get current weather conditions for parasailing"""
    return {
        "temperature": 75,
        "wind_speed": 12,
        "wind_direction": "NE",
        "conditions": "Clear",
        "suitable_for_parasailing": True
    }

@app.get("/api/chute/recommend")
async def recommend_chute(wind_speed: float, rider_weight: float):
    """Recommend appropriate chute based on conditions"""
    # Placeholder logic
    if wind_speed < 8:
        chute_size = "Large"
    elif wind_speed < 15:
        chute_size = "Medium"
    else:
        chute_size = "Small"
    
    return {
        "recommended_chute": chute_size,
        "wind_speed": wind_speed,
        "rider_weight": rider_weight,
        "safety_rating": "Good"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8081)
