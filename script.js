const canvas = document.getElementById("card");
const ctx = canvas.getContext("2d");
const nameInput = document.getElementById("nameInput");
const templateRadios = document.querySelectorAll('input[name="templateChoice"]');
const templateOptions = document.querySelectorAll(".template-option");

const templates = {
    template1: {
        image: new Image(),
        src: "assets/Eid-prog1.jpeg",

        textXRatio: 0.5,
        textYRatio: 0.765,

        textColor: "#eeecec" ,
        maxWidthRatio: 0.40,
        startFontSizeRatio: 20,   // fraction of image height
        minFontSize: 20,
        fontWeight: "bold",
        fontFamily: "'IBM Plex Sans Arabic'"
    },

    template2: {
        image: new Image(),
        src: "assets/Eid-prog2.jpeg",

        textXRatio: 0.5,
        textYRatio: 0.7,

        textColor: "#eeecec",
        maxWidthRatio: 0.60,
        startFontSizeRatio: 20,
        minFontSize: 20,
        fontWeight: "bold",
        fontFamily: "'IBM Plex Sans Arabic'"
    }
};

let currentTemplateKey = "template1";
let loadedImagesCount = 0;
const totalImages = Object.keys(templates).length;

Object.values(templates).forEach((template) => {
    template.image.src = template.src;

    template.image.onload = () => {
        loadedImagesCount++;
        if (loadedImagesCount === totalImages) {
            syncCanvasToTemplate();
            renderCanvas(nameInput.value.trim());
            canvas.classList.add("show");
        }
    };
});

function getCurrentTemplate() {
    return templates[currentTemplateKey];
}


function syncCanvasToTemplate() {
    const templateConfig = getCurrentTemplate();
    const image = templateConfig.image;

    if (!image.complete || image.naturalWidth === 0) return;

    const nw = image.naturalWidth;
    const nh = image.naturalHeight;

    
    if (canvas.width !== nw || canvas.height !== nh) {
        canvas.width  = nw;
        canvas.height = nh;
        canvas.style.aspectRatio = `${nw} / ${nh}`;
    }
}

function getDisplayScale() {
    const displayedWidth = canvas.clientWidth || canvas.width;
    return canvas.width / displayedWidth;
}

function fitTextToWidth(text, templateConfig) {
    const fontSize = canvas.width * 0.05; 
    return Math.round(fontSize);
}

function renderCanvas(name) {
    const templateConfig = getCurrentTemplate();
    const image = templateConfig.image;

    if (!image.complete || image.naturalWidth === 0) return;

   
    syncCanvasToTemplate();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    if (name !== "") {
        ctx.fillStyle   = templateConfig.textColor;
        ctx.textAlign   = "center";
        ctx.textBaseline = "middle";

        const textX = canvas.width  * templateConfig.textXRatio;
        const textY = canvas.height * templateConfig.textYRatio;

        const finalFontSize = fitTextToWidth(name, templateConfig);
        ctx.font = `${templateConfig.fontWeight} ${finalFontSize}px ${templateConfig.fontFamily}`;

        ctx.fillText(name, textX, textY);
    }
}

nameInput.addEventListener("input", () => {
    renderCanvas(nameInput.value.trim());
});

templateRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
        currentTemplateKey = radio.value;

        templateOptions.forEach((option) => option.classList.remove("active"));
        radio.closest(".template-option").classList.add("active");

        
        syncCanvasToTemplate();
        renderCanvas(nameInput.value.trim());
    });
});

function downloadCard() {
    const name = nameInput.value.trim();

    if (name === "") {
        alert("اكتب اسمك أول!");
        return;
    }

    renderCanvas(name);

    const link = document.createElement("a");
    link.download = `${currentTemplateKey}-eid-greeting.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}