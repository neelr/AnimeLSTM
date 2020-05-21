import React from "react"
import io from "socket.io-client"

export default class extends React.Component {
    render() {
        return (
            <h1>hi</h1>
        )
    }
    componentDidMount() {
        let socket = io()

        socket.on("connect", () => {
            socket.on("note", d => {
                console.log(d)
            })
        })
    }
}