export const chatService=(socket)=>{
	socket.on("username",(name)=>{
		io.emit("broad",[name])
	});
	
	socket.emit("message","init message")
}