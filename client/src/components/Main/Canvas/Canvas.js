import React, { useRef, useEffect, useContext } from 'react';
import { SocketContext } from '../../../context/socket'
import FloodFill from 'q-floodfill';

function Canvas({ data, mode, roomNumber, isLead }) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const socket = useContext(SocketContext);
    // const [canDraw, setCanDraw] = useState(false);
    let canDraw = false;
    function setCanDraw(value) {
        canDraw = value;
    }
    // const [coord, setCoord] = useState({x: Number, y: Number});
    let coord = { x: Number, y: Number };

    function setCoord({ x, y }) {
        coord.x = x;
        coord.y = y;
    }
    let p1 = { x: 0, y: 0 };
    let p2 = { x: 0, y: 0 };
    let drawShape = false;
    let cs;

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        /* context.scale(2, 2); */
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = data.color;
        // context.fillStyle = 'white';
        context.lineWidth = data.size;
        ctxRef.current = context;
    }, [data]);

    socket.on("draw_start_client", ({ xCoord, yCoord }) => {
        const rect = canvasRef.current.getBoundingClientRect();
        //console.log(xCoord - rect.left," ", yCoord - rect.top);
        setCoord({ x: xCoord - rect.left, y: yCoord - rect.top });
        drawStart();
    })

    socket.on("draw_client", ({ xCoord, yCoord }) => {
        const rect = canvasRef.current.getBoundingClientRect();
        //console.log(xCoord - rect.left," ", yCoord - rect.top);
        setCoord({ x: xCoord - rect.left, y: yCoord - rect.top });
        draw();
    })

    socket.on("draw_end_client", () => {
        drawEnd();
    })

    const preDrawStart = (event) => {
        /* const rect = canvasRef.current.getBoundingClientRect();
        setCoord({x: event.clientX - rect.left, y: event.clientY - rect.top});
        drawStart(); */
        if (isLead)
        {
            socket.emit("draw_start", ({ x: event.clientX, y: event.clientY, roomNumber: roomNumber }));
        }
    }

    const preDraw = (event) => {
        /* const rect = canvasRef.current.getBoundingClientRect();
        setCoord({x: event.clientX - rect.left, y: event.clientY - rect.top});
        draw(); */
        if (isLead) {
            socket.emit("draw", ({ x: event.clientX, y: event.clientY, roomNumber: roomNumber }));
        }
    }

    const preDrawEnd = () => {
        if (isLead) {
            socket.emit("draw_end", ({ roomNumber }));
        }
    }

    // Function to draw a circle where the user clicks
    const drawStart = () => {
        const x = coord.x;
        const y = coord.y;
        if (mode === "floodfill") {
            const imgData = ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
            // Construct flood fill instance
            const floodFill = new FloodFill(imgData)
            // Modify image data
            floodFill.fill(data.color, x, y, 0)
            // put the modified data back in context
            ctxRef.current.putImageData(floodFill.imageData, 0, 0)
            return;
        }
        else if (mode === "circle" || mode === "rectangle") {
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

    const drawEnd = () => {
        console.log("drawEnd");
        if (drawShape) {
            drawShape = false;
        }
        else {
            ctxRef.current.closePath();
            setCanDraw(false);
        }
    }

    const draw = () => {
        const x = coord.x;
        const y = coord.y;
        if (drawShape) {
            ctxRef.current.putImageData(cs, 0, 0);
            p2.x = x;
            p2.y = y;
            ctxRef.current.beginPath();
            if (mode === "circle") {
                let radius = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                ctxRef.current.arc(p1.x, p1.y, radius, 0, 2 * Math.PI);
            }
            else if (mode === "rectangle") {
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
                onMouseDown={preDrawStart}
                onMouseUp={preDrawEnd}
                //onMouseLeave={drawEnd}
                //onMouseOut={preDrawEnd}
                onMouseMove={preDraw}
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