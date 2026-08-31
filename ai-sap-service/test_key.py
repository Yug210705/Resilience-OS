import os
from dotenv import load_dotenv
from openai import OpenAI

# Load .env file
load_dotenv()

key = os.getenv("OPENROUTER_API_KEY")
print(f"Key loaded: {key[:20]}..." if key else "KEY NOT LOADED — check .env")

if key:
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=key,
    )
    
    try:
        print("Calling OpenRouter...")
        resp = client.chat.completions.create(
            model="google/gemma-2-9b-it:free",
            messages=[{"role": "user", "content": "Say hello in 5 words"}],
            max_tokens=50
        )
        print("LLM says:", resp.choices[0].message.content)
    except Exception as e:
        print(f"Error calling LLM: {e}")
