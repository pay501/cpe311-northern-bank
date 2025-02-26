import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
#from sklearn.preprocessing import StandardScaler

try:
    model = joblib.load("../trained_svm/svm_loan_model.pkl")
    scaler = joblib.load("../trained_svm/svm_scaler.pkl")
    
except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error loading model or scaler: {str(e)}")

app = FastAPI()

class LoanRequest(BaseModel):
    Gender: str
    Married: str
    Dependents: str
    Education: str
    Self_Employed: str
    ApplicantIncome: float
    CoapplicantIncome: float
    LoanAmount: float
    Loan_Amount_Term: float
    Credit_History: float
    Property_Area: str

def preprocess_input(data: LoanRequest):
    df = pd.DataFrame([data.dict()])

    df = pd.get_dummies(df, columns=['Gender', 'Married', 'Dependents', 'Education', 'Self_Employed', 'Property_Area'], drop_first=True)

    df.fillna(0, inplace=True)  
    
    expected_cols = ['ApplicantIncome', 'CoapplicantIncome', 'LoanAmount', 'Loan_Amount_Term', 'Credit_History', 
                     'Gender_Male', 'Married_Yes', 'Dependents_1', 'Dependents_2', 'Dependents_3+',
                     'Education_Not Graduate', 'Self_Employed_Yes', 'Property_Area_Semiurban', 'Property_Area_Urban']

    for col in expected_cols:
        if col not in df:
            df[col] = 0 

    df = df[expected_cols]

    df_scaled = scaler.transform(df)

    return df_scaled

@app.post("/predict")
def predict_loan(request: LoanRequest):
    processed_data = preprocess_input(request)

    prediction = model.predict(processed_data)
    
    result = "Y" if prediction[0] == 1 else "N"

    return {"Loan_Status": result}
