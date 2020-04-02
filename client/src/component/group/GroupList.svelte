<script>
  import Group from "./Group.svelte";
  import { rooms, activeRoom } from "../../data.js";
</script>

<style>
  .top,
  .bottom {
    pointer-events: none;
    content: "";
    width: 100%;
    height: 50%;
    position: absolute;
    left: 0;
  }
  .list {
    position: absolute;
    top: 10%;
    height: 80%;
    overflow: scroll;
  }
  .list::-webkit-scrollbar {
    display: none;
  }
  /* .list .top {
    top: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0) 20%, #3c3c3c 80%);
  }
  .list .bottom {
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 20%, #3c3c3c 80%);
  } */
</style>

<div class="list">
  {#each $rooms as room}
    <Group
      name={room.name}
      count={room.lights.length}
      active={$activeRoom.name === room.name} />
  {/each}
  <!-- <div class="top" />
  <div class="bottom" /> -->
</div>
