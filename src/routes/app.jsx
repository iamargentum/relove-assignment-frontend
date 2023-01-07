import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000")

export function MathApp() {

    const [name, setName] = useState("")
    const [mySid, setMySid] = useState()
    const [answer, setAnswer] = useState()
    const [question, setQuestion] = useState()
    const [winnerName, setWinnerName] = useState()
    const [usersPlaying, setUsersPlaying] = useState([])
    const [isConnected, setIsConnected] = useState(false)
    const [userIsReady, setUserIsReady] = useState(false)
    const [submittedUsers, setSubmittedUsers] = useState([])
    const [nameSubmitted, setNameSubmitted] = useState(false)

    function handleSubmit() {
        socket.emit("submitAnswer", {
            answer: answer,
            time: Date.now()
        })
    }

    useEffect(() => {
        socket.on("connect", () => {
            setMySid(socket.id)
            setIsConnected(true)
            console.log("connected to websocket server");
        })

        socket.on("disconnect", () => {
            setIsConnected(false)
        })

        socket.on("updateUsersList", (data) => {
            setUsersPlaying([...data])
        })

        socket.on("userSubmitted", (user) => {
            setSubmittedUsers(prev => {
                prev.push(user)
                return [...prev]
            })
        })

        socket.on("newQuestion", (q) => {
            setQuestion({...q})
            setSubmittedUsers([])
            console.log("new question received ", q);
        })

        socket.on("winner", (w) => {
            setQuestion(undefined)
            setWinnerName(w.name)
            setUserIsReady(false)
            setUsersPlaying(prev => {
                const temp = prev.map((p, _index) => {
                    p.ready = 0
                    return p
                })
                return [...temp]
            })
        })

        return () => {
            socket.off("connect")
            socket.off("disconnect")
        }
    }, [])

    return (
        <div className="flex flex-col">

            {
                winnerName && (
                    <p>
                        Winner of previous game is {winnerName}
                    </p>
                )
            }

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
                    <div className="flex flex-col">
                        {
                            question !== undefined && usersPlaying.filter(u => u.ready === 1).length === usersPlaying.length && (
                                <div className="flex flex-row">
                                    <p>{question.operands.first} {question.operation} {question.operands.second}</p>
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
                            )
                        }
                        {
                            usersPlaying && usersPlaying.length && (
                                <div>
                                    {
                                        usersPlaying.filter(u => u.sid != mySid).map((user, userIndex) => {
                                            return (
                                                <p key={`user_playing_${userIndex}`} className={"p-2 rounded-md " + user.ready ? "bg-yellow-100" : "bg-green-100"}>
                                                    { user.name }
                                                </p>
                                            )
                                        })
                                    }
                                </div>
                            )
                        }
                    </div>
                    </>
                )
            }
        </div>
    )
}