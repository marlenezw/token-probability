from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
import math
from typing import List, Dict
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def get_model_response(prompt: str, endpoint: str, api_key: str, top_k: int = 5, temperature: float = 0.0):
    """
    Returns:
      response_text: str
      token_probs: List[Dict] with per-token:
          {
            "selected_token": str,
            "selected_prob": float,
            "top_logprobs": List[{"token": str, "probability": float}]
          }
    """
    # Create a new client with the provided endpoint and API key
    client = AzureOpenAI(
        api_version="2024-12-01-preview",
        azure_endpoint=endpoint,
        api_key=api_key,
    )
    
    kwargs = dict(
        messages=[{"role": "user", "content": prompt},
                  {"role": "system", "content": "You are a helpful assistant. Complete the users sentence given the context. Only return the completed part of the sentence."}] ,
        temperature=temperature,
        logprobs=True,
        top_logprobs=top_k,
        max_tokens=40  # Limit to 50 tokens
    )

    completion = client.chat.completions.create(
        model="gpt-4o-mini", **kwargs
    )

    choice = completion.choices[0]
    response_text = choice.message.content

    # Per-token logprobs are in choice.logprobs.content (list of items)
    token_probs = []
    for token_info in choice.logprobs.content:
        selected_token = token_info.token
        selected_prob = math.exp(token_info.logprob)  # convert logprob -> prob

        top_items = []
        for lp in token_info.top_logprobs:
            top_items.append({
                "token": lp.token,
                "probability": math.exp(lp.logprob)
            })

        token_probs.append({
            "selected_token": selected_token,
            "selected_prob": selected_prob,
            "top_logprobs": top_items
        })

    return response_text, token_probs

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        endpoint = data.get('endpoint', '')
        api_key = data.get('api_key', '')
        top_k = data.get('top_k', 5)
        temperature = data.get('temperature', 0.0)
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
            
        if not endpoint:
            return jsonify({'error': 'Endpoint is required'}), 400
            
        if not api_key:
            return jsonify({'error': 'API key is required'}), 400
        
        response_text, token_probs = get_model_response(prompt, endpoint, api_key, top_k, temperature)
        
        return jsonify({
            'text': response_text,
            'tokenProbs': token_probs
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
