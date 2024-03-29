const socket = io()


if (!localStorage.getItem('user')) {
    const user = prompt('¡Coloca tu email para continuar!')
    localStorage.setItem('user', user)
}

const chat = document.getElementById('chat-messages')
const inputMessage = document.getElementById('input-message')
const btnEnviar = document.getElementById('btn-enviar')

btnEnviar.addEventListener('click', async () => {
    const message = {
        user: localStorage.getItem('user'),
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