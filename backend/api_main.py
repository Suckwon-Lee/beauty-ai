# --- api_main.py ---
# Python fundamentals (and why pros use them:
# - import: brings library names into this module's namespace (standard practice).
# - app = FastAPI(): instantiates the web app (object-oriented design).
# - @app.get("/path"): a *decorator* that registers a function as a route.
# - def health(): defines a function. Returning a Python dict -> FastAPI serializes it to JSON (Starlette/JSONResponse).
# - Type hints (-> dict) are optional but recommended; they improve editor support and readability. Pros use them widely.

from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health() -> dict:
    return {"ok": True}