import React, { useRef, useEffect, useContext } from 'react';
import { SocketContext } from '../../../context/socket';
import FloodFill from 'q-floodfill';

function Canvas({ data, mode, roomNumber, isLead }) {
    const socket = useContext(SocketContext);
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    let canDraw = false;
    let p1 = { x: 0, y: 0 };
    let p2 = { x: 0, y: 0 };
    let cs;


    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = data.color;
        context.lineWidth = data.size;
        ctxRef.current = context;
    }, [data]);

    // Function to draw a circle where the user clicks
    const drawStart = (event) => {
        if (isLead) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            if (mode === "floodfill") {
                let offsetX, offsetY;
                if (event.targetTouches) {
                    offsetX = Math.round(event.targetTouches[0].pageX - rect.left);
                    offsetY = Math.round(event.targetTouches[0].pageY - rect.top);
                } else {
                    offsetX = event.nativeEvent.offsetX;
                    offsetY = event.nativeEvent.offsetY;
                }
                const imgData = ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
                // Construct flood fill instancel
                const floodFill = new FloodFill(imgData)
                // Modify image data
                floodFill.fill(data.color, offsetX, offsetY, 0)
                // put the modified data back in context
                ctxRef.current.putImageData(floodFill.imageData, 0, 0)
                socket.emit("send_data", ({ image: canvasRef.current.toDataURL(), roomNumber: roomNumber }))
            }
            else if (mode === "circle" || mode === "rectangle") {
                cs = ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
                p1.x = x;
                p1.y = y;
            }
            else if (mode === "brush") {
                ctxRef.current.beginPath();
                ctxRef.current.moveTo(x, y);
                ctxRef.current.lineTo(x, y);
            }
            canDraw = (true);
        }
    };



    const draw = (event) => {
        if (isLead && canDraw) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            if (mode === "circle" || mode === "rectangle") {
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
            else if (mode === "brush") {
                ctxRef.current.lineTo(x, y);
                ctxRef.current.stroke();
            }
            socket.emit("send_data", ({ image: canvasRef.current.toDataURL(), roomNumber: roomNumber }))
        }
    }

    const drawEnd = () => {
        if (isLead && canDraw) {
            ctxRef.current.closePath();
            canDraw = (false);
        }
    }

    const clearCanvas = () =>{
        ctxRef.current.clearRect(0,0,canvasRef.current.width, canvasRef.current.height);
    }

    socket.on("receive_image", ({ image }) => {
        if (!isLead) {
            console.log("client got data");
            const img = new Image();
            img.src = image;
            img.onload = function () {
                ctxRef.current.clearRect(0,0,canvasRef.current.width, canvasRef.current.height);
                ctxRef.current.drawImage(this, 0, 0, canvasRef.current.width, canvasRef.current.height);
            };
        }
    })

    socket.on("clear_canvas",()=>{
        clearCanvas();
    })



    return (
        <div>
            <canvas ref={canvasRef}
                onMouseDown={drawStart}
                onMouseUp={drawEnd}
                /* onMouseLeave={drawEnd} */
                onMouseMove={draw}
                width={910}
                height={564}
                style={{ backgroundColor: "white" }} id='canvas' />
        </div>
    );
}

export default Canvas