<script>
  import { toggleLight, setLight } from "../../server";
  export let name, auto, brightness, isOn, id;
  function toggleOn() {
    toggleLight(id);
  }

  let dom;

  let dragging = false;
  let prev;
  function startDrag(event) {
    event.stopPropagation();
    dragging = true;
  }
  function stopDrag() {
    dragging = false;
    setLight({ id, bri: Math.floor(brightness * 253 + 1) }, false);
  }
  let lastUpdate = new Date().getTime();
  function scroll(event) {
    let x = event.screenX || event.touches[0].screenX;
    if (dragging) {
      let bounding = dom.getBoundingClientRect();
      x -= bounding.left + 30;
      x /= bounding.right - bounding.left - 60;
      brightness = Math.max(0, Math.min(1, x));
      if (new Date().getTime() - lastUpdate > 1000)
        setLight({ id, bri: Math.floor(brightness * 253 + 1) }, true);
      lastUpdate = new Date().getTime();
    }
  }
</script>

<style>
  .light {
    padding: 30px;
    position: relative;
    user-select: none;
  }

  .name {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
  }

  .auto {
    position: absolute;
    text-transform: uppercase;
    word-spacing: -0.3rem;
    right: 30px;
    top: 30px;
    color: #fff;
  }

  .auto .on {
    color: #00ecc6;
    cursor: pointer;
  }

  .auto .off {
    color: #ffffff60;
    cursor: pointer;
  }

  .brightness {
    margin-top: 30px;
    position: relative;
    height: 4px;
    width: 90%;
    transition: all 0.5s;
  }
  .picker {
    position: absolute;
    top: -12px;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    border: 3px solid #494949;
    cursor: pointer;
    transition: all 0.5s;
  }
  .brightness.off,
  .off .picker {
    background-color: #606060;
  }
  .brightness.on,
  .on .picker {
    background-color: #00ecc6;
  }

  .picker .text {
    position: absolute;
    left: 30px;
    top: -15px;
    font-size: 12px;
    text-decoration: underline;
    letter-spacing: 0.1rem;
    color: #fff;
  }
</style>

<svelte:window
  on:mousemove={scroll}
  on:touchmove={scroll}
  on:mouseup={stopDrag}
  on:touchend={stopDrag} />
<div class="light" bind:this={dom}>
  <div class="name">{name}</div>
  <div class="auto">
    auto control
    <span class={auto ? 'on' : 'off'}>
      {auto ? 'on' : 'off'}
      {#if auto}&nbsp;{/if}
    </span>
  </div>

  <div class="brightness {isOn ? 'on' : 'off'}">
    <div
      class="picker"
      style="left: {brightness * 100}%"
      on:dblclick={toggleOn}
      on:mousedown={startDrag}
      on:touchstart={startDrag}>
      <div class="text">{Math.floor(brightness * 100)}%</div>
    </div>
  </div>
</div>
