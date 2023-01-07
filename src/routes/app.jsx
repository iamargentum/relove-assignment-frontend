import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000")

export function MathApp() {

    const [name, setName] = useState("")
    const [mySid, setMySid] = useState()
    const [answer, setAnswer] = useState()
    const [question, setQuestion] = useState()
    const [usersPlaying, setUsersPlaying] = useState([])
    const [isConnected, setIsConnected] = useState(false)
    const [userIsReady, setUserIsReady] = useState(false)
    const [submittedUsers, setSubmittedUsers] = useState([])
    const [nameSubmitted, setNameSubmitted] = useState(false)

    function handleSubmit() {
        // make an api call to submit the answer
    }

    useEffect(() => {
        socket.on("connect", () => {
            setIsConnected(true)
            console.log("connected to websocket server");
        })

        socket.on("disconnect", () => {
            setIsConnected(false)
        })

        socket.on("updateUsersList", (data) => {
            console.log("data is ", data);
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

            {
                !nameSubmitted && (
                    <>
                    <p>Please enter your name</p>
                    <input type="text" onChange={(e) => setName(e.target.value)} />
                    <button
                        disabled={!(name && name.length)}
                        onClick={() => {
                            socket.emit("setName", name)
                            setNameSubmitted(true)
                        }}
                    >
                        Submit
                    </button>
                    </>

                )
            }

            {
                nameSubmitted && !userIsReady && (
                    <>
                        <p>Press this button whenever ready</p>
                        <button
                            onClick={() => {
                                socket.emit("ready")
                                setUserIsReady(true)
                            }}
                        >
                            Ready!
                        </button>
                    </>
                )
            }

            {
                nameSubmitted && userIsReady &&(
                    <>
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
                    </>
                )
            }
        </div>
    )
}