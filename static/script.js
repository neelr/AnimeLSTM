const s = new music21.stream.Stream();
var offset = 0
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
        let metronome = new music21.tempo.Metronome(Number(/-(.*)-/g.exec(pattern)[1]))
        lastMetronome = metronome
        output_notes.push(metronome)
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
    console.log(decodeOutput[d])
})
document.getElementById("hi").onclick = () => {
    run(true)
}


run = (v) => {
    s.elements = []
    output_notes.map(v => {
        console.log(v)
        console.log("YYYEEEEEEEEEE")
        if (v) {
            s.append(v)
        }
    })
    output_notes = [lastKey, lastMetronome, lastTime]
    if (v) {
        s.playStream({
            done: () => run(true)
        })
    } else {
        s.stopPlatStream()
    }
}