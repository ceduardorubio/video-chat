declare const Peer: any;

const CLOSE_SIGNAL        = 'close';
const ANSWER_SIGNAL       = 'answer';
const MUTED_SIGNAL        = 'mutedAudio';
const UNMUTED_SIGNAL      = 'unmutedAudio';
const VIDEO_SIGNAL        = 'loadeddata';
const urls                = ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'];

// la comunicacion entre pares se hace a traves de un canal de datos
// estableciendo comunicacion de mensajes entre pares
// y luego se establece la comunicacion de video y audio (call / llamada)

export class CallPeer {
    private myPeer: any                  = null;
    public  myStream: MediaStream | null = null;
    public  currentConnection: any       = null;

    public call: any                = null;
    public llamadaSaliente: boolean = false;

    remoteMuted: boolean                             = false;
    private     localVideo: HTMLVideoElement | null  = null;
    private     remoteVideo: HTMLVideoElement | null = null;

    constructor() {

    }


    SetVideoElements(localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement) {
        this.localVideo = localVideo;
        this.remoteVideo = remoteVideo;
    }

    private SetRemoteVideo(call: any) {
        this.call = call;
        let remoteVideo = this.remoteVideo as HTMLVideoElement;
        call.on(
            'stream',
            (incomingStream: any) => (remoteVideo.srcObject = incomingStream)
        );
        remoteVideo.addEventListener(VIDEO_SIGNAL, () => remoteVideo.play());
    }

    public HangUp(fromYou: boolean = true) {
        if (this.call != null) {
            this.call.close();
            this.call = null;
        }
        if (this.currentConnection != null) {
            if (fromYou) this.currentConnection.send(CLOSE_SIGNAL);
            this.currentConnection?.close();
            this.currentConnection = null;
        }
    }
    
    public StartListeningWithID(myIdPeer: string) {
        const peerJsOptions = { debug: 0, config: { iceServers: [{ urls }] } };

        this.myPeer = new Peer(myIdPeer, peerJsOptions);

        this.myPeer.on('open', (id: string) => {
            console.log(id)
        });

        this.myPeer.on('connection', (connection: any) => {
            console.log('llamada entrante');
            this.StartCallRinging(connection);
            this.llamadaSaliente = false;
        });

        this.myPeer.on('call', (call: any) => {
            if (this.call == null) {
                this.SetRemoteVideo(call);
                call.answer(this.myStream);
            }
        });

        this.myPeer.on('error', (_: any) => {
            this.HangUp();
        });

        // this.UpdateStreams();
        
    }

    public async UpdateStreams() {
        let devices = await navigator.mediaDevices.enumerateDevices();
        let videoDevices = devices.filter((d) => d.kind == 'videoinput');
        let audioDevices = devices.filter((d) => d.kind == 'audioinput');
        let video: any = false;
        let audio = false;
        if (videoDevices.length > 0) video = true;

        if (audioDevices.length > 0) audio = true;
        const mediaOptions = { audio, video };
        navigator.mediaDevices
            .getUserMedia(mediaOptions)
            .then((stream) => this.SetLocalVideo(stream))
            .catch((_) => this.SetLocalVideo());
    }

    private StartCallRinging(connection: any) {
        this.currentConnection = connection;
        connection.on('data', (data: any) => {
            if (data == CLOSE_SIGNAL) this.HangUp(false);
            if (data == MUTED_SIGNAL) {
                this.remoteMuted = true;
            }
            if (data == UNMUTED_SIGNAL) {
                this.remoteMuted = false;
            }
            if (data == ANSWER_SIGNAL) {
                // se ha aceptado una llamada saliente
                if (this.call == null) {
                    let call = this.myPeer.call(this.currentConnection.peer, this.myStream);
                    this.SetRemoteVideo(call);
                }
            } 
        });
        connection.on('close', (_: any) => this.HangUp(false));
        connection.on('error', (_: any) => {
            this.HangUp(false);
        });
    }

    private SetLocalVideo(stream: MediaStream = new MediaStream()) {
        this.myStream = stream;
        let localVideo = this.localVideo as HTMLVideoElement;
        localVideo.srcObject = this.myStream;
        localVideo.addEventListener(VIDEO_SIGNAL, () => localVideo.play());
    }

    public ToggleAudio() {
        if (this.myStream != null) {
            let audios = this.myStream.getAudioTracks();
            if (audios.length > 0) {
                audios[0].enabled = !audios[0].enabled;
                if (audios[0].enabled) {
                    this.currentConnection.send(UNMUTED_SIGNAL);
                } else {
                    this.currentConnection.send(MUTED_SIGNAL);
                }
            }
        }
    }

    public ToggleVideo() {
        if (this.myStream != null) {
            let videos = this.myStream.getVideoTracks();
            if (videos.length > 0) videos[0].enabled = !videos[0].enabled;
        }
    }

    public get VideoState() {
        if (this.myStream != null) {
            let videos = this.myStream.getVideoTracks();
            if (videos.length > 0) return videos[0].enabled;
        }
        return false;
    }

    public get AudioState() {
        if (this.myStream != null) {
            let audios = this.myStream.getAudioTracks();
            if (audios.length > 0) return audios[0].enabled;
        }
        return false;
    }

    public StartCall(remotePeerID: string, onNotAnswer: (res: string) => void) {
        if (this.currentConnection == null) {
            this.HangUp();
            let connection = this.myPeer.connect(remotePeerID);
            this.StartCallRinging(connection);
            this.llamadaSaliente = true;
            setTimeout((_: any) => {
                if (this.call == null) {
                    this.HangUp();
                    onNotAnswer('No answer');
                }
            }, 60 * 1000);
        }
    }
    
    public Answer() {
        // se ha aceptado una llamada entrante
        this.currentConnection.send(ANSWER_SIGNAL);
    }
}

export const CreateVideoElement = (id: string, classList: string[]) => {
    let video = document.createElement('video');
    video.id = id;
    video.classList.add(...classList);
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    return video;
};
