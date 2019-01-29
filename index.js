const { join } = require("path");

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", socket => {
  console.log(`Client ${socket.id} has just connected!`);
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} has disconnected!`);
  });
  socket.on("spawn", position => {
    console.log(`Client ${socket.id} spawned at ${position}!`);
    io.emit("spawn", position);
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});

// client side
// socket.emit('test', (foo) => { console.log(foo)});
socket.emit("evt").then(data => console.log(data));

// Server side
io.on("test", () => {
  return "foobar";
});
