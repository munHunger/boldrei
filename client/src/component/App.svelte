<script>
  import Date from "./date/Date.svelte";
  import GroupList from "./group/GroupList.svelte";
  import Light from "./light/Light.svelte";
  import Roomba from "./cleaning/Roomba.svelte";
  import Spotify from "./media/Spotify.svelte";
  import People from "./people/People.svelte";

  import { activeRoom } from "../data";
</script>

<style>
  .container {
    position: absolute;
    background-color: #494949;
    border-radius: 10px;
    left: 50%;
    top: 50%;
    width: 780px;
    height: 460px;
    transform: translate(-50%, -50%);
    overflow: hidden;
  }
  .sidebar {
    border-radius: 10px 0px 0px 10px;
    position: absolute;
    background-color: #3c3c3c;
    width: 25%;
    height: 100%;
    left: 0%;
  }
  .content {
    position: absolute;
    width: 75%;
    height: 100%;
    left: 25%;
    overflow: scroll;
  }
  .content::-webkit-scrollbar {
    display: none;
  }
</style>

<div class="container">
  <div class="sidebar">
    <Date />
    <GroupList />
  </div>
  <div class="content">
    {#each $activeRoom.lights || [] as light}
      <Light
        id={light.id}
        name={light.name}
        auto={true}
        brightness={light.bri ? light.bri / 254 : light.on ? 1 : 0}
        isOn={light.on} />
    {/each}
    <!-- <Light name="Ceiling light" auto={true} brightness={0.34} isOn={true} />
    <Light name="Floor light" auto={false} brightness={0.14} isOn={false} /> -->
    <Roomba
      name="Roomba"
      status="Cleaning"
      health="Healthy"
      id="R9 8465"
      progress={0.8}
      etaHours={0}
      etaMinutes={15} />
    <!-- <Spotify /> -->
  </div>
  <People />
</div>
