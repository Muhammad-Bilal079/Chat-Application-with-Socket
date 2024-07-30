import React, { useState } from 'react'

function Chat({ socket, username, room }) {
    const [currentmessage, setCurrentmessage] = useState('')
    const [messageList, setMessageList] = useState([])

    const sendMessage = async () => {
        if (currentmessage !== "") {
            const messageData = {
                id: Math.random(),
                room: room,
                author: username,
                message: currentmessage,
                time:
                    (new Date(Date.now()).getHours() % 12) +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentmessage("");
            // notification.play();
        }
    }


    return (
        <>
            <div className="chat_container">

                <h1>Welcome {username}</h1>

                <div className="chat_box">
                    {
                        messageList.map((data) => {
                            <div key={data.id} className="message_content">
                                <div>

                                    <div className="msg">
                                        <p>{data.message}</p>
                                    </div>
                                    <div className="msg_detail">
                                        <p>{data.author}</p>
                                        <p>{data.time}</p>
                                    </div>

                                </div>
                            </div>
                        })
                    }
                    <div className="chat_body">
                        <input
                            type="text"
                            placeholder='Type your message!'
                            value={currentmessage}
                            onChange={(e) => setCurrentmessage(e.target.value)}
                        />

                        <button onClick={sendMessage}>&#9658;</button>
                    </div>

                </div>
            </div>

        </>
    )
}

export default Chat