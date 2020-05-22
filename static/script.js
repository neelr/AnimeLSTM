const s = new music21.stream.Stream();
var steps = 0
var offset = 0
var running = false
var output_notes = []
var lastTime, lastMetronome, lastKey
let socket = io()
socket.on("note", d => {
    console.log(output_notes)
    let pattern = decodeOutput[d]
    if ((pattern.includes(".") || !isNaN(pattern)) && !pattern.includes("metronome")) {
        let notes_in_chord = pattern.split('.')
        let notes = []
        notes_in_chord.map(current_note => {
            new_note = new music21.note.Note(Number(current_note))
            notes.push(new_note)
        })
        let new_chord = new music21.chord.Chord(notes)
        new_chord.offset = offset
        output_notes.push(new_chord)
    } else if (pattern == "rest") {
        let new_note = new music21.note.Rest()
        new_note.offset = offset
        output_notes.push(new_note)
    } else if (pattern.includes("key")) {
        let key = new music21.key.Key(/-(.*) m/g.exec(pattern)[1])
        lastKey = key
        output_notes.push(key)
    } else if (pattern.includes("metronome")) {
        lastMetronome = Number(/-(.*)-/g.exec(pattern)[1])
        if (running) {
            s.stopPlayStream()
            s.playStream({
                tempo: lastMetronome, done: () => {
                    running = false
                    steps += 1
                    if (steps < 3) {
                        run(true)
                    }
                }
            })
        }
    } else if (pattern.includes("timesig")) {
        let timesig = new music21.meter.TimeSignature(/-(.*)/g.exec(pattern)[1])
        lastTime = timesig
        output_notes.push(timesig)
    } else {
        let new_note = new music21.note.Note(pattern)
        new_note.offset = offset
        output_notes.push(new_note)
    }
    offset += 0.5
    console.log(offset)
    if (steps > 99 && !running) {
        steps = 0
        run(true)
    }
})
document.getElementById("hi").onclick = () => {
    running = true
    run(true)
}
document.getElementById("stop").onclick = () => {
    running = false
    run(false)
}
run = (v) => {
    s.elements = []
    output_notes.map(v => {
        if (v) {
            s.append(v)
        }
    })
    output_notes = [lastKey, lastTime]
    if (v) {
        steps = 0
        offset = 0
        s.playStream({
            done: () => {
                running = false
                steps += 1
                if (steps < 100) {
                    run(true)
                }
            },
            tempo: lastMetronome ? lastMetronome : s.tempo
        })
    } else {
        s.stopPlayStream()
    }
}