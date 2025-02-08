document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      const userInput = this.value;
      this.value = '';
      addMessage('user', userInput);
      getBotResponse(userInput);
    }
  });
  
  function addMessage(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  async function getBotResponse(userInput) {
    // Replace with your API call to the chatbot backend
    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput })
    });
    const data = await response.json();
    addMessage('bot', data.reply);
  }