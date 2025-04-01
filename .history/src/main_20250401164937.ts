import { CallPeer } from './peerjs.ts';
import './style.css';

let service = new CallPeer();
let app =document.querySelector<HTMLDivElement>('#app')!


let localVideo          = document.createElement('video')
    localVideo.autoplay = true
    localVideo.muted    = true
app.appendChild(localVideo)

let remoteVideo = document.createElement('video')
remoteVideo.autoplay = true
app.appendChild(remoteVideo)

let callButton = document.createElement('button')
callButton.innerText = 'Call'
callButton.onclick = async () => {  
    console.log('Call button clicked');
    
    service.StartCall(peerIdInput2.value, () => {
        alert('Call not Connected');
    })
    console.log('Calling peer:', peerIdInput2.value);
}

let hangupButton = document.createElement('button')
hangupButton.innerText = 'Hangup'
hangupButton.onclick = async () => {  
    console.log('Hangup button clicked');
    service.HangUp();
}

let answerButton = document.createElement('button')
answerButton.innerText = 'Answer'
answerButton.onclick = async () => {  
    console.log('Answer button clicked');
    service.Answer();
}

let startSessionButton = document.createElement('button')
startSessionButton.innerText = 'Start Session'
startSessionButton.onclick = async () => {
    console.log('Start Session button clicked');
    service.StartListeningWithID(peerIdInput.value)
}
app.appendChild(startSessionButton)

let startStreamButton = document.createElement('button')
startStreamButton.innerText = 'Start Stream'
startStreamButton.onclick = async () => {
    console.log('Start Stream button clicked');
    service.SetVideoElements(localVideo, remoteVideo);
    service.UpdateStreams();
}
app.appendChild(startStreamButton)
app.appendChild(answerButton)

app.appendChild(callButton)
app.appendChild(hangupButton)

let label = document.createElement('label')
label.innerText = 'Peer ID: '
let peerIdInput = document.createElement('input')
peerIdInput.type = 'text'
peerIdInput.placeholder = 'Enter Peer ID'
label.appendChild(peerIdInput)
app.appendChild(label)

let label2 = document.createElement('label')
label2.innerText = 'Peer ID: '
let peerIdInput2 = document.createElement('input')
peerIdInput2.type = 'text'
peerIdInput2.placeholder = 'Enter Peer ID'
label2.appendChild(peerIdInput2)
app.appendChild(label2)


// call logic 


function GenerateRandomPeerId() {
    const randomId = Math.floor(Math.random() * 10000000000000).toString();
    peerIdInput.value = randomId;
    return randomId;
}   

let myPeerId = GenerateRandomPeerId();
peerIdInput.value = myPeerId;
let peerId = peerIdInput.value;
peerIdInput.onchange = () => {
    peerId = peerIdInput.value;
    console.log('Peer ID changed to:', peerId);
}


service.SetOnLlamadaEntrante_Ring(() => {
    // append div 
    const incomingCallDiv = document.createElement('div');
    incomingCallDiv.id = 'incomingCall';
    incomingCallDiv.innerText = 'Incoming Call...';
    app.appendChild(incomingCallDiv);

});

service.SetOnLlamadaEntrante_Answer(() => {
    // remove div 
    const incomingCallDiv = document.getElementById('incomingCall');
    if (incomingCallDiv) {
        incomingCallDiv.remove();
    }
    console.log('Incoming call answered');
});


