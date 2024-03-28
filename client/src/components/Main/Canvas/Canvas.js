import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import FloodFill from 'q-floodfill';

function Canvas(props) {
    
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [canDraw, setCanDraw] = useState(false);
    

    let p1 = { x: 0, y: 0 };
    let p2 = { x: 0, y: 0 };
    let drawShape = false;
    let cs;


    /* useLayoutEffect(() => {
        window.addEventListener('resize', updateSize);
        function updateSize() {
            if (window.innerWidth > 1024) {
                canvasRef.current.width = 910;
                canvasRef.current.height = 564;
            }
            else if(window.innerWidth > 768)
            {
                canvasRef.current.width = 610;
                canvasRef.current.height = 564;
            }
            else if(window.innerWidth > 324)
            {
                canvasRef.current.width = 410;
                canvasRef.current.height = 560;
            }
        }
    }, []) */


    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        /* context.scale(2, 2); */
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = props.data.color;
        // context.fillStyle = 'white';
        context.lineWidth = props.data.size;
        ctxRef.current = context;
    }, [props.data]);

    // Function to draw a circle where the user clicks
    const drawStart = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (props.mode === "floodfill") {
            let offsetX, offsetY;
            if (event.targetTouches) {
                offsetX = Math.round(event.targetTouches[0].pageX - rect.left);
                offsetY = Math.round(event.targetTouches[0].pageY - rect.top);
            } else {
                offsetX = event.nativeEvent.offsetX;
                offsetY = event.nativeEvent.offsetY;
            }
            const imgData = ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
            // Construct flood fill instance
            const floodFill = new FloodFill(imgData)
            // Modify image data
            floodFill.fill(props.data.color, offsetX, offsetY, 0)
            // put the modified data back in context
            ctxRef.current.putImageData(floodFill.imageData, 0, 0)
            return;
        }
        else if (props.mode === "circle" || props.mode === "rectangle") {
            drawShape = true;
            cs = ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
            p1.x = x;
            p1.y = y;
        }
        else {
            ctxRef.current.beginPath();
            ctxRef.current.moveTo(x, y);
            ctxRef.current.lineTo(x, y);
            // ctxRef.current.fill();
            ctxRef.current.stroke();
            setCanDraw(true);
        }
    };

    const drawEnd = (event) => {
        if (drawShape) {
            drawShape = false;
        }
        else {
            ctxRef.current.closePath();
            setCanDraw(false);
        }
    }

    const draw = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        console.log(x, " : ", y);
        if (drawShape) {
            ctxRef.current.putImageData(cs, 0, 0);
            p2.x = x;
            p2.y = y;
            ctxRef.current.beginPath();
            if (props.mode === "circle") {
                let radius = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                ctxRef.current.arc(p1.x, p1.y, radius, 0, 2 * Math.PI);
            }
            else if (props.mode === "rectangle") {
                ctxRef.current.rect(p1.x, p1.y, -(p1.x - p2.x), -(p1.y - p2.y));
            }
            ctxRef.current.stroke();
        }
        else if (canDraw) {
            ctxRef.current.lineTo(x, y);
            // ctxRef.current.fill();
            ctxRef.current.stroke();
        }
        else
            return;
    }


    return (
        <div>
            <canvas ref={canvasRef}
                onMouseDown={drawStart}
                onMouseUp={drawEnd}
                /* onMouseLeave={drawEnd} */
                onMouseMove={draw}
                width={910}
                height={564}
                style={{ backgroundColor: "pink" }} />
        </div>
    );
}

export default Canvas;

/* 
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let p1 = {x: 0, y: 0};
let p2 = {x: 0, y: 0};
let isDrawing = false;
let cs;
let rect = canvas.getBoundingClientRect();

canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    cs = ctx.getImageData(0,0,canvas.width, canvas.height);
    p1.x = e.clientX - rect.left;
    p1.y = e.clientY - rect.top;
})

canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
        ctx.putImageData(cs, 0, 0);
        p2.x = e.clientX - rect.left;
        p2.y = e.clientY - rect.top;
        ctx.beginPath();
        ctx.rect(p1.x, p1.y, -(p1.x - p2.x), -(p1.y - p2.y));
        ctx.stroke();
    }
})

window.addEventListener("mouseup", () => {
    isDrawing = false;
}) */