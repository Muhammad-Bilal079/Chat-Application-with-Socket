import React, { useState, useEffect, useRef } from 'react';
import music from './iphone-sms-tone-original-mp4-5732.mp3'


function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    // Join the room on component mount
    useEffect(() => {
        socket.emit('join_room', room);  // Join the room

        const handleReceiveMsg = (data) => {
            setMessageList((list) => [...list, data]);  // Add message only on receiving
        };

        socket.on('receive_message', handleReceiveMsg);

        return () => {
            socket.off('receive_message', handleReceiveMsg);
        };
    }, [socket, room]);  // Include 'room' in dependencies

    const containRef = useRef(null)
    useEffect(() => {
        containRef.current.scrollTop = containRef.current.scrolltHeight
    }, [messageList])

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                id: Date.now(),  // Use timestamp for unique ID
                room: room,
                author: username,
                message: currentMessage,
                time: `${new Date(Date.now()).getHours() % 12}:${new Date(Date.now()).getMinutes()}`,
            };

            await socket.emit('send_message', messageData);
            // Remove manual message addition to list
            setCurrentMessage('');

            const notification = new Audio(music);
            notification.play();  // Uncomment to play notification sound
        }
    };

    return (
        <>
            <div className="chat_container">
                <h1>Welcome {username}</h1>

                <div className="chat_box">
                    <div className="auto-scrolling-div"
                        ref={containRef}
                        style={{
                            height: '450px',
                            overflowY: 'auto',
                            border: '2px solid yellow'
                        }}>


                        {
                            messageList.map((data) => (
                                <div key={data.id} className="message_content"
                                    id={username == data.author ? "You" : "other"}
                                >
                                    <div>
                                        <div className="msg"
                                            id={username == data.author ? "y" : "b"} //is line say meray apnay messages yellow  dekahingay
                                        >
                                            <p>{data.message}</p>
                                        </div>
                                        <div className="msg_detail">
                                            <p>{data.author}</p>
                                            <p>{data.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                    <div className="chat_body">
                        <input
                            type="text"
                            placeholder='Type your message!'
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={(e) => {
                                e.key === "Enter" && sendMessage();
                            }}
                        />

                        <button onClick={sendMessage}>&#9658;</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Chat;

