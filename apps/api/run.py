import uvicorn
from api.main import get_application




if __name__ == "__main__":
    uvicorn.run("api.asgi:app", reload=True)
