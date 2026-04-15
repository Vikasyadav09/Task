from fastapi import FastAPI
from datetime import datetime
from pydantic import BaseModel , EmailStr
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

import json
import os

app = FastAPI()

@app.get("/home")

def get():
    return {"message":"I am full stack developer"}

FILE_NAME = "data.json"

def check():
    if os.path.exists(FILE_NAME):
        with open(FILE_NAME, "r") as f:
            return json.load(f)
    return []
        
def save(users):
    with open(FILE_NAME, "w") as f:
        json.dump(users,f, indent=4)

@app.post("/Registration")

def post(data: dict):
    users = check()
    if data in users:
        return {"message": "Data already exists"}
    users.append(data)
    save(users)
    return {"message": "Done",}




origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class login(BaseModel):
    email:str
    password:str

def write_log(message: str):
    with open("logs.txt", "a") as f:
        time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        f.write(f"{time} - {message}\n")


@app.post("/login")
def login(data: login):
    try:
        users = check()

        if not users:
            write_log("Login failed - no users found")
            raise HTTPException(status_code=404, detail="No users found")

        for user in users:
            if user.get("email") == data.email and user.get("password") == data.password:
                write_log(f"Login success - {data.email}")
                return {"message": "Login successful"}

        write_log(f"Login failed - invalid credentials for {data.email}")
        raise HTTPException(status_code=401, detail="Invalid email or password")

    except HTTPException as e:
        write_log(f"HTTPException - {e.detail}")
        raise e

    except Exception as e:
        write_log(f"Server error - {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


class signup(BaseModel):
    name:str
    email:EmailStr
    password:str
    fileUrl:Optional[str]=None

@app.post("/signup")
def signup(data: signup):
    try:
        users = check()

        data_dict = data.model_dump()

        for user in users:
            if user["email"] == data_dict["email"]:
                write_log(f"Signup failed - user already exists: {data_dict.get('email')}")
                raise HTTPException(status_code=409, detail="User already exists")

        users.append(data_dict)
        save(users)

        write_log(f"Signup success - {data_dict.get('email')}")
        return {"message": "Signup successful"}

    except HTTPException as e:
        write_log(f"HTTPException - {e.detail}")
        raise e

    except Exception as e:
        write_log(f"Server error in signup - {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")