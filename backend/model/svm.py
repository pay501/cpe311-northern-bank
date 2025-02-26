import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

df_train = pd.read_csv('./dataset/train_u6lujuX_CVtuZ9i.csv')
df_test = pd.read_csv('./dataset/test_Y3wMUE5_7gLdaTN.csv')

df_train['Loan_Status'] = df_train['Loan_Status'].map({'Y': 1, 'N': 0})
data = pd.concat([df_train, df_test], ignore_index=True)

imputer = SimpleImputer(strategy='median')
data['LoanAmount'] = imputer.fit_transform(data[['LoanAmount']])
data['Loan_Amount_Term'] = imputer.fit_transform(data[['Loan_Amount_Term']])
data['Credit_History'] = imputer.fit_transform(data[['Credit_History']])

for col in ['Gender', 'Married', 'Dependents', 'Self_Employed']:
    data[col] = data[col].fillna(data[col].mode()[0])

categorical_cols = ['Gender', 'Married', 'Dependents', 'Education', 'Self_Employed', 'Property_Area']
data = pd.get_dummies(data, columns=categorical_cols, drop_first=True)

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


# Train Support Vector Machine Model
model = SVC(kernel='rbf', C=1.0, gamma='scale', class_weight='balanced')

model.fit(X_train, y_train)

# Evaluate the Model
y_pred = model.predict(X_val)
print("Accuracy:", accuracy_score(y_val, y_pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_val, y_pred))
print("\nClassification Report:\n", classification_report(y_val, y_pred))

import joblib
joblib.dump(scaler, "./trained_svm/svm_scaler.pkl")
joblib.dump(model, "./trained_svm/svm_loan_model.pkl")
print("Model saved successfully!")
