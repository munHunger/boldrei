<script>
  export let name, status, health, id, progress, etaHours, etaMinutes;
</script>

<style>
  .wrapper {
    position: relative;
    padding: 30px;
    color: #fff;
  }

  .eta {
    background-color: #3c3c3c;
    position: absolute;
    right: 30px;
    top: 30px;
    font-size: 12px;
    padding: 5px;
    text-align: center;
    text-transform: uppercase;
  }
  .eta .time {
    font-size: 16px;
    font-weight: 600;
  }

  .name {
    font-size: 18px;
    font-weight: 600;
  }

  .id {
    font-size: 12px;
    letter-spacing: 0.2rem;
    color: #606060;
    margin-bottom: 10px;
  }

  .status {
    font-size: 14px;
    color: #aaa;
  }
  .status .heading {
    color: #fff;
    text-transform: uppercase;
  }

  .progress {
    position: relative;
    width: 100%;
    height: 4px;
    margin-top: 30px;
    background-color: #606060;
  }
  .progress .bar {
    position: absolute;
    width: 10%;
    height: 4px;
    left: 0px;
    top: 0px;
    background-color: #00ecc6;
  }
  .progress .bar .text {
    position: absolute;
    right: -5px;
    top: -20px;
    font-size: 12px;
    transform: translate(100%, 0);
  }
  .progress .bar .text::before {
    position: absolute;
    left: -5px;
    top: 0px;
    content: "";
    width: 1px;
    height: 20px;
    background-color: #aaa;
  }
</style>

<div class="wrapper">
  <div class="name">{name}</div>
  <div class="id">{id}</div>
  <div class="status">
    <span class="heading">Health status:</span>
    {health}
  </div>
  <div class="status">
    <span class="heading">Current status:</span>
    {status}
  </div>

  <div class="eta">
    estimated time
    <div class="time">
      {etaHours ? etaHours : '--'} H {etaMinutes ? etaMinutes : '--'} MIN
    </div>
  </div>

  <div class="progress">
    <div class="bar" style="width: {Math.floor(progress * 100)}%">
      <div class="text">
        {#if progress}{Math.floor(progress * 100)} %{:else}{status}{/if}
      </div>
    </div>
  </div>
</div>
