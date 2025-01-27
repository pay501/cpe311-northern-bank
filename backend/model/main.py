import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

# Load Data
df_train = pd.read_csv('./dataset/train_u6lujuX_CVtuZ9i.csv')
df_test = pd.read_csv('./dataset/test_Y3wMUE5_7gLdaTN.csv')

# Preprocessing
df_train['Loan_Status'] = df_train['Loan_Status'].map({'Y': 1, 'N': 0})
data = pd.concat([df_train, df_test], ignore_index=True)

# Handle missing values
imputer = SimpleImputer(strategy='median')
data['LoanAmount'] = imputer.fit_transform(data[['LoanAmount']])
data['Loan_Amount_Term'] = imputer.fit_transform(data[['Loan_Amount_Term']])
data['Credit_History'] = imputer.fit_transform(data[['Credit_History']])

# Fill categorical missing values with mode
for col in ['Gender', 'Married', 'Dependents', 'Self_Employed']:
    data[col] = data[col].fillna(data[col].mode()[0])

# Encode categorical variables
categorical_cols = ['Gender', 'Married', 'Dependents', 'Education', 'Self_Employed', 'Property_Area']
data = pd.get_dummies(data, columns=categorical_cols, drop_first=True)

# Separate train and test datasets
train = data.iloc[:len(df_train)]
test = data.iloc[len(df_train):]

X = train.drop(columns=['Loan_ID', 'Loan_Status'])
y = train['Loan_Status']

# Train-Test Split
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale the features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_val = scaler.transform(X_val)
test_scaled = scaler.transform(test.drop(columns=['Loan_ID', 'Loan_Status'], errors='ignore'))

# Train Logistic Regression Model
model = LogisticRegression(max_iter=2000)
model.fit(X_train, y_train)

# Evaluate the Model
y_pred = model.predict(X_val)
print("Accuracy:", accuracy_score(y_val, y_pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_val, y_pred))
print("\nClassification Report:\n", classification_report(y_val, y_pred))

# Predict on test data
test['Loan_Status_Pred'] = model.predict(test_scaled)
print("\nTest Predictions:\n", test[['Loan_ID', 'Loan_Status_Pred']])

# Function to take manual input
def manual_input():
    print("Please enter the following details:")
    
    # รับข้อมูลจากผู้ใช้
    Gender = input("Gender (Male/Female): ")
    Married = input("Married (Yes/No): ")
    Dependents = input("Dependents (0/1/2/3+): ")
    Education = input("Education (Graduate/Not Graduate): ")
    Self_Employed = input("Self Employed (Yes/No): ")
    ApplicantIncome = float(input("Applicant Income: "))
    CoapplicantIncome = float(input("Coapplicant Income: "))
    LoanAmount = float(input("Loan Amount: "))
    Loan_Amount_Term = float(input("Loan Amount Term (in days): "))
    Credit_History = float(input("Credit History (1.0 for good, 0.0 for bad): "))
    Property_Area = input("Property Area (Urban/Rural/Semiurban): ")
    
    # สร้าง dictionary จากข้อมูลที่รับมา
    data = {
        'Gender': Gender,
        'Married': Married,
        'Dependents': Dependents,
        'Education': Education,
        'Self_Employed': Self_Employed,
        'ApplicantIncome': ApplicantIncome,
        'CoapplicantIncome': CoapplicantIncome,
        'LoanAmount': LoanAmount,
        'Loan_Amount_Term': Loan_Amount_Term,
        'Credit_History': Credit_History,
        'Property_Area': Property_Area
    }
    
    # แปลง dictionary เป็น DataFrame
    input_df = pd.DataFrame([data])
    return input_df

# Function to prepare input data
def prepare_input(input_df):
    # เติม missing values (ถ้ามี)
    for col in ['Gender', 'Married', 'Dependents', 'Self_Employed']:
        input_df[col] = input_df[col].fillna(data[col].mode()[0])
    
    # Encode categorical variables
    categorical_cols = ['Gender', 'Married', 'Dependents', 'Education', 'Self_Employed', 'Property_Area']
    input_df = pd.get_dummies(input_df, columns=categorical_cols, drop_first=True)
    
    # เพิ่มคอลัมน์ที่หายไป (เนื่องจาก one-hot encoding อาจทำให้คอลัมน์ไม่ตรงกับที่โมเดลคาดหวัง)
    missing_cols = set(X.columns) - set(input_df.columns)
    for col in missing_cols:
        input_df[col] = 0
    
    # จัดลำดับคอลัมน์ให้ตรงกับ X
    input_df = input_df[X.columns]
    
    # Scale ข้อมูล
    input_scaled = scaler.transform(input_df)
    return input_scaled

# Function to predict loan status
def predict_loan_status(model, input_scaled):
    prediction = model.predict(input_scaled)
    prediction_proba = model.predict_proba(input_scaled)
    
    if prediction[0] == 1:
        print("\nPrediction: Loan Approved (Y)")
    else:
        print("\nPrediction: Loan Rejected (N)")
    
    print(f"Probability: {prediction_proba[0]}")

# Main function to run manual input and prediction
if __name__ == "__main__":
    # รับข้อมูลจากผู้ใช้
    input_df = manual_input()
    
    # เตรียมข้อมูลให้ตรงกับรูปแบบที่โมเดลคาดหวัง
    input_scaled = prepare_input(input_df)
    
    # ทำนายผลลัพธ์
    predict_loan_status(model, input_scaled)