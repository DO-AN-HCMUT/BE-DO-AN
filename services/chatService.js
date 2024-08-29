export const getChat = (req, res, next) => {
	const id = req.params.id
	return res.json(id)
}
export const chatService = (socket) => {
	socket.on("username", (name) => {
		io.emit("broad", [name])
	});
	socket.emit("message", "init message")
}