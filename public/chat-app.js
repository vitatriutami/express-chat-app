const socket = io({transports: ["websocket"]})

const chatBox = document.getElementById("chat-box")
const chatForm = document.getElementById("chat-form")
const chatMessages = document.getElementById("chat-messages")
const chatInput = document.querySelector("#chat-form>textarea")
const modal = new bootstrap.Modal(document.querySelector(".modal"))
const username = document.getElementById("username")
const saveUsername = document.getElementById("save-username")

// send message to socket io
chatForm.addEventListener("submit", (e) => {
    e.preventDefault()
    if (chatInput.value !== "") {
        socket.emit("send.chat", chatInput.value)
        chatInput.value = ""
    }
})

function loadChat(data) {
    let position = data.sender ? "float-end" : ""
    let color = data.sender ? "bg-primary" : "bg-secondary"
    chatMessages.innerHTML += `
        <div class="card d-inline-block mt-3 ${color} text-white ${position}">
        <div class="card-body">
            <h5 class="card-title">${data.username}</h5>
            <p class="card-text">${data.text}</p>
            <h6 class="card-subtitle mt-2 text-light">${data.date}</h6>
        </div>
    </div>
    <div class="clearfix"></div>
    `
    srollToBottom()
}

socket.on("chat.receive", data => {
    loadChat(data)
})
socket.on("chat.sent", data => {
    data.sender = true
    loadChat(data)
})

socket.on("connect", () => {
    modal.show()
})

saveUsername.addEventListener("click", e => {
    if (username.value !== "") {
        socket.emit("register", username.value)
        modal.hide()
    }
})

function srollToBottom() {
    chatBox.scrollTo(0, chatBox.scrollHeight)
}