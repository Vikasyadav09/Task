from fastapi import FastAPI
from pydantic import BaseModel

import json

app=FastAPI()

class Employee(BaseModel):
    id:str
    name:str
    City:str
    Age:int
    Gender:str
    

def load_data():
    with open('data.json','r')as f:
        data=json.load(f)
    return data  

def data_save(data):
    with open('data.json','w')as f:
        json.dump(data,f,indent=4)  

@app.get("/")
def hello():
    return {"message":"Employee List"}

@app.get('/view')
def view():
    data=load_data()
    return data

@app.post('/create')
def create_employee(emp:Employee):
    data=load_data()

    if emp.id in data:

        
        return {"meaage":"Employee Already Exists"}
    data["emp.id"]={
        "name":emp.name,
        "City":emp.City,
        "Age":emp.Age,
        "Gender":emp.Gender
    }
    data_save(data)
    return {"message":"Employee added Sucessfully"}    



