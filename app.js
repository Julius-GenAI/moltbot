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
