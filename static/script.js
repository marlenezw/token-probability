// Sample data structure based on your notebook output
let currentTokenProbs = [];

// Sample response data - replace this with actual API call
const sampleResponse = {
    text: "conference hall where all the amazing talks are happening today!",
    tokenProbs: [
        {
            "selected_token": "conference",
            "selected_prob": 0.85,
            "top_logprobs": [
                {"token": "conference", "probability": 0.85},
                {"token": "main", "probability": 0.08},
                {"token": "exhibition", "probability": 0.04},
                {"token": "speaker", "probability": 0.02},
                {"token": "keynote", "probability": 0.01}
            ]
        },
        {
            "selected_token": " hall",
            "selected_prob": 0.72,
            "top_logprobs": [
                {"token": " hall", "probability": 0.72},
                {"token": " room", "probability": 0.15},
                {"token": " center", "probability": 0.08},
                {"token": " venue", "probability": 0.03},
                {"token": " auditorium", "probability": 0.02}
            ]
        },
        {
            "selected_token": " where",
            "selected_prob": 0.91,
            "top_logprobs": [
                {"token": " where", "probability": 0.91},
                {"token": " to", "probability": 0.04},
                {"token": " and", "probability": 0.03},
                {"token": " for", "probability": 0.01},
                {"token": " with", "probability": 0.01}
            ]
        },
        {
            "selected_token": " all",
            "selected_prob": 0.67,
            "top_logprobs": [
                {"token": " all", "probability": 0.67},
                {"token": " the", "probability": 0.18},
                {"token": " we", "probability": 0.08},
                {"token": " everyone", "probability": 0.04},
                {"token": " people", "probability": 0.03}
            ]
        },
        {
            "selected_token": " the",
            "selected_prob": 0.94,
            "top_logprobs": [
                {"token": " the", "probability": 0.94},
                {"token": " those", "probability": 0.03},
                {"token": " our", "probability": 0.02},
                {"token": " these", "probability": 0.01},
                {"token": " my", "probability": 0.001}
            ]
        },
        {
            "selected_token": " amazing",
            "selected_prob": 0.56,
            "top_logprobs": [
                {"token": " amazing", "probability": 0.56},
                {"token": " great", "probability": 0.22},
                {"token": " wonderful", "probability": 0.12},
                {"token": " exciting", "probability": 0.06},
                {"token": " fantastic", "probability": 0.04}
            ]
        },
        {
            "selected_token": " talks",
            "selected_prob": 0.89,
            "top_logprobs": [
                {"token": " talks", "probability": 0.89},
                {"token": " presentations", "probability": 0.06},
                {"token": " sessions", "probability": 0.03},
                {"token": " speakers", "probability": 0.01},
                {"token": " workshops", "probability": 0.01}
            ]
        },
        {
            "selected_token": " are",
            "selected_prob": 0.78,
            "top_logprobs": [
                {"token": " are", "probability": 0.78},
                {"token": " will", "probability": 0.12},
                {"token": " have", "probability": 0.06},
                {"token": " take", "probability": 0.03},
                {"token": " begin", "probability": 0.01}
            ]
        },
        {
            "selected_token": " happening",
            "selected_prob": 0.82,
            "top_logprobs": [
                {"token": " happening", "probability": 0.82},
                {"token": " taking", "probability": 0.09},
                {"token": " being", "probability": 0.05},
                {"token": " scheduled", "probability": 0.03},
                {"token": " occurring", "probability": 0.01}
            ]
        },
        {
            "selected_token": " today",
            "selected_prob": 0.71,
            "top_logprobs": [
                {"token": " today", "probability": 0.71},
                {"token": " now", "probability": 0.15},
                {"token": " right", "probability": 0.08},
                {"token": " this", "probability": 0.04},
                {"token": " currently", "probability": 0.02}
            ]
        },
        {
            "selected_token": "!",
            "selected_prob": 0.93,
            "top_logprobs": [
                {"token": "!", "probability": 0.93},
                {"token": ".", "probability": 0.05},
                {"token": ",", "probability": 0.01},
                {"token": " and", "probability": 0.005},
                {"token": " -", "probability": 0.005}
            ]
        }
    ]
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayResponse(sampleResponse.text, sampleResponse.tokenProbs);
});

