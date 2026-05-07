import re
import os

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database import get_connection
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai
from passlib.context import CryptContext


# -----------------------------
# App Setup
# -----------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not found in .env file")

gemini_client = genai.Client(api_key=GEMINI_API_KEY)


# -----------------------------
# Helpers
# -----------------------------
def format_lkr(amount):
    try:
        return f"LKR {float(amount):,.0f}"
    except:
        return f"LKR {amount}"


def detect_emotion(message: str):
    msg = message.lower()

    happy_words = ["happy", "excited", "fun", "great", "good", "love", "enjoy"]
    sad_words = ["sad", "tired", "stress", "stressed", "bored", "lonely"]
    relax_words = ["relax", "calm", "peaceful", "rest"]
    angry_words = ["angry", "mad", "frustrated", "upset"]
    fear_words = ["scared", "unsafe", "danger", "worried", "fear", "afraid"]
    budget_words = ["cheap", "budget", "affordable", "low cost", "less money"]

    if any(word in msg for word in happy_words):
        return "Happy"
    if any(word in msg for word in sad_words):
        return "Sad"
    if any(word in msg for word in relax_words):
        return "Relaxing"
    if any(word in msg for word in angry_words):
        return "Angry"
    if any(word in msg for word in fear_words):
        return "Concerned"
    if any(word in msg for word in budget_words):
        return "Budget-conscious"

    return "Neutral"


def get_emotion_destination(emotion):
    mapping = {
        "Happy": "Adventure and fun places, e.g., Kitulgala 🧗",
        "Sad": "Peaceful nature places, e.g., Nuwara Eliya 🍃",
        "Relaxing": "Calm beach places, e.g., Tangalle 🏖️",
        "Angry": "Nature escape and hiking places, e.g., Ella 🌄",
        "Concerned": "Safe cultural places, e.g., Kandy 🏯",
        "Budget-conscious": "Low-cost heritage places, e.g., Anuradhapura 🏛️",
        "Neutral": "City sightseeing places, e.g., Colombo 🌆"
    }
    return mapping.get(emotion, "General Sri Lanka travel places 🌍")


def save_emotion_log(cursor, conn, user_id, user_text, emotion, suggestion):
    cursor.execute(
        """
        INSERT INTO emotion_logs
        (user_id, user_text, detected_emotion, suggested_destination)
        VALUES (%s,%s,%s,%s)
        """,
        (user_id, user_text, emotion, suggestion)
    )
    conn.commit()


def save_chat_history(cursor, conn, user_message, bot_reply, emotion):
    cursor.execute(
        """
        INSERT INTO chat_history
        (user_message, bot_response, emotion_detected)
        VALUES (%s,%s,%s)
        """,
        (user_message, bot_reply, emotion)
    )
    conn.commit()


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


# -----------------------------
# Models
# -----------------------------
class User(BaseModel):
    full_name: str
    email: str
    password: str


class Login(BaseModel):
    email: str
    password: str


class ChatRequest(BaseModel):
    message: str


class Package(BaseModel):
    package_name: str
    destination_id: int
    duration_days: int
    price: float
    category: str
    activities: str


class Hotel(BaseModel):
    hotel_name: str
    destination_id: int
    hotel_type: str
    price_per_night: float
    rating: float
    contact_number: str


class Transport(BaseModel):
    from_location: str
    to_location: str
    transport_type: str
    estimated_time: str
    estimated_cost: float
    notes: str


class FAQ(BaseModel):
    question: str
    answer: str
    category: str = "Admin"


class UnknownAnswer(BaseModel):
    question: str
    answer: str


# -----------------------------
# Auth APIs
# -----------------------------
@app.post("/register")
def register(user: User):
    conn = get_connection()
    cursor = conn.cursor()

    hashed_password = hash_password(user.password)

    cursor.execute(
        """
        INSERT INTO users
        (full_name, email, password, login_type, role)
        VALUES (%s,%s,%s,%s,%s)
        """,
        (user.full_name, user.email, hashed_password, "Email", "user")
    )

    conn.commit()
    return {"message": "User registered successfully"}


@app.post("/login")
def login(data: Login):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email=%s", (data.email,))
    user = cursor.fetchone()

    if user and verify_password(data.password, user["password"]):
        return {
            "message": "Login successful",
            "role": user.get("role"),
            "user": {
                "user_id": user.get("user_id"),
                "full_name": user.get("full_name"),
                "email": user.get("email"),
                "login_type": user.get("login_type"),
                "created_date": str(user.get("created_date")),
            }
        }

    return {"message": "Invalid credentials", "role": "invalid"}


# -----------------------------
# Package APIs
# -----------------------------
@app.get("/packages")
def get_packages():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM packages")
    data = cursor.fetchall()

    for p in data:
        p["price_lkr"] = format_lkr(p["price"])

    return data


