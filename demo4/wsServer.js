var ws = require("nodejs-websocket")

var PORT = 3000

var clientCount = 0

// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
	console.log("New connection")
	clientCount++
	conn.nickname = `user${clientCount}`
	var msg = {}
	msg.type = 'enter'
	msg.data = `${conn.nickname} come in`
	msg = JSON.stringify(msg)
	broadcast(msg)

	conn.on("text", function (str) {
		console.log("Received " + str)
		// conn.sendText(str.toUpperCase() + "!!!")
		str = str.toUpperCase() + "!!!"
		var msg = {}
		msg.type = 'message'
		msg.data = `${conn.nickname}: ${str}`
		msg = JSON.stringify(msg)
		broadcast(msg)
	})
	conn.on("close", function (code, reason) {
		console.log("Connection closed")
		var msg = {}
		msg.type = 'leave'
		msg.data = `${conn.nickname} left`
		msg = JSON.stringify(msg)
		broadcast(msg)
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