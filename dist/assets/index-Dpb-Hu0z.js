var P=Object.defineProperty;var _=(i,e,t)=>e in i?P(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var r=(i,e,t)=>_(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const u of o.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&l(u)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function l(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();const L="close",I="transmissionSignal",b="answer",w="mutedAudio",A="unmutedAudio",O="loadeddata",T=["stun:stun1.l.google.com:19302","stun:stun2.l.google.com:19302"];class D{constructor(){r(this,"myPeer",null);r(this,"myStream",null);r(this,"currentConnection",null);r(this,"call",null);r(this,"llamadaSaliente",!1);r(this,"remoteMuted",!1);r(this,"localVideo",null);r(this,"remoteVideo",null)}OnLlamadaEntrante_Ring(){}OnLlamadaEntrante_Answer(){}SetVideoElements(e,t){this.localVideo=e,this.remoteVideo=t}SetOnLlamadaEntrante_Ring(e){this.OnLlamadaEntrante_Ring=e}SetOnLlamadaEntrante_Answer(e){this.OnLlamadaEntrante_Answer=e}SetRemoteVideo(e){this.call=e;let t=this.remoteVideo;e.on("stream",l=>t.srcObject=l),t.addEventListener(O,()=>t.play())}HangUp(e=!0){var t;this.call!=null&&(this.call.close(),this.call=null),this.currentConnection!=null&&(e&&this.currentConnection.send(L),(t=this.currentConnection)==null||t.close(),this.currentConnection=null)}StartListeningWithID(e){const t={debug:0,config:{iceServers:[{urls:T}]}};this.myPeer=new Peer(e,t),this.myPeer.on("open",l=>{console.log(l)}),this.myPeer.on("connection",l=>{this.OnLlamadaEntrante_Ring(),this.StartCallRinging(l),this.llamadaSaliente=!1}),this.myPeer.on("call",l=>{this.call==null&&(this.SetRemoteVideo(l),l.answer(this.myStream))}),this.myPeer.on("error",l=>{this.HangUp()}),window.addEventListener(I,l=>{let n=l.detail;if(n==L&&this.HangUp(!1),n==w&&(this.remoteMuted=!0),n==A&&(this.remoteMuted=!1),n==b&&this.call==null){let o=this.myPeer.call(this.currentConnection.peer,this.myStream);this.SetRemoteVideo(o)}})}async UpdateStreams(){let e=await navigator.mediaDevices.enumerateDevices(),t=e.filter(d=>d.kind=="videoinput"),l=e.filter(d=>d.kind=="audioinput"),n=!1,o=!1;t.length>0&&(n=!0),l.length>0&&(o=!0);const u={audio:o,video:n};navigator.mediaDevices.getUserMedia(u).then(d=>this.SetLocalVideo(d)).catch(d=>this.SetLocalVideo())}StartCallRinging(e){this.currentConnection=e,e.on("data",t=>{console.log("data",t);let l=new CustomEvent(I,{detail:t});window.dispatchEvent(l)}),e.on("close",t=>this.HangUp(!1)),e.on("error",t=>{this.HangUp(!1)})}SetLocalVideo(e=new MediaStream){this.myStream=e;let t=this.localVideo;t.srcObject=this.myStream,t.addEventListener(O,()=>t.play())}ToggleAudio(){if(this.myStream!=null){let e=this.myStream.getAudioTracks();e.length>0&&(e[0].enabled=!e[0].enabled,e[0].enabled?this.currentConnection.send(A):this.currentConnection.send(w))}}ToggleVideo(){if(this.myStream!=null){let e=this.myStream.getVideoTracks();e.length>0&&(e[0].enabled=!e[0].enabled)}}get VideoState(){if(this.myStream!=null){let e=this.myStream.getVideoTracks();if(e.length>0)return e[0].enabled}return!1}get AudioState(){if(this.myStream!=null){let e=this.myStream.getAudioTracks();if(e.length>0)return e[0].enabled}return!1}StartCall(e,t){if(this.currentConnection==null){this.HangUp();let l=this.myPeer.connect(e);this.StartCallRinging(l),this.llamadaSaliente=!0,setTimeout(n=>{this.call==null&&(this.HangUp(),t("No answer"))},60*1e3)}}Answer(){console.log("Answering call"),console.log({currentConnection:this.currentConnection}),this.currentConnection.send(b),this.OnLlamadaEntrante_Answer()}}let c=new D,a=document.querySelector("#app"),h=document.createElement("video");h.autoplay=!0;h.muted=!0;a.appendChild(h);let g=document.createElement("video");g.autoplay=!0;a.appendChild(g);let p=document.createElement("button");p.innerText="Call";p.onclick=async()=>{console.log("Call button clicked"),c.StartCall(m.value,()=>{alert("Call not Connected")}),console.log("Calling peer:",m.value)};let S=document.createElement("button");S.innerText="Hangup";S.onclick=async()=>{console.log("Hangup button clicked"),c.HangUp()};let f=document.createElement("button");f.innerText="Answer";f.onclick=async()=>{console.log("Answer button clicked"),c.Answer()};let y=document.createElement("button");y.innerText="Start Session";y.onclick=async()=>{console.log("Start Session button clicked"),c.StartListeningWithID(s.value)};a.appendChild(y);let C=document.createElement("button");C.innerText="Start Stream";C.onclick=async()=>{console.log("Start Stream button clicked"),c.SetVideoElements(h,g),c.UpdateStreams()};a.appendChild(C);a.appendChild(f);a.appendChild(p);a.appendChild(S);let E=document.createElement("label");E.innerText="My Peer ID: ";let s=document.createElement("input");s.type="text";s.placeholder="Enter Peer ID";E.appendChild(s);a.appendChild(E);let v=document.createElement("label");v.innerText="Remote Peer ID: ";let m=document.createElement("input");m.type="text";m.placeholder="Enter Peer ID";v.appendChild(m);a.appendChild(v);function R(){const i=Math.floor(Math.random()*1e13).toString();return s.value=i,i}let N=R();s.value=N;let V=s.value;s.onchange=()=>{V=s.value,console.log("Peer ID changed to:",V)};c.SetOnLlamadaEntrante_Ring(()=>{const i=document.createElement("div");i.id="incomingCall",i.innerText="Incoming Call...",a.appendChild(i)});c.SetOnLlamadaEntrante_Answer(()=>{const i=document.getElementById("incomingCall");i&&i.remove(),console.log("Incoming call answered")});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtRHBiLUh1MHouanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wZWVyanMudHMiLCIuLi8uLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIGNvbnN0IFBlZXI6IGFueTtcblxuY29uc3QgQ0xPU0VfU0lHTkFMICAgICAgICA9ICdjbG9zZSc7XG5jb25zdCBUUkFOU01JU1NJT05fU0lHTkFMID0gJ3RyYW5zbWlzc2lvblNpZ25hbCc7XG5jb25zdCBBTlNXRVJfU0lHTkFMICAgICAgID0gJ2Fuc3dlcic7XG5jb25zdCBNVVRFRF9TSUdOQUwgICAgICAgID0gJ211dGVkQXVkaW8nO1xuY29uc3QgVU5NVVRFRF9TSUdOQUwgICAgICA9ICd1bm11dGVkQXVkaW8nO1xuY29uc3QgVklERU9fU0lHTkFMICAgICAgICA9ICdsb2FkZWRkYXRhJztcbmNvbnN0IHVybHMgICAgICAgICAgICAgICAgPSBbJ3N0dW46c3R1bjEubC5nb29nbGUuY29tOjE5MzAyJywgJ3N0dW46c3R1bjIubC5nb29nbGUuY29tOjE5MzAyJ107XG5cbi8vIGxhIGNvbXVuaWNhY2lvbiBlbnRyZSBwYXJlcyBzZSBoYWNlIGEgdHJhdmVzIGRlIHVuIGNhbmFsIGRlIGRhdG9zXG4vLyBlc3RhYmxlY2llbmRvIGNvbXVuaWNhY2lvbiBkZSBtZW5zYWplcyBlbnRyZSBwYXJlc1xuLy8geSBsdWVnbyBzZSBlc3RhYmxlY2UgbGEgY29tdW5pY2FjaW9uIGRlIHZpZGVvIHkgYXVkaW8gKGNhbGwgLyBsbGFtYWRhKVxuXG5leHBvcnQgY2xhc3MgQ2FsbFBlZXIge1xuICAgIHByaXZhdGUgbXlQZWVyOiBhbnkgICAgICAgICAgICAgICAgICA9IG51bGw7XG4gICAgcHVibGljICBteVN0cmVhbTogTWVkaWFTdHJlYW0gfCBudWxsID0gbnVsbDtcbiAgICBwdWJsaWMgIGN1cnJlbnRDb25uZWN0aW9uOiBhbnkgICAgICAgPSBudWxsO1xuXG4gICAgcHVibGljIGNhbGw6IGFueSAgICAgICAgICAgICAgICA9IG51bGw7XG4gICAgcHVibGljIGxsYW1hZGFTYWxpZW50ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcmVtb3RlTXV0ZWQ6IGJvb2xlYW4gICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gZmFsc2U7XG4gICAgcHJpdmF0ZSAgICAgbG9jYWxWaWRlbzogSFRNTFZpZGVvRWxlbWVudCB8IG51bGwgID0gbnVsbDtcbiAgICBwcml2YXRlICAgICByZW1vdGVWaWRlbzogSFRNTFZpZGVvRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICBPbkxsYW1hZGFFbnRyYW50ZV9SaW5nKCkge1xuXG4gICAgfVxuXG4gICAgT25MbGFtYWRhRW50cmFudGVfQW5zd2VyKCkge1xuXG4gICAgfVxuXG5cbiAgICBTZXRWaWRlb0VsZW1lbnRzKGxvY2FsVmlkZW86IEhUTUxWaWRlb0VsZW1lbnQsIHJlbW90ZVZpZGVvOiBIVE1MVmlkZW9FbGVtZW50KSB7XG4gICAgICAgIHRoaXMubG9jYWxWaWRlbyA9IGxvY2FsVmlkZW87XG4gICAgICAgIHRoaXMucmVtb3RlVmlkZW8gPSByZW1vdGVWaWRlbztcbiAgICB9XG5cbiAgICBwdWJsaWMgU2V0T25MbGFtYWRhRW50cmFudGVfUmluZyhvbkxsOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuT25MbGFtYWRhRW50cmFudGVfUmluZyA9IG9uTGw7XG4gICAgfVxuXG4gICAgcHVibGljIFNldE9uTGxhbWFkYUVudHJhbnRlX0Fuc3dlcihvbkxsOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuT25MbGFtYWRhRW50cmFudGVfQW5zd2VyID0gb25MbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIFNldFJlbW90ZVZpZGVvKGNhbGw6IGFueSkge1xuICAgICAgICB0aGlzLmNhbGwgPSBjYWxsO1xuICAgICAgICBsZXQgcmVtb3RlVmlkZW8gPSB0aGlzLnJlbW90ZVZpZGVvIGFzIEhUTUxWaWRlb0VsZW1lbnQ7XG4gICAgICAgIGNhbGwub24oXG4gICAgICAgICAgICAnc3RyZWFtJyxcbiAgICAgICAgICAgIChpbmNvbWluZ1N0cmVhbTogYW55KSA9PiAocmVtb3RlVmlkZW8uc3JjT2JqZWN0ID0gaW5jb21pbmdTdHJlYW0pXG4gICAgICAgICk7XG4gICAgICAgIHJlbW90ZVZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoVklERU9fU0lHTkFMLCAoKSA9PiByZW1vdGVWaWRlby5wbGF5KCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBIYW5nVXAoZnJvbVlvdTogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FsbCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGwuY2xvc2UoKTtcbiAgICAgICAgICAgIHRoaXMuY2FsbCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudENvbm5lY3Rpb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGZyb21Zb3UpIHRoaXMuY3VycmVudENvbm5lY3Rpb24uc2VuZChDTE9TRV9TSUdOQUwpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29ubmVjdGlvbj8uY2xvc2UoKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBTdGFydExpc3RlbmluZ1dpdGhJRChteUlkUGVlcjogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHBlZXJKc09wdGlvbnMgPSB7IGRlYnVnOiAwLCBjb25maWc6IHsgaWNlU2VydmVyczogW3sgdXJscyB9XSB9IH07XG5cbiAgICAgICAgdGhpcy5teVBlZXIgPSBuZXcgUGVlcihteUlkUGVlciwgcGVlckpzT3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5teVBlZXIub24oJ29wZW4nLCAoaWQ6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coaWQpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubXlQZWVyLm9uKCdjb25uZWN0aW9uJywgKGNvbm5lY3Rpb246IGFueSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5PbkxsYW1hZGFFbnRyYW50ZV9SaW5nKClcblxuICAgICAgICAgICAgdGhpcy5TdGFydENhbGxSaW5naW5nKGNvbm5lY3Rpb24pO1xuICAgICAgICAgICAgdGhpcy5sbGFtYWRhU2FsaWVudGUgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5teVBlZXIub24oJ2NhbGwnLCAoY2FsbDogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5jYWxsID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLlNldFJlbW90ZVZpZGVvKGNhbGwpO1xuICAgICAgICAgICAgICAgIGNhbGwuYW5zd2VyKHRoaXMubXlTdHJlYW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm15UGVlci5vbignZXJyb3InLCAoXzogYW55KSA9PiB7XG4gICAgICAgICAgICB0aGlzLkhhbmdVcCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyB0aGlzLlVwZGF0ZVN0cmVhbXMoKTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihUUkFOU01JU1NJT05fU0lHTkFMLCAoZXZlbnQ6YW55KSA9PntcbiAgICAgICAgICAgIGxldCBkYXRhID0gZXZlbnQuZGV0YWlsO1xuXG4gICAgICAgICAgICBpZiAoZGF0YSA9PSBDTE9TRV9TSUdOQUwpIHRoaXMuSGFuZ1VwKGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChkYXRhID09IE1VVEVEX1NJR05BTCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3RlTXV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRhdGEgPT0gVU5NVVRFRF9TSUdOQUwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW90ZU11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0YSA9PSBBTlNXRVJfU0lHTkFMKSB7XG4gICAgICAgICAgICAgICAgLy8gc2UgaGEgYWNlcHRhZG8gdW5hIGxsYW1hZGEgc2FsaWVudGVcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jYWxsID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNhbGwgPSB0aGlzLm15UGVlci5jYWxsKHRoaXMuY3VycmVudENvbm5lY3Rpb24ucGVlciwgdGhpcy5teVN0cmVhbSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuU2V0UmVtb3RlVmlkZW8oY2FsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBVcGRhdGVTdHJlYW1zKCkge1xuICAgICAgICBsZXQgZGV2aWNlcyA9IGF3YWl0IG5hdmlnYXRvci5tZWRpYURldmljZXMuZW51bWVyYXRlRGV2aWNlcygpO1xuICAgICAgICBsZXQgdmlkZW9EZXZpY2VzID0gZGV2aWNlcy5maWx0ZXIoKGQpID0+IGQua2luZCA9PSAndmlkZW9pbnB1dCcpO1xuICAgICAgICBsZXQgYXVkaW9EZXZpY2VzID0gZGV2aWNlcy5maWx0ZXIoKGQpID0+IGQua2luZCA9PSAnYXVkaW9pbnB1dCcpO1xuICAgICAgICBsZXQgdmlkZW86IGFueSA9IGZhbHNlO1xuICAgICAgICBsZXQgYXVkaW8gPSBmYWxzZTtcbiAgICAgICAgaWYgKHZpZGVvRGV2aWNlcy5sZW5ndGggPiAwKSB2aWRlbyA9IHRydWU7XG5cbiAgICAgICAgaWYgKGF1ZGlvRGV2aWNlcy5sZW5ndGggPiAwKSBhdWRpbyA9IHRydWU7XG4gICAgICAgIGNvbnN0IG1lZGlhT3B0aW9ucyA9IHsgYXVkaW8sIHZpZGVvIH07XG4gICAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgICAgICAgIC5nZXRVc2VyTWVkaWEobWVkaWFPcHRpb25zKVxuICAgICAgICAgICAgLnRoZW4oKHN0cmVhbSkgPT4gdGhpcy5TZXRMb2NhbFZpZGVvKHN0cmVhbSkpXG4gICAgICAgICAgICAuY2F0Y2goKF8pID0+IHRoaXMuU2V0TG9jYWxWaWRlbygpKTtcbiAgICB9XG4gICAgLy8gZXMgZWwgcHJvYmxlbWEgZGUgbG9zIGV2ZW50b3MgXG4gICAgcHJpdmF0ZSBTdGFydENhbGxSaW5naW5nKGNvbm5lY3Rpb246IGFueSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRDb25uZWN0aW9uID0gY29ubmVjdGlvbjtcbiAgICAgICAgY29ubmVjdGlvbi5vbignZGF0YScsIChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkYXRhJywgZGF0YSk7XG4gICAgICAgICAgICBsZXQgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoVFJBTlNNSVNTSU9OX1NJR05BTCwgeyBkZXRhaWw6IGRhdGEgfSk7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25uZWN0aW9uLm9uKCdjbG9zZScsIChfOiBhbnkpID0+IHRoaXMuSGFuZ1VwKGZhbHNlKSk7XG4gICAgICAgIGNvbm5lY3Rpb24ub24oJ2Vycm9yJywgKF86IGFueSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5IYW5nVXAoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIFNldExvY2FsVmlkZW8oc3RyZWFtOiBNZWRpYVN0cmVhbSA9IG5ldyBNZWRpYVN0cmVhbSgpKSB7XG4gICAgICAgIHRoaXMubXlTdHJlYW0gPSBzdHJlYW07XG4gICAgICAgIGxldCBsb2NhbFZpZGVvID0gdGhpcy5sb2NhbFZpZGVvIGFzIEhUTUxWaWRlb0VsZW1lbnQ7XG4gICAgICAgIGxvY2FsVmlkZW8uc3JjT2JqZWN0ID0gdGhpcy5teVN0cmVhbTtcbiAgICAgICAgbG9jYWxWaWRlby5hZGRFdmVudExpc3RlbmVyKFZJREVPX1NJR05BTCwgKCkgPT4gbG9jYWxWaWRlby5wbGF5KCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBUb2dnbGVBdWRpbygpIHtcbiAgICAgICAgaWYgKHRoaXMubXlTdHJlYW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IGF1ZGlvcyA9IHRoaXMubXlTdHJlYW0uZ2V0QXVkaW9UcmFja3MoKTtcbiAgICAgICAgICAgIGlmIChhdWRpb3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGF1ZGlvc1swXS5lbmFibGVkID0gIWF1ZGlvc1swXS5lbmFibGVkO1xuICAgICAgICAgICAgICAgIGlmIChhdWRpb3NbMF0uZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDb25uZWN0aW9uLnNlbmQoVU5NVVRFRF9TSUdOQUwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudENvbm5lY3Rpb24uc2VuZChNVVRFRF9TSUdOQUwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBUb2dnbGVWaWRlbygpIHtcbiAgICAgICAgaWYgKHRoaXMubXlTdHJlYW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IHZpZGVvcyA9IHRoaXMubXlTdHJlYW0uZ2V0VmlkZW9UcmFja3MoKTtcbiAgICAgICAgICAgIGlmICh2aWRlb3MubGVuZ3RoID4gMCkgdmlkZW9zWzBdLmVuYWJsZWQgPSAhdmlkZW9zWzBdLmVuYWJsZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IFZpZGVvU3RhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLm15U3RyZWFtICE9IG51bGwpIHtcbiAgICAgICAgICAgIGxldCB2aWRlb3MgPSB0aGlzLm15U3RyZWFtLmdldFZpZGVvVHJhY2tzKCk7XG4gICAgICAgICAgICBpZiAodmlkZW9zLmxlbmd0aCA+IDApIHJldHVybiB2aWRlb3NbMF0uZW5hYmxlZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBBdWRpb1N0YXRlKCkge1xuICAgICAgICBpZiAodGhpcy5teVN0cmVhbSAhPSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgYXVkaW9zID0gdGhpcy5teVN0cmVhbS5nZXRBdWRpb1RyYWNrcygpO1xuICAgICAgICAgICAgaWYgKGF1ZGlvcy5sZW5ndGggPiAwKSByZXR1cm4gYXVkaW9zWzBdLmVuYWJsZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBTdGFydENhbGwocmVtb3RlUGVlcklEOiBzdHJpbmcsIG9uTm90QW5zd2VyOiAocmVzOiBzdHJpbmcpID0+IHZvaWQpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudENvbm5lY3Rpb24gPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5IYW5nVXAoKTtcbiAgICAgICAgICAgIGxldCBjb25uZWN0aW9uID0gdGhpcy5teVBlZXIuY29ubmVjdChyZW1vdGVQZWVySUQpO1xuICAgICAgICAgICAgdGhpcy5TdGFydENhbGxSaW5naW5nKGNvbm5lY3Rpb24pO1xuICAgICAgICAgICAgdGhpcy5sbGFtYWRhU2FsaWVudGUgPSB0cnVlO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoXzogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2FsbCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuSGFuZ1VwKCk7XG4gICAgICAgICAgICAgICAgICAgIG9uTm90QW5zd2VyKCdObyBhbnN3ZXInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCA2MCAqIDEwMDApO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBBbnN3ZXIoKSB7XG4gICAgICAgIC8vIHNlIGhhIGFjZXB0YWRvIHVuYSBsbGFtYWRhIGVudHJhbnRlXG4gICAgICAgIGNvbnNvbGUubG9nKCdBbnN3ZXJpbmcgY2FsbCcpO1xuICAgICAgICBjb25zb2xlLmxvZyh7Y3VycmVudENvbm5lY3Rpb246dGhpcy5jdXJyZW50Q29ubmVjdGlvbn0pO1xuICAgICAgICB0aGlzLmN1cnJlbnRDb25uZWN0aW9uLnNlbmQoQU5TV0VSX1NJR05BTCk7XG4gICAgICAgIHRoaXMuT25MbGFtYWRhRW50cmFudGVfQW5zd2VyKCk7XG5cbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBDcmVhdGVWaWRlb0VsZW1lbnQgPSAoaWQ6IHN0cmluZywgY2xhc3NMaXN0OiBzdHJpbmdbXSkgPT4ge1xuICAgIGxldCB2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gICAgdmlkZW8uaWQgPSBpZDtcbiAgICB2aWRlby5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzTGlzdCk7XG4gICAgdmlkZW8uYXV0b3BsYXkgPSB0cnVlO1xuICAgIHZpZGVvLm11dGVkID0gdHJ1ZTtcbiAgICB2aWRlby5wbGF5c0lubGluZSA9IHRydWU7XG4gICAgcmV0dXJuIHZpZGVvO1xufTtcbiIsImltcG9ydCB7IENhbGxQZWVyIH0gZnJvbSAnLi9wZWVyanMudHMnO1xuaW1wb3J0ICcuL3N0eWxlLmNzcyc7XG5cbmxldCBzZXJ2aWNlID0gbmV3IENhbGxQZWVyKCk7XG5sZXQgYXBwID1kb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50PignI2FwcCcpIVxuXG5cbmxldCBsb2NhbFZpZGVvICAgICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKVxuICAgIGxvY2FsVmlkZW8uYXV0b3BsYXkgPSB0cnVlXG4gICAgbG9jYWxWaWRlby5tdXRlZCAgICA9IHRydWVcbmFwcC5hcHBlbmRDaGlsZChsb2NhbFZpZGVvKVxuXG5sZXQgcmVtb3RlVmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpXG5yZW1vdGVWaWRlby5hdXRvcGxheSA9IHRydWVcbmFwcC5hcHBlbmRDaGlsZChyZW1vdGVWaWRlbylcblxubGV0IGNhbGxCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuY2FsbEJ1dHRvbi5pbm5lclRleHQgPSAnQ2FsbCdcbmNhbGxCdXR0b24ub25jbGljayA9IGFzeW5jICgpID0+IHsgIFxuICAgIGNvbnNvbGUubG9nKCdDYWxsIGJ1dHRvbiBjbGlja2VkJyk7XG4gICAgXG4gICAgc2VydmljZS5TdGFydENhbGwocGVlcklkSW5wdXQyLnZhbHVlLCAoKSA9PiB7XG4gICAgICAgIGFsZXJ0KCdDYWxsIG5vdCBDb25uZWN0ZWQnKTtcbiAgICB9KVxuICAgIGNvbnNvbGUubG9nKCdDYWxsaW5nIHBlZXI6JywgcGVlcklkSW5wdXQyLnZhbHVlKTtcbn1cblxubGV0IGhhbmd1cEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG5oYW5ndXBCdXR0b24uaW5uZXJUZXh0ID0gJ0hhbmd1cCdcbmhhbmd1cEJ1dHRvbi5vbmNsaWNrID0gYXN5bmMgKCkgPT4geyAgXG4gICAgY29uc29sZS5sb2coJ0hhbmd1cCBidXR0b24gY2xpY2tlZCcpO1xuICAgIHNlcnZpY2UuSGFuZ1VwKCk7XG59XG5cbmxldCBhbnN3ZXJCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuYW5zd2VyQnV0dG9uLmlubmVyVGV4dCA9ICdBbnN3ZXInXG5hbnN3ZXJCdXR0b24ub25jbGljayA9IGFzeW5jICgpID0+IHsgIFxuICAgIGNvbnNvbGUubG9nKCdBbnN3ZXIgYnV0dG9uIGNsaWNrZWQnKTtcbiAgICBzZXJ2aWNlLkFuc3dlcigpO1xufVxuXG5sZXQgc3RhcnRTZXNzaW9uQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcbnN0YXJ0U2Vzc2lvbkJ1dHRvbi5pbm5lclRleHQgPSAnU3RhcnQgU2Vzc2lvbidcbnN0YXJ0U2Vzc2lvbkJ1dHRvbi5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdTdGFydCBTZXNzaW9uIGJ1dHRvbiBjbGlja2VkJyk7XG4gICAgc2VydmljZS5TdGFydExpc3RlbmluZ1dpdGhJRChwZWVySWRJbnB1dC52YWx1ZSlcbn1cbmFwcC5hcHBlbmRDaGlsZChzdGFydFNlc3Npb25CdXR0b24pXG5cbmxldCBzdGFydFN0cmVhbUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG5zdGFydFN0cmVhbUJ1dHRvbi5pbm5lclRleHQgPSAnU3RhcnQgU3RyZWFtJ1xuc3RhcnRTdHJlYW1CdXR0b24ub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnU3RhcnQgU3RyZWFtIGJ1dHRvbiBjbGlja2VkJyk7XG4gICAgc2VydmljZS5TZXRWaWRlb0VsZW1lbnRzKGxvY2FsVmlkZW8sIHJlbW90ZVZpZGVvKTtcbiAgICBzZXJ2aWNlLlVwZGF0ZVN0cmVhbXMoKTtcbn1cbmFwcC5hcHBlbmRDaGlsZChzdGFydFN0cmVhbUJ1dHRvbilcbmFwcC5hcHBlbmRDaGlsZChhbnN3ZXJCdXR0b24pXG5cbmFwcC5hcHBlbmRDaGlsZChjYWxsQnV0dG9uKVxuYXBwLmFwcGVuZENoaWxkKGhhbmd1cEJ1dHRvbilcblxubGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKVxubGFiZWwuaW5uZXJUZXh0ID0gJ015IFBlZXIgSUQ6ICdcbmxldCBwZWVySWRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JylcbnBlZXJJZElucHV0LnR5cGUgPSAndGV4dCdcbnBlZXJJZElucHV0LnBsYWNlaG9sZGVyID0gJ0VudGVyIFBlZXIgSUQnXG5sYWJlbC5hcHBlbmRDaGlsZChwZWVySWRJbnB1dClcbmFwcC5hcHBlbmRDaGlsZChsYWJlbClcblxubGV0IGxhYmVsMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJylcbmxhYmVsMi5pbm5lclRleHQgPSAnUmVtb3RlIFBlZXIgSUQ6ICdcbmxldCBwZWVySWRJbnB1dDIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpXG5wZWVySWRJbnB1dDIudHlwZSA9ICd0ZXh0J1xucGVlcklkSW5wdXQyLnBsYWNlaG9sZGVyID0gJ0VudGVyIFBlZXIgSUQnXG5sYWJlbDIuYXBwZW5kQ2hpbGQocGVlcklkSW5wdXQyKVxuYXBwLmFwcGVuZENoaWxkKGxhYmVsMilcblxuXG4vLyBjYWxsIGxvZ2ljIFxuXG5cbmZ1bmN0aW9uIEdlbmVyYXRlUmFuZG9tUGVlcklkKCkge1xuICAgIGNvbnN0IHJhbmRvbUlkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMDAwMDAwMDApLnRvU3RyaW5nKCk7XG4gICAgcGVlcklkSW5wdXQudmFsdWUgPSByYW5kb21JZDtcbiAgICByZXR1cm4gcmFuZG9tSWQ7XG59ICAgXG5cbmxldCBteVBlZXJJZCA9IEdlbmVyYXRlUmFuZG9tUGVlcklkKCk7XG5wZWVySWRJbnB1dC52YWx1ZSA9IG15UGVlcklkO1xubGV0IHBlZXJJZCA9IHBlZXJJZElucHV0LnZhbHVlO1xucGVlcklkSW5wdXQub25jaGFuZ2UgPSAoKSA9PiB7XG4gICAgcGVlcklkID0gcGVlcklkSW5wdXQudmFsdWU7XG4gICAgY29uc29sZS5sb2coJ1BlZXIgSUQgY2hhbmdlZCB0bzonLCBwZWVySWQpO1xufVxuXG5cbnNlcnZpY2UuU2V0T25MbGFtYWRhRW50cmFudGVfUmluZygoKSA9PiB7XG4gICAgLy8gYXBwZW5kIGRpdiBcbiAgICBjb25zdCBpbmNvbWluZ0NhbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBpbmNvbWluZ0NhbGxEaXYuaWQgPSAnaW5jb21pbmdDYWxsJztcbiAgICBpbmNvbWluZ0NhbGxEaXYuaW5uZXJUZXh0ID0gJ0luY29taW5nIENhbGwuLi4nO1xuICAgIGFwcC5hcHBlbmRDaGlsZChpbmNvbWluZ0NhbGxEaXYpO1xuXG59KTtcblxuc2VydmljZS5TZXRPbkxsYW1hZGFFbnRyYW50ZV9BbnN3ZXIoKCkgPT4ge1xuICAgIC8vIHJlbW92ZSBkaXYgXG4gICAgY29uc3QgaW5jb21pbmdDYWxsRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luY29taW5nQ2FsbCcpO1xuICAgIGlmIChpbmNvbWluZ0NhbGxEaXYpIHtcbiAgICAgICAgaW5jb21pbmdDYWxsRGl2LnJlbW92ZSgpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygnSW5jb21pbmcgY2FsbCBhbnN3ZXJlZCcpO1xufSk7XG5cblxuIl0sIm5hbWVzIjpbIkNMT1NFX1NJR05BTCIsIlRSQU5TTUlTU0lPTl9TSUdOQUwiLCJBTlNXRVJfU0lHTkFMIiwiTVVURURfU0lHTkFMIiwiVU5NVVRFRF9TSUdOQUwiLCJWSURFT19TSUdOQUwiLCJ1cmxzIiwiQ2FsbFBlZXIiLCJfX3B1YmxpY0ZpZWxkIiwibG9jYWxWaWRlbyIsInJlbW90ZVZpZGVvIiwib25MbCIsImNhbGwiLCJpbmNvbWluZ1N0cmVhbSIsImZyb21Zb3UiLCJfYSIsIm15SWRQZWVyIiwicGVlckpzT3B0aW9ucyIsImlkIiwiY29ubmVjdGlvbiIsIl8iLCJldmVudCIsImRhdGEiLCJkZXZpY2VzIiwidmlkZW9EZXZpY2VzIiwiYXVkaW9EZXZpY2VzIiwidmlkZW8iLCJhdWRpbyIsIm1lZGlhT3B0aW9ucyIsInN0cmVhbSIsImF1ZGlvcyIsInZpZGVvcyIsInJlbW90ZVBlZXJJRCIsIm9uTm90QW5zd2VyIiwic2VydmljZSIsImFwcCIsImNhbGxCdXR0b24iLCJwZWVySWRJbnB1dDIiLCJoYW5ndXBCdXR0b24iLCJhbnN3ZXJCdXR0b24iLCJzdGFydFNlc3Npb25CdXR0b24iLCJwZWVySWRJbnB1dCIsInN0YXJ0U3RyZWFtQnV0dG9uIiwibGFiZWwiLCJsYWJlbDIiLCJHZW5lcmF0ZVJhbmRvbVBlZXJJZCIsInJhbmRvbUlkIiwibXlQZWVySWQiLCJwZWVySWQiLCJpbmNvbWluZ0NhbGxEaXYiXSwibWFwcGluZ3MiOiIwMkJBRUEsTUFBTUEsRUFBc0IsUUFDdEJDLEVBQXNCLHFCQUN0QkMsRUFBc0IsU0FDdEJDLEVBQXNCLGFBQ3RCQyxFQUFzQixlQUN0QkMsRUFBc0IsYUFDdEJDLEVBQXNCLENBQUMsZ0NBQWlDLCtCQUErQixFQU10RixNQUFNQyxDQUFTLENBWWxCLGFBQWMsQ0FYTkMsRUFBQSxjQUErQixNQUMvQkEsRUFBQSxnQkFBK0IsTUFDL0JBLEVBQUEseUJBQStCLE1BRWhDQSxFQUFBLFlBQTJCLE1BQzNCQSxFQUFBLHVCQUEyQixJQUVsQ0EsRUFBQSxtQkFBbUQsSUFDdkNBLEVBQUEsa0JBQXVDLE1BQ3ZDQSxFQUFBLG1CQUF1QyxLQUVyQyxDQUlkLHdCQUF5QixDQUFBLENBSXpCLDBCQUEyQixDQUFBLENBSzNCLGlCQUFpQkMsRUFBOEJDLEVBQStCLENBQzFFLEtBQUssV0FBYUQsRUFDbEIsS0FBSyxZQUFjQyxDQUFBLENBR2hCLDBCQUEwQkMsRUFBa0IsQ0FDL0MsS0FBSyx1QkFBeUJBLENBQUEsQ0FHM0IsNEJBQTRCQSxFQUFrQixDQUNqRCxLQUFLLHlCQUEyQkEsQ0FBQSxDQUc1QixlQUFlQyxFQUFXLENBQzlCLEtBQUssS0FBT0EsRUFDWixJQUFJRixFQUFjLEtBQUssWUFDbEJFLEVBQUEsR0FDRCxTQUNDQyxHQUF5QkgsRUFBWSxVQUFZRyxDQUN0RCxFQUNBSCxFQUFZLGlCQUFpQkwsRUFBYyxJQUFNSyxFQUFZLE1BQU0sQ0FBQSxDQUdoRSxPQUFPSSxFQUFtQixHQUFNLE9BQy9CLEtBQUssTUFBUSxPQUNiLEtBQUssS0FBSyxNQUFNLEVBQ2hCLEtBQUssS0FBTyxNQUVaLEtBQUssbUJBQXFCLE9BQ3RCQSxHQUFTLEtBQUssa0JBQWtCLEtBQUtkLENBQVksR0FDckRlLEVBQUEsS0FBSyxvQkFBTCxNQUFBQSxFQUF3QixRQUN4QixLQUFLLGtCQUFvQixLQUM3QixDQUdHLHFCQUFxQkMsRUFBa0IsQ0FDMUMsTUFBTUMsRUFBZ0IsQ0FBRSxNQUFPLEVBQUcsT0FBUSxDQUFFLFdBQVksQ0FBQyxDQUFFLEtBQUFYLENBQU0sQ0FBQSxFQUFJLEVBRXJFLEtBQUssT0FBUyxJQUFJLEtBQUtVLEVBQVVDLENBQWEsRUFFOUMsS0FBSyxPQUFPLEdBQUcsT0FBU0MsR0FBZSxDQUNuQyxRQUFRLElBQUlBLENBQUUsQ0FBQSxDQUNqQixFQUVELEtBQUssT0FBTyxHQUFHLGFBQWVDLEdBQW9CLENBQzlDLEtBQUssdUJBQXVCLEVBRTVCLEtBQUssaUJBQWlCQSxDQUFVLEVBQ2hDLEtBQUssZ0JBQWtCLEVBQUEsQ0FDMUIsRUFFRCxLQUFLLE9BQU8sR0FBRyxPQUFTUCxHQUFjLENBQzlCLEtBQUssTUFBUSxPQUNiLEtBQUssZUFBZUEsQ0FBSSxFQUNuQkEsRUFBQSxPQUFPLEtBQUssUUFBUSxFQUM3QixDQUNILEVBRUQsS0FBSyxPQUFPLEdBQUcsUUFBVVEsR0FBVyxDQUNoQyxLQUFLLE9BQU8sQ0FBQSxDQUNmLEVBSU0sT0FBQSxpQkFBaUJuQixFQUFzQm9CLEdBQWEsQ0FDdkQsSUFBSUMsRUFBT0QsRUFBTSxPQVNqQixHQVBJQyxHQUFRdEIsR0FBbUIsS0FBQSxPQUFPLEVBQUssRUFDdkNzQixHQUFRbkIsSUFDUixLQUFLLFlBQWMsSUFFbkJtQixHQUFRbEIsSUFDUixLQUFLLFlBQWMsSUFFbkJrQixHQUFRcEIsR0FFSixLQUFLLE1BQVEsS0FBTSxDQUNmLElBQUFVLEVBQU8sS0FBSyxPQUFPLEtBQUssS0FBSyxrQkFBa0IsS0FBTSxLQUFLLFFBQVEsRUFDdEUsS0FBSyxlQUFlQSxDQUFJLENBQUEsQ0FFaEMsQ0FDSCxDQUFBLENBSUwsTUFBYSxlQUFnQixDQUN6QixJQUFJVyxFQUFVLE1BQU0sVUFBVSxhQUFhLGlCQUFpQixFQUN4REMsRUFBZUQsRUFBUSxPQUFRLEdBQU0sRUFBRSxNQUFRLFlBQVksRUFDM0RFLEVBQWVGLEVBQVEsT0FBUSxHQUFNLEVBQUUsTUFBUSxZQUFZLEVBQzNERyxFQUFhLEdBQ2JDLEVBQVEsR0FDUkgsRUFBYSxPQUFTLElBQVdFLEVBQUEsSUFFakNELEVBQWEsT0FBUyxJQUFXRSxFQUFBLElBQy9CLE1BQUFDLEVBQWUsQ0FBRSxNQUFBRCxFQUFPLE1BQUFELENBQU0sRUFDcEMsVUFBVSxhQUNMLGFBQWFFLENBQVksRUFDekIsS0FBTUMsR0FBVyxLQUFLLGNBQWNBLENBQU0sQ0FBQyxFQUMzQyxNQUFPVCxHQUFNLEtBQUssZUFBZSxDQUFBLENBR2xDLGlCQUFpQkQsRUFBaUIsQ0FDdEMsS0FBSyxrQkFBb0JBLEVBQ2RBLEVBQUEsR0FBRyxPQUFTRyxHQUFjLENBQ3pCLFFBQUEsSUFBSSxPQUFRQSxDQUFJLEVBQ3hCLElBQUlELEVBQVEsSUFBSSxZQUFZcEIsRUFBcUIsQ0FBRSxPQUFRcUIsRUFBTSxFQUNqRSxPQUFPLGNBQWNELENBQUssQ0FBQSxDQUM3QixFQUNERixFQUFXLEdBQUcsUUFBVUMsR0FBVyxLQUFLLE9BQU8sRUFBSyxDQUFDLEVBQzFDRCxFQUFBLEdBQUcsUUFBVUMsR0FBVyxDQUMvQixLQUFLLE9BQU8sRUFBSyxDQUFBLENBQ3BCLENBQUEsQ0FHRyxjQUFjUyxFQUFzQixJQUFJLFlBQWUsQ0FDM0QsS0FBSyxTQUFXQSxFQUNoQixJQUFJcEIsRUFBYSxLQUFLLFdBQ3RCQSxFQUFXLFVBQVksS0FBSyxTQUM1QkEsRUFBVyxpQkFBaUJKLEVBQWMsSUFBTUksRUFBVyxNQUFNLENBQUEsQ0FHOUQsYUFBYyxDQUNiLEdBQUEsS0FBSyxVQUFZLEtBQU0sQ0FDbkIsSUFBQXFCLEVBQVMsS0FBSyxTQUFTLGVBQWUsRUFDdENBLEVBQU8sT0FBUyxJQUNoQkEsRUFBTyxDQUFDLEVBQUUsUUFBVSxDQUFDQSxFQUFPLENBQUMsRUFBRSxRQUMzQkEsRUFBTyxDQUFDLEVBQUUsUUFDTCxLQUFBLGtCQUFrQixLQUFLMUIsQ0FBYyxFQUVyQyxLQUFBLGtCQUFrQixLQUFLRCxDQUFZLEVBRWhELENBQ0osQ0FHRyxhQUFjLENBQ2IsR0FBQSxLQUFLLFVBQVksS0FBTSxDQUNuQixJQUFBNEIsRUFBUyxLQUFLLFNBQVMsZUFBZSxFQUN0Q0EsRUFBTyxPQUFTLElBQVVBLEVBQUEsQ0FBQyxFQUFFLFFBQVUsQ0FBQ0EsRUFBTyxDQUFDLEVBQUUsUUFBQSxDQUMxRCxDQUdKLElBQVcsWUFBYSxDQUNoQixHQUFBLEtBQUssVUFBWSxLQUFNLENBQ25CLElBQUFBLEVBQVMsS0FBSyxTQUFTLGVBQWUsRUFDMUMsR0FBSUEsRUFBTyxPQUFTLEVBQVUsT0FBQUEsRUFBTyxDQUFDLEVBQUUsT0FBQSxDQUVyQyxNQUFBLEVBQUEsQ0FHWCxJQUFXLFlBQWEsQ0FDaEIsR0FBQSxLQUFLLFVBQVksS0FBTSxDQUNuQixJQUFBRCxFQUFTLEtBQUssU0FBUyxlQUFlLEVBQzFDLEdBQUlBLEVBQU8sT0FBUyxFQUFVLE9BQUFBLEVBQU8sQ0FBQyxFQUFFLE9BQUEsQ0FFckMsTUFBQSxFQUFBLENBR0osVUFBVUUsRUFBc0JDLEVBQW9DLENBQ25FLEdBQUEsS0FBSyxtQkFBcUIsS0FBTSxDQUNoQyxLQUFLLE9BQU8sRUFDWixJQUFJZCxFQUFhLEtBQUssT0FBTyxRQUFRYSxDQUFZLEVBQ2pELEtBQUssaUJBQWlCYixDQUFVLEVBQ2hDLEtBQUssZ0JBQWtCLEdBQ3ZCLFdBQVlDLEdBQVcsQ0FDZixLQUFLLE1BQVEsT0FDYixLQUFLLE9BQU8sRUFDWmEsRUFBWSxXQUFXLEVBQzNCLEVBQ0QsR0FBSyxHQUFJLENBQUEsQ0FDaEIsQ0FHRyxRQUFTLENBRVosUUFBUSxJQUFJLGdCQUFnQixFQUM1QixRQUFRLElBQUksQ0FBQyxrQkFBa0IsS0FBSyxrQkFBa0IsRUFDakQsS0FBQSxrQkFBa0IsS0FBSy9CLENBQWEsRUFDekMsS0FBSyx5QkFBeUIsQ0FBQSxDQUd0QyxDQ3pOQSxJQUFJZ0MsRUFBVSxJQUFJM0IsRUFDZDRCLEVBQUssU0FBUyxjQUE4QixNQUFNLEVBR2xEMUIsRUFBc0IsU0FBUyxjQUFjLE9BQU8sRUFDcERBLEVBQVcsU0FBVyxHQUN0QkEsRUFBVyxNQUFXLEdBQzFCMEIsRUFBSSxZQUFZMUIsQ0FBVSxFQUUxQixJQUFJQyxFQUFjLFNBQVMsY0FBYyxPQUFPLEVBQ2hEQSxFQUFZLFNBQVcsR0FDdkJ5QixFQUFJLFlBQVl6QixDQUFXLEVBRTNCLElBQUkwQixFQUFhLFNBQVMsY0FBYyxRQUFRLEVBQ2hEQSxFQUFXLFVBQVksT0FDdkJBLEVBQVcsUUFBVSxTQUFZLENBQzdCLFFBQVEsSUFBSSxxQkFBcUIsRUFFekJGLEVBQUEsVUFBVUcsRUFBYSxNQUFPLElBQU0sQ0FDeEMsTUFBTSxvQkFBb0IsQ0FBQSxDQUM3QixFQUNPLFFBQUEsSUFBSSxnQkFBaUJBLEVBQWEsS0FBSyxDQUNuRCxFQUVBLElBQUlDLEVBQWUsU0FBUyxjQUFjLFFBQVEsRUFDbERBLEVBQWEsVUFBWSxTQUN6QkEsRUFBYSxRQUFVLFNBQVksQ0FDL0IsUUFBUSxJQUFJLHVCQUF1QixFQUNuQ0osRUFBUSxPQUFPLENBQ25CLEVBRUEsSUFBSUssRUFBZSxTQUFTLGNBQWMsUUFBUSxFQUNsREEsRUFBYSxVQUFZLFNBQ3pCQSxFQUFhLFFBQVUsU0FBWSxDQUMvQixRQUFRLElBQUksdUJBQXVCLEVBQ25DTCxFQUFRLE9BQU8sQ0FDbkIsRUFFQSxJQUFJTSxFQUFxQixTQUFTLGNBQWMsUUFBUSxFQUN4REEsRUFBbUIsVUFBWSxnQkFDL0JBLEVBQW1CLFFBQVUsU0FBWSxDQUNyQyxRQUFRLElBQUksOEJBQThCLEVBQ2xDTixFQUFBLHFCQUFxQk8sRUFBWSxLQUFLLENBQ2xELEVBQ0FOLEVBQUksWUFBWUssQ0FBa0IsRUFFbEMsSUFBSUUsRUFBb0IsU0FBUyxjQUFjLFFBQVEsRUFDdkRBLEVBQWtCLFVBQVksZUFDOUJBLEVBQWtCLFFBQVUsU0FBWSxDQUNwQyxRQUFRLElBQUksNkJBQTZCLEVBQ2pDUixFQUFBLGlCQUFpQnpCLEVBQVlDLENBQVcsRUFDaER3QixFQUFRLGNBQWMsQ0FDMUIsRUFDQUMsRUFBSSxZQUFZTyxDQUFpQixFQUNqQ1AsRUFBSSxZQUFZSSxDQUFZLEVBRTVCSixFQUFJLFlBQVlDLENBQVUsRUFDMUJELEVBQUksWUFBWUcsQ0FBWSxFQUU1QixJQUFJSyxFQUFRLFNBQVMsY0FBYyxPQUFPLEVBQzFDQSxFQUFNLFVBQVksZUFDbEIsSUFBSUYsRUFBYyxTQUFTLGNBQWMsT0FBTyxFQUNoREEsRUFBWSxLQUFPLE9BQ25CQSxFQUFZLFlBQWMsZ0JBQzFCRSxFQUFNLFlBQVlGLENBQVcsRUFDN0JOLEVBQUksWUFBWVEsQ0FBSyxFQUVyQixJQUFJQyxFQUFTLFNBQVMsY0FBYyxPQUFPLEVBQzNDQSxFQUFPLFVBQVksbUJBQ25CLElBQUlQLEVBQWUsU0FBUyxjQUFjLE9BQU8sRUFDakRBLEVBQWEsS0FBTyxPQUNwQkEsRUFBYSxZQUFjLGdCQUMzQk8sRUFBTyxZQUFZUCxDQUFZLEVBQy9CRixFQUFJLFlBQVlTLENBQU0sRUFNdEIsU0FBU0MsR0FBdUIsQ0FDdEIsTUFBQUMsRUFBVyxLQUFLLE1BQU0sS0FBSyxTQUFXLElBQWMsRUFBRSxTQUFTLEVBQ3JFLE9BQUFMLEVBQVksTUFBUUssRUFDYkEsQ0FDWCxDQUVBLElBQUlDLEVBQVdGLEVBQXFCLEVBQ3BDSixFQUFZLE1BQVFNLEVBQ3BCLElBQUlDLEVBQVNQLEVBQVksTUFDekJBLEVBQVksU0FBVyxJQUFNLENBQ3pCTyxFQUFTUCxFQUFZLE1BQ2IsUUFBQSxJQUFJLHNCQUF1Qk8sQ0FBTSxDQUM3QyxFQUdBZCxFQUFRLDBCQUEwQixJQUFNLENBRTlCLE1BQUFlLEVBQWtCLFNBQVMsY0FBYyxLQUFLLEVBQ3BEQSxFQUFnQixHQUFLLGVBQ3JCQSxFQUFnQixVQUFZLG1CQUM1QmQsRUFBSSxZQUFZYyxDQUFlLENBRW5DLENBQUMsRUFFRGYsRUFBUSw0QkFBNEIsSUFBTSxDQUVoQyxNQUFBZSxFQUFrQixTQUFTLGVBQWUsY0FBYyxFQUMxREEsR0FDQUEsRUFBZ0IsT0FBTyxFQUUzQixRQUFRLElBQUksd0JBQXdCLENBQ3hDLENBQUMifQ==
