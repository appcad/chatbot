class Chatbot {
    constructor(chatflowid, apiHost) {
        this.chatflowid = chatflowid;
        this.apiHost = apiHost;
        this.chatbox = this.createChatBox();
        this.attachChatBoxToBody();
    }

    createChatBox() {
        const chatbox = document.createElement('div');
        chatbox.style.width = '300px';
        chatbox.style.height = '400px';
        chatbox.style.position = 'fixed';
        chatbox.style.bottom = '0';
        chatbox.style.right = '0';
        chatbox.style.backgroundColor = 'white';
        chatbox.style.border = '1px solid black';
        chatbox.style.padding = '10px';
        chatbox.style.overflowY = 'scroll';

        return chatbox;
    }

    attachChatBoxToBody() {
        document.body.appendChild(this.chatbox);
    }

    async sendRequest(message) {
        const response = await fetch(`${this.apiHost}/api/v1/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chatflowid: this.chatflowid,
                message: message,
            }),
        });

        const data = await response.json();
        return data;
    }

    showMessage(message) {
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        this.chatbox.appendChild(messageElement);
    }

    listenToUserInput() {
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.placeholder = 'Type your message...';

        inputElement.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.showMessage(`You: ${event.target.value}`);
                this.sendRequest(event.target.value)
                    .then((response) => {
                        this.showMessage(`Bot: ${response.message}`);
                    });
                event.target.value = '';
            }
        });

        this.chatbox.appendChild(inputElement);
    }

    init() {
        this.listenToUserInput();
    }
}

export default Chatbot;
