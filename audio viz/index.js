const container = document.getElementById('container');
const canvas = document.getElementById('myCanvas');
const file = document.getElementById('fileupload');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let audioSource;
let analyser;

container.addEventListener('click', function(){
    const audio1 = document.getElementById('myAudio');
    const audioContext = new AudioContext();
    audio1.play();
    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 1024; //32, 64, 128, 256, 512, 1024...
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = canvas.width * 2/bufferLength;
    let barHeight; 
    let x;

    function animate(){
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        for (let i = 0; i< bufferLength; i++){
            barHeight = dataArray[i]* 1.5; //adjust bar height here
            ctx.save();
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate(i * Math.PI * 10 / bufferLength); //Radians
            ctx.fillStyle = 'hsl(' + i * 2 +', 100%, 50%)';
            ctx.fillRect(0, 0, barWidth/2, barHeight);
            ctx.strokeStyle = 'hsl(' + i * 2 +', 100%, 50%)';
            ctx.strokeRect(0, i, barWidth, barHeight);
            x += barWidth;
            ctx.restore();
        }
        requestAnimationFrame(animate);
    }
    animate();
});
//PICK A FILE 
file.addEventListener('change', function(){
    const files = this.files;
    const audio1 = document.getElementById('myAudio');
    audio1.src = URL.createObjectURL(files[0]);
    audio1.load();
    audio1.play();
    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 512; //32, 64, 128, 256, 512, 1024...
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = canvas.width/bufferLength;
    let barHeight; 
    let x;

    function animate(){
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        //deleted for loop
        drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
        requestAnimationFrame(animate);
    }
    animate();
});

function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray){
    for (let i = 0; i < bufferLength; i++){
        barHeight = dataArray[i]; //adjust bar height here color below
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate(i * Math.PI * 2 / bufferLength);
        const red = i * barHeight/0;
        const green = i * 4;
        const blue = barHeight/2;
        ctx.fillStyle = 'rgb(' + red + green + blue +')';
        ctx.fillRect(0, 0, barWidth, barHeight);
        x += barWidth;
        ctx.restore();
    }
}

