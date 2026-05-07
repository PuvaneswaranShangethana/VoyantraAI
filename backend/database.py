import mysql.connector
from mysql.connector import Error

def get_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            port=3306,
            user="root",
            password="",   # change if you set password in XAMPP
            database="voyantra_ai"
        )

        if connection.is_connected():
            print("✅ MySQL Connected")
            return connection
        else:
            return None

    except Error as e:
        print("❌ Database connection error:", e)
        return None


if __name__ == "__main__":
    conn = get_connection()
    if conn:
        print("✅ Database Connected Successfully")
    else:
        print("❌ Connection Failed")