import pandas as pd

data=pd.read_csv('/kaggle/input/lending-club-loan-data-csv/loan.csv', dtype='str',low_memory='False')

print(pd.head())