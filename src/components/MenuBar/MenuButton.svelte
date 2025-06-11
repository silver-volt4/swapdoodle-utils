<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";

    let thisButton: HTMLButtonElement = $state()!;

    type MenuButtonProps = {
        label: string;
        onclick?: () => any;
    };

    let {
        label,
        children,
        onclick,
        ...restProps
    }: MenuButtonProps & Omit<HTMLButtonAttributes, keyof MenuButtonProps> =
        $props();

    let superButton = $derived(children !== undefined);
    let toggled = $state(false);

    function onclickInner() {
        if (superButton) {
            toggled = !toggled;
            return;
        }
        onclick?.();
    }
</script>

<svelte:window
    onclick={(e) => {
        if (superButton && toggled && e.target != thisButton) {
            toggled = false;
        }
    }}
/>

<div class="menuButton">
    <button bind:this={thisButton} {...restProps} onclick={onclickInner}>
        {label}
    </button>
    {#if superButton}
        <div class="menuChildren depth" class:toggled>
            {@render children?.()}
        </div>
    {/if}
</div>

<style lang="scss">
    .menuButton {
        position: relative;

        button {
            font-weight: bold;
            padding: 8px;
            cursor: pointer;
            border: none;
            background: none;
            text-align: start;
        }
    }

    .menuChildren.toggled {
        height: unset;
        overflow: unset;
        opacity: 1;
    }

    .menuChildren {
        height: 0;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        left: 0;
        top: 100%;
        background-color: white;
        transition: opacity 0.2s;

        :global(button) {
            min-width: 100px;
        }
    }
</style>
