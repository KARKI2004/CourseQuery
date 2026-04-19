# Google Search File Store — Setup Guide
> All scripts in this guide were written and tested in Google Colab.

---

## Prerequisites

- Python 3.8+
- Google AI Studio account
- google-genai
- Your PDF course materials 

---

## 1. Create a File Search Store

```
import os
import time
from google import genai
from google.colab import userdata


# 1. INITIALIZE: 
API_KEY = userdata.get('Your API key from Google ai studio')
client = genai.Client(api_key=API_KEY)


# 2. FILE CONFIGURATION
# Make sure these are in your working folder ready to be uploaded
FILES = ['example1.pdf', 'example2.pdf']


try:
    # 3. CREATE THE STORE
    # This is the "Knowledge Base" for your students.
    print("🏗️ Creating Permanent Store...")
    store = client.file_search_stores.create(
        config={'display_name': 'Select a name for your store'}
    )
    print(f"✅ Store Created: {store.name}")


    # 4. UPLOAD AND INDEX
    for file_path in FILES:
        if not os.path.exists(file_path):
            print(f"❌ Error: {file_path} not found. Skip.")
            continue
           
        print(f"📤 Indexing {file_path}...")
        operation = client.file_search_stores.upload_to_file_search_store(
            file=file_path,
            file_search_store_name=store.name
        )


        # 5. POLLING (Wait for Google to finish reading)
        while not operation.done:
            print("Indexing... 📚")
            time.sleep(10)
            operation = client.operations.get(operation)
       
        print(f"✅ {file_path} added successfully!")


    print(f"\n🚀 ALL DONE!")
    print(f"STORE ID FOR your project: {store.name}")


except Exception as e:
    print(f"❌ Error during process: {e}")
```


## 2. Upload Materials
```
import os
import time
from google import genai
from google.colab import userdata


# Initialize with your API key
client = genai.Client(api_key=userdata.get('GEMINI_API_KEY'))


# 1. Set FILE_PATH to the new PDF and STORE_ID
FILE_PATH = '/content/your-file.pdf'
STORE_ID = 'Your store id'


# 2. Verify that the new file exists

if not os.path.exists(FILE_PATH):
    print(f"❌ Error: {FILE_PATH} not found. Please ensure it is uploaded to the /content/ folder.")
else:
    try:
        print(f"Verification: PDF file '{FILE_PATH}' found.")
        print(f"Using existing Store ID: {STORE_ID}")


        # 3. Upload and Index to the existing store
        print(f"\n📤 Uploading and Indexing '{FILE_PATH}' into store '{STORE_ID}'...")
        operation = client.file_search_stores.upload_to_file_search_store(
            file=FILE_PATH,
            file_search_store_name=STORE_ID
        )


        # 4. Poll for completion
        while not operation.done:
            print("Indexing... 📚")
            time.sleep(10) # Wait for 10 seconds before polling again
            operation = client.operations.get(operation) # Get updated state of the operation


        # 5. Print success or error message
        if operation.done:
            print(f"\n✅ SUCCESS! File '{FILE_PATH}' uploaded and indexed to store '{STORE_ID}'.")
        else:
            print(f"\n⚠️ WARNING: File '{FILE_PATH}' indexing did not complete successfully. Final status: {operation.status}")


    except Exception as e:
        print(f"❌ Error during process: {e}")
```


## 3. Verify Uploaded Materials

```
from google import genai
from google.genai import types


# 1. Configuration
API_KEY = userdata.get('GEMINI_API_KEY')
client = genai.Client(api_key=API_KEY)
# Use your actual Store ID here
STORE_ID = "Your store id"


# 2. Setup the "Search" Tool
# This tells Gemini to look inside your PDF store for the answer
file_search_tool = types.Tool(
    file_search=types.FileSearch(
        file_search_store_names=[STORE_ID]
    )
)


# 3. Ask your question
question = "Define SCM."


print(f"🤔 Asking: {question}...\n")


response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=question,
    config=types.GenerateContentConfig(
        tools=[file_search_tool],
        temperature=0.0 # Keep it 0.0 for factual accuracy
    )
)


# 4. Print the result
print("--- AI RESPONSE ---")
print(response.text)
print("-" * 20)


# 5. Optional: See where the AI got the answer (Citations)
if response.candidates[0].grounding_metadata:
    print("\n📚 Sources found in your PDFs:")
    for i, chunk in enumerate(response.candidates[0].grounding_metadata.grounding_chunks, 1):
        source_title = chunk.retrieved_context.title
        print(f"[{i}] {source_title}")
```


## 4. Delete Materials
```
from google import genai
from google.colab import userdata


# 1. SETUP
API_KEY = userdata.get('GEMINI_API_KEY')
client = genai.Client(api_key=API_KEY)
STORE_ID = "Your store id"


# 2. INPUT: The name you want to delete
FILE_TO_DELETE = "name of file to delete.pdf"  


try:
    print(f"🔍 Searching for '{FILE_TO_DELETE}' in the knowledge base...")
   
    # List all documents in the store
    docs = client.file_search_stores.documents.list(parent=STORE_ID)
   
    target_id = None
    for d in docs:
        if d.display_name == FILE_TO_DELETE:
            target_id = d.name
            break
           
    if target_id:
        print(f"🗑️ Deleting {FILE_TO_DELETE} (ID: {target_id})...")
        # The 'force=True' is CRITICAL here to clear the internal chunks
        client.file_search_stores.documents.delete(name=target_id, config={'force': True})
        print(f"✅ SUCCESS: {FILE_TO_DELETE} has been removed.")
    else:
        print(f"❌ Error: No file named '{FILE_TO_DELETE}' was found in this store.")


except Exception as e:
    print(f"❌ Deletion failed: {e}")
```
