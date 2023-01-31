import React, { SetStateAction, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.scss'
import { io, Socket } from "socket.io-client";

const socket = io("http://localhost:4000");

export default function App(): JSX.Element {
  // 채팅 페이지 방문
  const [room, setRoom] = useState("");

  const InputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoom(e.target.value);
  }

  // 메세지 정보들
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);;
      alert(`${room} 방에 입장하였습니다.`);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
    alert("메세지를 보냈습니다.")
  };

  useEffect(() => {
    socket.on("receive_message", (data: { message: SetStateAction<string>; }) => {
      setMessageReceived(data.message);
    });
  }, [socket]);

  return (
    <div className="App">
      <div>
        <a href="https://socket.io/" target="_blank">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Socket-io.svg/1024px-Socket-io.svg.png" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Socket.io + React</h1>
      <div className="card">
        <div>
          <input
            placeholder="방 제목을 입력하세요"
            onChange={InputChange}
          />
          <button onClick={joinRoom}> Join Room</button>
        </div>
        <div>
          <input
            placeholder="메세지를 입력해주세요."
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button onClick={sendMessage}> Send Message</button>
        </div>
        <h2>{room} 메세지:</h2>
        {messageReceived}
      </div>
    </div>
  )
}
