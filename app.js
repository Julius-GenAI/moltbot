const express = require("express");
const axios = require("axios");

const app = express(); // 👈 primero crear app

app.use(express.json());

const PORT = process.env.PORT || 3000;

// UI básica
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

// endpoint del bot
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error en el bot" });
  }
});

// levantar server
app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