function displayResponse(text, tokenProbs) {
    currentTokenProbs = tokenProbs;
    const responseElement = document.getElementById('response-text');
    responseElement.innerHTML = '';
    
    tokenProbs.forEach((tokenData, index) => {
        const span = document.createElement('span');
        span.className = 'token';
        span.textContent = tokenData.selected_token;
        span.dataset.tokenIndex = index;
        
        // Add probability-based class
        const probClass = getProbabilityClass(tokenData.selected_prob);
        span.classList.add(probClass);
        
        // Add event listeners for hover
        span.addEventListener('mouseenter', showTooltip);
        span.addEventListener('mouseleave', hideTooltip);
        span.addEventListener('mousemove', updateTooltipPosition);
        
        responseElement.appendChild(span);
    });
}

function getProbabilityClass(probability) {
    if (probability >= 0.8) return 'prob-very-high';
    if (probability >= 0.6) return 'prob-high';
    if (probability >= 0.4) return 'prob-medium';
    if (probability >= 0.2) return 'prob-low';
    return 'prob-very-low';
}

function showTooltip(event) {
    const tokenIndex = parseInt(event.target.dataset.tokenIndex);
    const tokenData = currentTokenProbs[tokenIndex];
    const tooltip = document.getElementById('tooltip');
    const tooltipBody = document.getElementById('tooltip-body');
    
    // Clear previous content
    tooltipBody.innerHTML = '';
    
    // Add probability items
    tokenData.top_logprobs.forEach((item, index) => {
        const probItem = document.createElement('div');
        probItem.className = 'prob-item';
        
        const tokenSpan = document.createElement('span');
        tokenSpan.className = 'prob-token';
        if (item.token === tokenData.selected_token) {
            tokenSpan.classList.add('selected-token');
        }
        tokenSpan.textContent = `"${item.token}"`;
        
        const probSpan = document.createElement('span');
        probSpan.className = 'prob-value';
        probSpan.textContent = `${(item.probability * 100).toFixed(1)}%`;
        
        probItem.appendChild(tokenSpan);
        probItem.appendChild(probSpan);
        tooltipBody.appendChild(probItem);
    });
    
    tooltip.style.display = 'block';
    updateTooltipPosition(event);
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
}

function updateTooltipPosition(event) {
    const tooltip = document.getElementById('tooltip');
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = event.pageX + 10;
    let top = event.pageY - 10;
    
    // Adjust if tooltip would go off screen
    if (left + tooltipRect.width > viewportWidth) {
        left = event.pageX - tooltipRect.width - 10;
    }
    
    if (top + tooltipRect.height > viewportHeight) {
        top = event.pageY - tooltipRect.height - 10;
    }
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

// Mock function to simulate API call
async function generateResponse() {
    const promptInput = document.getElementById('prompt-input');
    const endpointInput = document.getElementById('endpoint-input');
    const apiKeyInput = document.getElementById('api-key-input');
    const generateBtn = document.getElementById('generate-btn');
    const responseElement = document.getElementById('response-text');
    
    const prompt = promptInput.value.trim();
    const endpoint = endpointInput.value.trim();
    const apiKey = apiKeyInput.value.trim();
    
    if (!prompt) {
        alert('Please enter a prompt');
        return;
    }
    
    if (!endpoint) {
        alert('Please enter your Azure OpenAI endpoint');
        return;
    }
    
    if (!apiKey) {
        alert('Please enter your API key');
        return;
    }
    
    // Update UI for loading state
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span class="loading"></span> Generating...';
    responseElement.innerHTML = 'Generating response...';
    
    // Add user message to chat
    const chatContainer = document.querySelector('.chat-container');
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `
        <div class="message-content">
            <span class="prompt-text">${prompt}</span>
        </div>
    `;
    
    // Remove existing user message if any
    const existingUserMessage = chatContainer.querySelector('.user-message');
    if (existingUserMessage) {
        existingUserMessage.remove();
    }
    
    chatContainer.insertBefore(userMessage, chatContainer.firstChild);
    
    try {
        // Call the backend with the user-provided endpoint and API key
        const response = await makeApiCall(prompt, endpoint, apiKey);
        
        displayResponse(response.text, response.tokenProbs);
        
    } catch (error) {
        responseElement.textContent = 'Error generating response. Please check your endpoint and API key.';
        console.error('Error:', error);
    } finally {
        // Reset button state
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate';
    }
}

// API call function with user-provided endpoint and API key
async function makeApiCall(prompt, endpoint, apiKey) {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                endpoint: endpoint,
                api_key: apiKey,
                top_k: 5,
                temperature: 0.0
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Allow Enter key to submit (Shift+Enter for new line)
document.getElementById('prompt-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        generateResponse();
    }
});
