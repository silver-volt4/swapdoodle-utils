<script lang="ts">
    import type {Sheet} from "../lib/parsing/parsing";

    let canvas: HTMLCanvasElement = $state()!;

    interface Props {
        sheet: Sheet
    }

    let {
        sheet
    }: Props = $props();

    $effect(() => {
        let c = canvas.getContext("2d");
        console.log(c);
        if (!c) return;

        c.fillStyle = "black";

        let drawLine = false;

        for (let stroke of sheet.strokes) {
            if (!drawLine) {
                c.moveTo(stroke.x, stroke.y);
            }
            c.lineTo(stroke.x, stroke.y);
            c.lineWidth = stroke.style_bold ? 3 : 1;
            c.stroke();
            drawLine = stroke.draw_line;
        }
        c.stroke();
    })
</script>

<canvas bind:this={canvas} width="256" height="256">

</canvas>

<style>
    canvas {
        background: white;
    }
</style>