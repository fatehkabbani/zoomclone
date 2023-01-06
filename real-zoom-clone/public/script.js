const socket = io('/');
const vid = document.getElementById('video-grid');  
const mypeer = new Peer(undefined, {
    host: '/',
    port: '3001'
});
const myvid = document.createElement('video');
myvid.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addvidstream(myvid , stream)
})
mypeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)

})
socket.on('user-connected' , userId => {
    console.log('user-connected' + userId)
})
function addvidstream(video , stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata' , () =>{
        video.play()
    });
    vid.append(video);
}