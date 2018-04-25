var ws = require("nodejs-websocket")

var PORT = 3000

var clientCount = 0

// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
	console.log("New connection")
	clientCount++
	conn.nickname = `user${clientCount}`
	broadcast(`${conn.nickname} come in`)

	conn.on("text", function (str) {
		console.log("Received " + str)
		// conn.sendText(str.toUpperCase() + "!!!")
		str = str.toUpperCase() + "!!!"
		broadcast(`${conn.nickname}: ${str}`)
	})
	conn.on("close", function (code, reason) {
		console.log("Connection closed")
		broadcast(`${conn.nickname} left`)
	})
	conn.on("error", function (err) {
		console.log("handle err")
		console.log(err)
	})
}).listen(PORT)

console.log(`websocket server listening on port ${PORT}`)

function broadcast(str) {
	server.connections.forEach(function (conn) {
		conn.sendText(str)
	})
}