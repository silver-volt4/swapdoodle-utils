<script lang="ts">
    import type { Sheet, Colors } from "../lib/parsing/parsing";

    let canvas: HTMLCanvasElement = $state()!;

    interface Props {
        sheet: Sheet;
        colors?: Colors;
    }

    let { sheet, colors }: Props = $props();

    function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function getColor(index: number) {
        let color = colors?.colors[index];
        if (!color) return "rgba(0,0,0,255)";
        return `rgb(${color.r} ${color.g} ${color.b})`;
    }

    async function draw() {
        let c = canvas.getContext("2d");
        if (!c) return;

        c.clearRect(0, 0, 255, 255);
        c.lineCap = "round";

        let old = {x: -1, y: -1}

        for (let stroke of sheet.strokes) {
            c.lineWidth = stroke.style_bold ? 5 : 2;
            c.strokeStyle = c.fillStyle = getColor(stroke.style_color);

            c.beginPath();
            if(old.x != -1) {
                c.moveTo(old.x, old.y);
                c.lineTo(stroke.x, stroke.y);
                c.stroke();
            }
            c.arc(
                stroke.x,
                stroke.y,
                c.lineWidth / 2,
                0,
                360,
            );
            c.fill();

            if (stroke.draw_line) {
                old.x = stroke.x;
                old.y = stroke.y;
            } else {
                old.x = -1;
            }

            // await sleep(8);
        }
    }

    $effect(() => {
        draw();
    });
</script>

<canvas bind:this={canvas} width="250" height="230"> </canvas>

<style>
    canvas {
        background: white;
        image-rendering: pixelated;
    }
</style>
