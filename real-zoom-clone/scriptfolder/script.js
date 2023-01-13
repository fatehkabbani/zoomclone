const input = document.getElementById('myInput');

function tp() {
    document.getElementById(`aLink`).href = `localhost:3000/${input.value}`
}