const canvas = document.getElementById("card");
const ctx = canvas.getContext("2d");
const nameInput = document.getElementById("nameInput");
const templateRadios = document.querySelectorAll('input[name="templateChoice"]');
const templateOptions = document.querySelectorAll(".template-option");

const templates = 
{
    template1: {
        image: new Image(),
        src: "assets/Eid-programming.jpeg",
        textX: 400,
        textY: 765,
        textColor: "#eeecec",
        maxWidth: 500,
        startFontSize: 36,
        minFontSize: 10,
        fontWeight: "700",
        fontFamily: "'IBM Plex Sans Arabic'"
    },
    
    template2: {
        image: new Image(),
        src: "assets/eid-template.png",

        textX: 400,
        textY: 800, // position of name on template 2

        textColor: "#080808",
        maxWidth: 500,
        startFontSize: 36,
        minFontSize: 10,
        fontWeight: "700",
        fontFamily: "'IBM Plex Sans Arabic'"
    }
};

let currentTemplateKey = "template1";
let loadedImagesCount = 0;
const totalImages = Object.keys(templates).length;

Object.values(templates).forEach((template) => 
    {
    template.image.src = template.src;

    template.image.onload = () => {
        loadedImagesCount++;

        if (loadedImagesCount === totalImages) 
            {
            renderCanvas(nameInput.value.trim());
            canvas.classList.add("show");
        }
    };
}
);

function getCurrentTemplate() {
    return templates[currentTemplateKey];
}

function fitTextToWidth(text, templateConfig) {
    let fontSize = templateConfig.startFontSize;

    ctx.font = `${templateConfig.fontWeight} ${fontSize}px ${templateConfig.fontFamily}`;

    while (ctx.measureText(text).width > templateConfig.maxWidth && fontSize > templateConfig.minFontSize) {
        fontSize--;
        ctx.font = `${templateConfig.fontWeight} ${fontSize}px ${templateConfig.fontFamily}`;
    }

    return fontSize;
}

function renderCanvas(name) {
    const templateConfig = getCurrentTemplate();
    const image = templateConfig.image;

    if (!image.complete) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    if (name !== "") {
        ctx.fillStyle = templateConfig.textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const finalFontSize = fitTextToWidth(name, templateConfig);
        ctx.font = `${templateConfig.fontWeight} ${finalFontSize}px ${templateConfig.fontFamily}`;

        ctx.fillText(name, templateConfig.textX, templateConfig.textY);
    }
}

nameInput.addEventListener("input", () => {
    renderCanvas(nameInput.value.trim());
});

templateRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
        currentTemplateKey = radio.value;

        templateOptions.forEach((option) => {
            option.classList.remove("active");
        });

        radio.closest(".template-option").classList.add("active");

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