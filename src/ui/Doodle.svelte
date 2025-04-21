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
        let drawLine = false;

        for (let stroke of sheet.strokes) {
            if (!drawLine) {
                c.moveTo(stroke.x, stroke.y);
                c.beginPath();
                c.arc(
                    stroke.x,
                    stroke.y,
                    (stroke.style_bold ? 4 : 2) / 2,
                    0,
                    360,
                );
                c.fillStyle = getColor(stroke.style_color);
                c.fill();
                c.beginPath();
            }
            c.lineTo(stroke.x, stroke.y);
            c.lineWidth = stroke.style_bold ? 4 : 2;
            c.strokeStyle = getColor(stroke.style_color);
            c.stroke();
            // await sleep(16);
            drawLine = stroke.draw_line;
        }
    }

    $effect(() => {
        draw();
    });
</script>

<canvas bind:this={canvas} width="256" height="256"> </canvas>

<style>
    canvas {
        background: white;
    }
</style>