@app.post("/packages")
def add_package(p: Package):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO packages
            (package_name, destination_id, duration_days, price, category, activities)
            VALUES (%s,%s,%s,%s,%s,%s)
            """,
            (
                p.package_name,
                p.destination_id,
                p.duration_days,
                p.price,
                p.category,
                p.activities,
            )
        )

        conn.commit()
        return {"message": "Package saved successfully"}

    except Exception as e:
        print("PACKAGE SAVE ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/packages/{package_id}")
def update_package(package_id: int, p: Package):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE packages
        SET package_name=%s, destination_id=%s, duration_days=%s,
            price=%s, category=%s, activities=%s
        WHERE package_id=%s
        """,
        (
            p.package_name,
            p.destination_id,
            p.duration_days,
            p.price,
            p.category,
            p.activities,
            package_id,
        )
    )

    conn.commit()
    return {"message": "Package updated successfully"}


@app.delete("/packages/{package_id}")
def delete_package(package_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM packages WHERE package_id=%s", (package_id,))
    conn.commit()

    return {"message": "Package deleted successfully"}


# -----------------------------
# Hotel APIs
# -----------------------------
@app.get("/hotels")
def get_hotels():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM hotels")
    data = cursor.fetchall()

    for h in data:
        h["price_per_night_lkr"] = format_lkr(h["price_per_night"])

    return data


@app.post("/hotels")
def add_hotel(h: Hotel):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO hotels
            (hotel_name, destination_id, hotel_type, price_per_night, rating, contact_number)
            VALUES (%s,%s,%s,%s,%s,%s)
            """,
            (
                h.hotel_name,
                h.destination_id,
                h.hotel_type,
                h.price_per_night,
                h.rating,
                h.contact_number,
            )
        )

        conn.commit()
        return {"message": "Hotel saved successfully"}

    except Exception as e:
        print("HOTEL SAVE ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/hotels/{hotel_id}")
def update_hotel(hotel_id: int, h: Hotel):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE hotels
        SET hotel_name=%s, destination_id=%s, hotel_type=%s,
            price_per_night=%s, rating=%s, contact_number=%s
        WHERE hotel_id=%s
        """,
        (
            h.hotel_name,
            h.destination_id,
            h.hotel_type,
            h.price_per_night,
            h.rating,
            h.contact_number,
            hotel_id,
        )
    )

    conn.commit()
    return {"message": "Hotel updated successfully"}


@app.delete("/hotels/{hotel_id}")
def delete_hotel(hotel_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM hotels WHERE hotel_id=%s", (hotel_id,))
    conn.commit()

    return {"message": "Hotel deleted successfully"}


# -----------------------------
# Transport APIs
# -----------------------------
@app.get("/transport")
def get_transport():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM transport")
    data = cursor.fetchall()

    for t in data:
        t["estimated_cost_lkr"] = format_lkr(t["estimated_cost"])

    return data


@app.post("/transport")
def add_transport(t: Transport):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO transport
            (from_location, to_location, transport_type, estimated_time, estimated_cost, notes)
            VALUES (%s,%s,%s,%s,%s,%s)
            """,
            (
                t.from_location,
                t.to_location,
                t.transport_type,
                t.estimated_time,
                t.estimated_cost,
                t.notes,
            )
        )

        conn.commit()
        return {"message": "Transport saved successfully"}

    except Exception as e:
        print("TRANSPORT SAVE ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/transport/{transport_id}")
def update_transport(transport_id: int, t: Transport):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE transport
        SET from_location=%s, to_location=%s, transport_type=%s,
            estimated_time=%s, estimated_cost=%s, notes=%s
        WHERE transport_id=%s
        """,
        (
            t.from_location,
            t.to_location,
            t.transport_type,
            t.estimated_time,
            t.estimated_cost,
            t.notes,
            transport_id,
        )
    )

    conn.commit()
    return {"message": "Transport updated successfully"}


@app.delete("/transport/{transport_id}")
def delete_transport(transport_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM transport WHERE transport_id=%s", (transport_id,))
    conn.commit()

    return {"message": "Transport deleted successfully"}


# -----------------------------
# Destination API
# -----------------------------
@app.get("/destinations")
def get_destinations():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM destinations")
    return cursor.fetchall()


# -----------------------------
# FAQ APIs
# -----------------------------
@app.post("/faqs")
def add_faq(f: FAQ):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO faqs
        (question, answer, category)
        VALUES (%s,%s,%s)
        """,
        (f.question, f.answer, f.category)
    )

    conn.commit()
    return {"message": "FAQ saved successfully"}


# -----------------------------
# Unknown Questions APIs
# -----------------------------
@app.get("/unknown")
def get_unknown():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM unknown_questions ORDER BY created_at DESC")
    return cursor.fetchall()


@app.post("/unknown/add-answer")
def add_unknown_answer(data: UnknownAnswer):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO faqs
        (question, answer, category)
        VALUES (%s,%s,%s)
        """,
        (data.question, data.answer, "Admin Learned")
    )

    cursor.execute(
        """
        UPDATE unknown_questions
        SET status='Answered'
        WHERE question=%s
        """,
        (data.question,)
    )

    conn.commit()
    return {"message": "Answer added to FAQ successfully"}


