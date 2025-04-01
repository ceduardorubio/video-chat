
let localStream: MediaStream
let remoteStream: MediaStream

let pc1 = new RTCPeerConnection()
let pc2 = new RTCPeerConnection()

let constraints = {video: true, audio: true}

navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        localStream = stream
        localVideo.srcObject = stream
        stream.getTracks().forEach(track => pc1.addTrack(track, stream))
    }
    )

pc1.onicecandidate = e => {
    if(e.candidate){
        pc2.addIceCandidate(e.candidate)
    }
}

pc2.onicecandidate = e => {
    if(e.candidate){
        pc1.addIceCandidate(e.candidate)
    }
}

pc2.ontrack = e => {
    remoteStream = e.streams[0]
    remoteVideo.srcObject = remoteStream
}

pc1.oniceconnectionstatechange = e => {
    console.log(pc1.iceConnectionState)
}

pc2.oniceconnectionstatechange = e => {
    console.log(pc2.iceConnectionState)
}

pc1.onicegatheringstatechange = e => {
    console.log(pc1.iceGatheringState)
}

pc2.onicegatheringstatechange = e => {
    console.log(pc2.iceGatheringState)
}

pc1.onnegotiationneeded = async e => {
    let offer = await pc1.createOffer()
    await pc1.setLocalDescription(offer)
    await pc2.setRemoteDescription(offer)

    let answer = await pc2.createAnswer()
    await pc2.setLocalDescription(answer)
    await pc1.setRemoteDescription(answer)
}

pc1.onconnectionstatechange = e => {
    console.log(pc1.connectionState)
}

pc2.onconnectionstatechange = e => {
    console.log(pc2.connectionState)
}

pc1.ondatachannel = e => {
    console.log(e)
}

pc2.ondatachannel = e => {
    console.log(e)
}

pc1.onicecandidateerror = e => {
    console.log(e)
}

pc2.onicecandidateerror = e => {
    console.log(e)
}

pc1.oniceconnectionstatechange = e => {
    console.log(pc1.iceConnectionState)
}

pc2.oniceconnectionstatechange = e => {
    console.log(pc2.iceConnectionState)
}

pc1.onicegatheringstatechange = e => {
    console.log(pc1.iceGatheringState)
}

pc2.onicegatheringstatechange = e => {
    console.log(pc2.iceGatheringState)
}

pc1.onnegotiationneeded = async e => {
    let offer = await pc1.createOffer()
    await pc1.setLocalDescription(offer)
    await pc2.setRemoteDescription(offer)

    let answer = await pc2.createAnswer()
    await pc2.setLocalDescription(answer)
    await pc1.setRemoteDescription(answer)
}
