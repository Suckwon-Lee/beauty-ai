from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

@app.get("/health")
def health() -> dict:
    return {"ok": True}

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    # Save the file temporarily
    os.makedirs("uploads", exist_ok=True)
    path = f"uploads/{file.filename}"
    with open(path, "wb") as f:
        content = await file.read()
        f.write(content)
    size_kb = round(len(content) / 1024, 2)
    return {"received": file.filename, "size_kb": size_kb}
