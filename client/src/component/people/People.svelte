<script>
  import Avatar from "./Avatar.svelte";

  let people = [
    { url: "/assets/profiles/marmun.jpg", home: true },
    { url: "/assets/profiles/annlun.jpg", home: false }
  ];
</script>

<style>
  .wrapper {
    position: absolute;
    padding: 5px;
    width: 100%;
    left: 0px;
    bottom: 0px;
    border-top: 1px solid #00ecc6;
    background-color: #3c3c3c;
    text-align: center;
  }
</style>

<div class="wrapper">
  {#each people as person}
    <Avatar {...person} />
  {/each}
</div>
