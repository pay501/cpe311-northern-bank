import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, Float, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import jwt  
from jwt import PyJWTError
from fastapi.middleware.cors import CORSMiddleware

try:
    model = joblib.load("../trained_svm/svm_loan_model.pkl")
    scaler = joblib.load("../trained_svm/svm_scaler.pkl")
except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error loading model or scaler: {str(e)}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, modify for better security
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Database Connection
DATABASE_URL = "postgresql://admin:password@localhost:5432/northern-bank"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


SECRET_KEY = "secretKey"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Loan Application Model (Assume table exists)
class LoanApplication(Base):
    __tablename__ = "loan_histories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    gender = Column(String)
    married = Column(String)
    dependents = Column(String)
    education = Column(String)
    self_employed = Column(String)
    applicant_income = Column(Float)
    coapplicant_income = Column(Float)
    loan_amount = Column(Float)
    loan_amount_term = Column(Float)
    credit_history = Column(Float)
    property_area = Column(String)
    status = Column(String)

# Users Table (To fetch Credit History) (Assume table exists)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    credit_history = Column(Float, nullable=False)
    gender = Column(String, nullable=False)

# Loan Request Model
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
    Property_Area: str

# Dependency to Get DB Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Decode JWT Token & Get User ID
def get_user_id_from_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("user_id")
    except PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_credit_history(user_id: int, db: Session):
    result = db.query(User.credit_history).filter(User.id == user_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="User not found or Credit History missing")
    return result[0]

def preprocess_input(data: LoanRequest, credit_history: float):
    df = pd.DataFrame([data.dict()])
    df["Credit_History"] = credit_history

    df = pd.get_dummies(df, columns=['Gender', 'Married', 'Dependents', 'Education', 'Self_Employed', 'Property_Area'], drop_first=True)
    df.fillna(0, inplace=True)

    # Ensure all expected columns exist
    expected_cols = ['ApplicantIncome', 'CoapplicantIncome', 'LoanAmount', 'Loan_Amount_Term', 'Credit_History', 
                     'Gender_Male', 'Married_Yes', 'Dependents_1', 'Dependents_2', 'Dependents_3+',
                     'Education_Not Graduate', 'Self_Employed_Yes', 'Property_Area_Semiurban', 'Property_Area_Urban']

    for col in expected_cols:
        if col not in df:
            df[col] = 0

    df = df[expected_cols]

    df_scaled = scaler.transform(df)
    return df_scaled

@app.post("/loan-request/{user_id}")
def predict_loan(user_id: int, request: LoanRequest, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user_id_from_token = get_user_id_from_token(token)
    if user_id_from_token != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized request")

    credit_history = get_credit_history(user_id, db)

    processed_data = preprocess_input(request, credit_history)

    prediction = model.predict(processed_data)
    result = "Y" if prediction[0] == 1 else "N"

    loan_record = LoanApplication(
        user_id=user_id,
        gender=request.Gender,
        married=request.Married,
        dependents=request.Dependents,
        education=request.Education,
        self_employed=request.Self_Employed,
        applicant_income=request.ApplicantIncome,
        coapplicant_income=request.CoapplicantIncome,
        loan_amount=request.LoanAmount,
        loan_amount_term=request.Loan_Amount_Term,
        credit_history=credit_history,
        property_area=request.Property_Area,
                status=result
    )

    db.add(loan_record)
    db.commit()

    return {"Loan_Status": result}
