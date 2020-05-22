import React from "react"
import decode from "../static/decodeOutput"

export default class extends React.Component {
    render() {
        return (
            <div>
                <button id="hi">hihihi</button>
                <script src="/static/decodeOutput.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"></script>
                <script src="/static/music21j/releases/music21.debug.js" ></script>
                <script src="/static/script.js"></script>
            </div>
        )
    }
}