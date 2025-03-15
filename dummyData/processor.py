import pandas as pd
import string


## Faculty csv
# Load the CSV file
file_path = '/home/nerfex/Projects/Project Allocation System/project-allocation-process-and-evaluation/dummyData/teachers.csv'
df = pd.read_csv(file_path)

# Add email column
# df['email'] = df.iloc[:, 1].str.lower().str.strip().replace(' ', '.') + '@skit.ac.in'
df['email']=df.iloc[:,1].str.lower().str.replace(' ','.') + '@skit.ac.in'

# Save the modified DataFrame back to CSV
df.to_csv(file_path, index=False)


## Students csv
# # Load the CSV file
# file_path = '/home/nerfex/Projects/Project Allocation System/project-allocation-process-and-evaluation/dummyData/students.csv'
# df = pd.read_csv(file_path)

# # Replace the first column (assumed to be 'reg no') with email
# df['email'] = df.iloc[:, 0].str.lower() + '@skit.ac.in'

# # Drop the original 'reg no' column
# df.drop(df.columns[0], axis=1, inplace=True)


# # Generate roll numbers
# df['rollNumber'] = ['23ESKCS{:03d}'.format(i) for i in range(1, len(df) + 1)]

# # Define batch chunk size
# chunk_size = 30

# # Generate alphabet sequence (A, B, C, ..., Z)
# alphabets = list(string.ascii_uppercase)

# # Add a new "batch" column
# df["batch"] = ""

# # Assign batch labels dynamically
# for i in range(0, len(df), chunk_size):
#     letter_index = (i // (2 * chunk_size))  # Change letter every 2 chunks (60 rows)
#     letter = alphabets[letter_index]  # Get corresponding letter
#     group_number = "G1" if (i // chunk_size) % 2 == 0 else "G2"  # Alternate G1 and G2

#     batch_label = f"{letter}{group_number}"
#     df.loc[i:i+chunk_size-1, "batch"] = batch_label  # Assign batch value

# # Phone numbers - flag value
# df['phone'] = '9999999999'

# # Save the modified DataFrame back to CSV
# df.to_csv(file_path, index=False)

# print("Batch assignment completed successfully!")
