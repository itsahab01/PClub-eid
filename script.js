const canvas = document.getElementById("card");
const ctx = canvas.getContext("2d");

const template = new Image();
template.src = "assets/eid-template.png";

template.onload = () => {
    renderCanvas("");
    canvas.classList.add("show");
};

function renderCanvas(name) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(template, 0, 0, 800, 1000);

    if (name !== "") {
        ctx.fillStyle = "#7a6a4a";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let fontSize = 36;
        ctx.font = fontSize + "px 'IBM Plex Sans Arabic'";

        while (ctx.measureText(name).width > 500 && fontSize > 10) {
            fontSize--;
            ctx.font = fontSize + "px 'IBM Plex Sans Arabic'";
        }

        ctx.fillText(name, 400, 810); // موقع الاسم
    }
}

const nameInput = document.getElementById("nameInput");
nameInput.addEventListener("input", () => {
    renderCanvas(nameInput.value.trim());
});

function downloadCard() {
    const name = nameInput.value.trim();

    if (name === "") {
        alert("اكتب اسمك أول!");
        return;
    }

    renderCanvas(name);

    const link = document.createElement("a");
    link.download = "eid-greeting.png";
    link.href = canvas.toDataURL();
    link.click();
}