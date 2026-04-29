const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// UI simple
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>Moltbot Chat</h2>
        <input id="msg" placeholder="Escribe..." />
        <button onclick="send()">Enviar</button>
        <pre id="response"></pre>

        <script>
          async function send() {
            const message = document.getElementById("msg").value;

            const res = await fetch("/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message })
            });

            const data = await res.json();
            document.getElementById("response").innerText =
              JSON.stringify(data, null, 2);
          }
        </script>
      </body>
    </html>
  `);
});

// 🔥 ENDPOINT CON GROQ (MODELO FREE ACTUAL)
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant", // ✅ modelo FREE activo
        messages: [
          {
            role: "system",
            content: "Sos un asistente útil, claro y conciso."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // respuesta limpia
    const reply = response.data.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error("Groq error:", error.response?.data || error.message);

    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});

// levantar servidor
app.listen(PORT, () => {
  console.log(`Moltbot corriendo en puerto ${PORT}`);
});
