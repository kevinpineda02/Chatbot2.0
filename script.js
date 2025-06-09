// Referencia a elementos HTML
const promptInput = document.querySelector("#prompt");
const chatContainer = document.querySelector(".chat-container");
const submitBtn = document.querySelector("#submit");
const closeBtn = document.querySelector(".close-chat");

// Usuario
let user = {
    data: null
};

// Función para crear cajas de chat
function createChatBox(html, classes) {
    const div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

// Función para generar respuesta desde el backend
async function generateResponse(iaChatBox, userMessage) {
    try {
        const promptFinal = `${userMessage}`;

        const response = await fetch("http://localhost:8000/api/mistral", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: promptFinal })
        });

        const data = await response.json();
        const aiText = data.response || "Error al procesar la respuesta.";
        const formattedText = aiText.replace(/\n/g, "<br>");
    
        iaChatBox.querySelector(".ai-chat-area").innerHTML = formattedText;
    } catch (error) {
        console.error("Error en la respuesta de la IA:", error);
        iaChatBox.querySelector(".ai-chat-area").textContent = "Ocurrió un error al conectar con el servidor.";
    }
}

// Función para manejar el envío del mensaje del usuario
function handleChatResponse(message) {
    user.data = message;
    const userHtml = `
        <img src="imagenes/user.png" alt="" id="UserImagen" width="50">
        <div class="user-chat-area">${user.data}</div>`;

    promptInput.value = "";
    const userBox = createChatBox(userHtml, "user-chat-box");
    userBox.style.display = "block";
    chatContainer.appendChild(userBox);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    setTimeout(() => {
        const aiHtml = `
            <img src="imagenes/ia.png" alt="" id="AiImagen" width="50">
            <div class="ai-chat-area">
                <img src="imagenes/load.gif" alt="Cargando" class="load" width="40">
            </div>`;

        const iaBox = createChatBox(aiHtml, "ai-chat-box");
        chatContainer.appendChild(iaBox);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        generateResponse(iaBox, message);
    }, 800);
}

// Eventos
promptInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && promptInput.value.trim()) {
        handleChatResponse(promptInput.value.trim());
    }
});

submitBtn.addEventListener("click", () => {
    if (promptInput.value.trim()) {
        handleChatResponse(promptInput.value.trim());
    }
});

closeBtn.addEventListener("click", () => {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.replace("/");
});
