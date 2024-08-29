# smeazy

### Python 3.10.2


Run the following commands in your shell: 

1. Create and activate virtual env in this directory 
PowerShell:
  ```
   python -m venv venv
   venv\Scripts\Activate.ps1
  ```

Windows bash: 
  ```
    python -m venv venv
    source venv/Scripts/activate
  ```
Linux:
  ```
  python3 -m venv venv
  source venv/bin/activate
  ```


2. Install dependencies
 `pip install -r requirements.txt` 
3. Make database migrations
 ```
 python manage.py makemigrations
 python manage.py migrate
 ```
4. Navigate to `\frontend`
5. `npm run dev` to run React at port `:<port>`
6. Navigate to `BizRahisi\Settings.py`
7. Run `python manage.py runserver` to run Django at port `:8000`