@app.delete("/unknown/{unknown_id}")
def delete_unknown(unknown_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM unknown_questions WHERE unknown_id=%s", (unknown_id,))
    conn.commit()

    return {"message": "Unknown question removed successfully"}


# -----------------------------
# Chat History API
# -----------------------------
@app.get("/history")
def get_history():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM chat_history ORDER BY created_at DESC")
    return cursor.fetchall()


# -----------------------------
# Chatbot API
# -----------------------------
@app.post("/chat")
def chat(request: ChatRequest):
    user_message = request.message
    emotion = detect_emotion(user_message)
    suggested_place = get_emotion_destination(emotion)

    cleaned_msg = re.sub(r"[^a-z0-9\s]", "", user_message.lower()).strip()

    conn = get_connection()
    cursor = conn.cursor(buffered=True)

    save_emotion_log(cursor, conn, 1, user_message, emotion, suggested_place)

    quick_replies = {
        "best place": "🏯 Best places in Sri Lanka:\n• Kandy\n• Ella\n• Sigiriya\n• Mirissa\n• Nuwara Eliya",
        "beach": "🏖️ Best beaches in Sri Lanka:\n• Mirissa\n• Unawatuna\n• Arugam Bay\n• Nilaveli\n• Pasikuda",
        "adventure": "🧗 Adventure places:\n• Ella hiking\n• Kitulgala rafting\n• Yala safari\n• Arugam Bay surfing",
        "cheap travel": "💰 Budget travel options:\n• Bus/train: LKR 100–1,500\n• Guesthouses: LKR 2,000–6,000 per night\n• Budget places: Kandy, Ella, Anuradhapura",
        "family trip": "👨‍👩‍👧 Family trip places:\n• Kandy\n• Nuwara Eliya\n• Bentota\n• Sigiriya\n• Colombo city tour",
        "transport": "🚌 Transport options:\n• Bus: cheapest\n• Train: scenic\n• Tuk-tuk: short trips\n• Taxi: comfortable",
        "trip plan": "🗓️ Simple trip plan:\n• Morning: sightseeing\n• Afternoon: activity\n• Evening: beach, sunset, or local food"
    }

    if cleaned_msg in quick_replies:
        bot_reply = quick_replies[cleaned_msg]
        save_chat_history(cursor, conn, user_message, bot_reply, emotion)
        return {"response": bot_reply}

    cursor.execute(
        "SELECT answer FROM faqs WHERE LOWER(question) LIKE %s",
        ("%" + cleaned_msg + "%",)
    )

    faq_result = cursor.fetchone()

    if faq_result:
        bot_reply = faq_result[0]
        save_chat_history(cursor, conn, user_message, bot_reply, emotion)
        return {"response": bot_reply}

    try:
        prompt = f"""
You are VoyantraAI, an AI travel and tourism virtual assistant.

Rules:
- Only answer travel and tourism related questions.
- Focus mainly on Sri Lanka tourism.
- Always show budgets and prices in Sri Lankan Rupees.
- Use this money format: LKR 5,000.
- Give clear, short, well-spaced answers.
- Use headings and bullet points.
- Do not write very long paragraphs.
- Do not mention detected emotion.
- Do not mention suggested destination directly.
- Give recommendations naturally based on the user's mood.

User mood: {emotion}
Recommended travel style/location: {suggested_place}

Mood guidance:
- Happy: suggest fun or adventure activities.
- Sad: suggest peaceful nature, calm beaches, and relaxing trips.
- Relaxing: suggest calm beaches, nature, wellness, and slow travel.
- Angry: suggest nature escape, hiking, adventure, beach walking, or peaceful places.
- Concerned: include simple travel safety tips.
- Budget-conscious: suggest low-cost options in LKR.
- Neutral: answer normally.

If unrelated, reply exactly:
"Sorry 😔 I only answer travel and tourism questions."

User question:
{user_message}
"""

        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt
        )

        bot_reply = response.text if response and response.text else (
            "Here are some Sri Lanka travel ideas:\n\n"
            "• Adventure: Kitulgala rafting, Ella hiking\n"
            "• Relaxing: Tangalle beach, Nuwara Eliya gardens\n"
            "• Budget: Anuradhapura, Kandy, Ella\n"
            "• Estimated budget: LKR 3,000–10,000 per day"
        )

        save_chat_history(cursor, conn, user_message, bot_reply, emotion)
        return {"response": bot_reply}

    except Exception as e:
        print("GEMINI ERROR:", repr(e))

        fallback_reply = (
            "Here are some Sri Lanka travel ideas:\n\n"
            "• Adventure: Kitulgala rafting, Ella hiking\n"
            "• Relaxing: Tangalle beach, Nuwara Eliya gardens\n"
            "• Budget: Anuradhapura, Kandy, Ella\n"
            "• Estimated budget: LKR 3,000–10,000 per day"
        )

        save_chat_history(cursor, conn, user_message, fallback_reply, emotion)
        return {"response": fallback_reply}