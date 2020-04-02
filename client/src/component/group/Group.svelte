<script>
  import { activeRoom } from "../../data";
  export let name, count, active;
  function select() {
    activeRoom.set({ name });
  }
</script>

<style>
  .wrapper {
    position: relative;
    padding: 20px;
    user-select: none;
    cursor: pointer;
  }

  .title {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.1rem;
    color: #fff;
  }

  .title.active {
    color: #00ecc6;
  }

  .subtitle {
    margin-top: 5px;
    word-spacing: -0.3em;
    font-size: 12px;
    color: #ffffff60;
  }

  .subtitle .count {
    font-weight: 600;
    color: #fff;
  }

  .arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    right: 0px;
    top: 50%;
    box-shadow: inset 2px 2px 0px 1px #00ecc6;
    transform: translate(-50%, -50%) rotateZ(135deg);
  }
</style>

<div class="wrapper" on:click={select}>
  <div class="title {active ? 'active' : ''}">{name}</div>
  <div class="subtitle">
    <span class="count">{count}</span>
    components in group
  </div>
  {#if active}
    <div class="arrow" />
  {/if}
</div>
