<script>
  let track, album;
  track = "Flight 101";
  album = "Westway (The Glitter & The Slums)";
</script>

<style>
  .wrapper {
    position: relative;
    background: url("https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Stickyfingers_photo.jpg/300px-Stickyfingers_photo.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 0 10px 0 0;
  }
  .info {
    padding: 10px;
    color: #fff;
    height: 350px;
  }
  img {
    width: 250px;
    height: 250px;
  }

  .cover {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .info .content {
    position: absolute;
    top: 10px;
    left: 260px;
    background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0)
    );
    height: 250px;
  }
  .track {
    font-weight: 600;
    font-size: 24px;
    margin: 15px;
  }
  .album {
    font-size: 22px;
    margin: 15px;
  }

  .content .button {
    display: inline-block;
    margin: 15px;
    border-radius: 15px;
    padding: 5px 15px 10px 15px;
    color: #00ecc6;
    font-weight: 600;
    font-size: 20px;
    text-transform: lowercase;
    background-image: linear-gradient(to bottom, #494949, #3c3c3c);
    border: 2px solid #00ecc660;
  }

  .progress {
    display: inline-block;
    margin: 30px;
    position: relative;
    height: 4px;
    width: 50%;
    background-color: #00ecc6;
  }
  .picker {
    position: absolute;
    top: -8px;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    background-color: #00ecc6;
  }
  .button.play {
    display: inline-block;
    border-style: solid;
    box-sizing: border-box;
    border-radius: 0px;
    border-width: 10px 0px 10px 20px;
    border-color: transparent transparent transparent #fff;
  }
</style>

<div class="wrapper">
  <div class="info">
    <div class="cover">
      <img
        src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/44b23a43731725.57fae82b7e104.jpg"
        alt="Album cover" />
    </div>

    <div class="content">
      <div class="track">{track}</div>

      <div class="album">{album}</div>

      <div class="button">save</div>
    </div>
  </div>

  <div class="controls">
    <div class="button play" />
    <div class="progress">
      <div class="picker" />
    </div>
  </div>
</div>
