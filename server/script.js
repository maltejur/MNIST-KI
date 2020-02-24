var canvas = document.getElementById("cv")
var ctx = canvas.getContext("2d")
ctx.strokeStyle = 'white';

let down = false

function start(){
    down = true
    ctx.beginPath();
    enableX();
}
function stop(){
    if(down){
        down = false
        showCanvas()
    }
}

function draw(evt){
    if(down){
        var rect = canvas.getBoundingClientRect();
        //ctx.lineTo((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,(evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
        ctx.strokeStyle = 'grey';
        ctx.arc((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,(evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height,0.4,0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = 'white';
        ctx.arc((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,(evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height,0.2,0, 2 * Math.PI);
        ctx.stroke();
    }
}

function drawM(evt){
    draw(clientX=evt["touches"][0])
}

function clear(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fill();
    disableX();
    document.getElementById("output").innerHTML = ""
    document.getElementById("time").innerHTML = ""
    document.getElementById("percent").innerHTML = ""
}

function exportCanvas(){
    return canvas.toDataURL("image/png");
}

function showCanvas(){
    detectChar()
    document.getElementById("im").setAttribute("src",exportCanvas())
}

function enableX(){
    document.getElementById("xDark").setAttribute("class","")
    document.getElementById("xLight1").setAttribute("class","hidden")
    document.getElementById("xLight2").setAttribute("class","hidden")
}

function disableX(){
    document.getElementById("xDark").setAttribute("class","hidden")
    document.getElementById("xLight1").setAttribute("class","")
    document.getElementById("xLight2").setAttribute("class","")
}

async function getR(b64){
    return new Promise((resolve,reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                resolve(JSON.parse(xhr.responseText))
            }
        }
        xhr.onerror = function(){
            reject("Err")
        }
        xhr.open("POST","/server",true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({im:b64}));
    })
}

async function detectChar(){
    document.getElementById("spinner").setAttribute("class","")
    const i = await getR(exportCanvas())
    let b = [0,"-"]
    for (let ind = 0; ind < i[0].length; ind++) {
        if(i[0][ind]>b[0]){
            b[0] = i[0][ind]
            b[1] = ind
        }
        
    }
    document.getElementById("output").innerHTML = b[1]
    //document.getElementById("percent").innerHTML = (b[0]*100).toFixed(1)+"%"
    document.getElementById("time").innerHTML = (i[1]*1000).toFixed(3)+"ms"
    document.getElementById("spinner").setAttribute("class","hidden")
}

canvas.onmousedown = start
canvas.ontouchstart = start
canvas.onmouseup = stop
canvas.ontouchend = stop
canvas.onmouseleave = stop
canvas.ontouchmove = drawM
canvas.onmousemove = draw
document.getElementById("rst").onclick = clear

clear()