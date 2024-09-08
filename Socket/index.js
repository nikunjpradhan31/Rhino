const {Server} = require("socket.io");

const io = new Server({cors: "http://localhost:5173"});
//const io = new Server({cors: "https://b5wj73nk-5173.use2.devtunnels.ms/"});


let onlineUsers = [];

io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("addNewUser", (userId)=>{
        if(!userId)
            return;
        !onlineUsers.some((user) =>user.userId === userId) &&
        onlineUsers.push({
            userId,
            socketId: socket.id
        });
    console.log(onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
});

    socket.on("sendMessage", (message)=>{
       // const users = onlineUsers.map(user => user.userId).filter(userId => new Set(message.OtherUserId).has(userId));
       //const users = message?.otherUserId.filter(item => onlineUsers.some(user => user.userId === item));
       const users = onlineUsers.filter(user => message?.otherUserId.some(item => user.userId === item));


        if (users && users.length > 0) {
            users.forEach(user => {
                io.to(user.socketId).emit("getMessage", message);
                io.to(user.socketId).emit("getNotification", {
                    chatId: message.chatId,
                    date: new Date(),
                });

            });
        }
    });


    socket.on("disconnect", ()=>{
        onlineUsers = onlineUsers.filter((user)=>user.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUsers);
    });
});

io.listen(3000);
