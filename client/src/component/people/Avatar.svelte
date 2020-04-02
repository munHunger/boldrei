<script>
  export let url, home;
</script>

<style>
  .avatar {
    display: inline-block;
    border-radius: 100%;
    overflow: hidden;
    margin-top: 4px;
    border: 2px solid #00ecc6;
    width: 40px;
    height: 40px;
    margin-left: 20px;
    margin-right: 20px;
    transition: 0.5s all;
  }
  .avatar.away {
    position: relative;
    border: 2px solid #666;
  }
  .avatar.away::after {
    position: absolute;
    left: 0px;
    top: 0px;
    content: "";
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.2);
  }
  img {
    width: 100%;
    height: 100%;
  }
</style>

<div class="avatar {home ? '' : 'away'}" on:click={() => (home = !home)}>
  <img src={url} alt="avatar" />
</div>
