const socket = io('/');
const vid = document.getElementById('video-grid');
const mypeer = new Peer(undefined, {
    host: '/',
    port: '3001'

});
const myvid = document.createElement('video');
myvid.muted = true;
const peers = {};
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addvidstream(myvid, stream)
    mypeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addvidstream(video, userVideoStream);
        })
    })
    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)

    })
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close();

})

mypeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})
socket.on('user-connected', userId => {
    console.log('user-connected' + userId)
})
function connectToNewUser(userId, stream) {
    const call = mypeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addvidstream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove();
    })
    peers[userId] = call;
}
function addvidstream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    });
    vid.append(video);
}