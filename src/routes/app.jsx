import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000")

export function MathApp() {

    const [answer, setAnswer] = useState()
    const [question, setQuestion] = useState()
    const [usersPlaying, setUsersPlaying] = useState([])
    const [isConnected, setIsConnected] = useState(false)
    const [submittedUsers, setSubmittedUsers] = useState([])

    function handleSubmit() {
        // make an api call to submit the answer
    }

    useEffect(() => {
        socket.on("connection", client => {
            client.join("mathAppRoom")
        })

        socket.on("connect", () => {
            setIsConnected(true)
            console.log("connected to websocket server");
        })

        socket.on("disconnect", () => {
            setIsConnected(false)
            console.log("disconnected from server");
        })

        socket.on("userJoined", (user) => {
            setUsersPlaying(prev => {
                prev.push(user)
                return [...prev]
            })
        })

        socket.on("userLeft", (user) => {
            setUsersPlaying(prev => {
                const temp = prev.filter(u => u !== user)
                return [...temp]
            })
        })

        socket.on("userSubmitted", (user) => {
            setSubmittedUsers(prev => {
                prev.push(user)
                return [...prev]
            })
        })

        socket.on("newQuestion", (q) => {
            setQuestion(q)
            setSubmittedUsers([])
        })

        return () => {
            socket.off("connect")
            socket.off("disconnect")
        }
    }, [])

    return (
        <div className="flex flex-col">
            <div className="flex flex-row"></div>
            <div className="flex flex-col">
                <input
                    type="number"
                    onChange={(e) => setAnswer(e.target.value)}
                />
                <button
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    )
}