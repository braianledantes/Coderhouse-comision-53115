const socket = io()

const chat = document.getElementById('chat-messages')
const form = document.getElementById('chat-form')
const inputMessage = document.getElementById('input-message')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    if (inputMessage.value) {
        const message = {
            message: inputMessage.value
        }

        await fetch('/api/chat', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
        })

        inputMessage.value = ''
    }
})

socket.on('new-message', data => {

    // crea un elemento mensaje y lo agrega al chat
    const article = document.createElement('article')
    article.className = 'message'

    const p1 = document.createElement('p')
    p1.className = 'message-user'

    const s1 = document.createElement('strong')
    s1.textContent = data.message.user
    p1.appendChild(s1)

    const p2 = document.createElement('p')
    p2.className = 'message-content'
    p2.textContent = data.message.message

    article.appendChild(p1)
    article.appendChild(p2)

    chat.appendChild(article)

    // ir al fondo del chat
    chat.scrollTo(0, chat.scrollHeight)
})

// ir al fondo del chat
chat.scrollTo(0, chat.scrollHeight)