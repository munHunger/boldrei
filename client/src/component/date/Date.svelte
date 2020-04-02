<script>
  let date = {};
  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  function setTime() {
    let today = new Date();
    date = {
      hour: ("0" + today.getHours()).slice(-2),
      minute: ("0" + today.getMinutes()).slice(-2),
      day: today.getDate(),
      month: monthNames[today.getMonth()],
      year: today.getFullYear()
    };
    setTimeout(setTime, 60000);
  }
  setTime();
</script>

<style>
  .wrapper {
    background-color: #333;
    padding: 5px;
    font-size: 16px;
    font-family: "Cousine", monospace;
    color: #fff;
    padding: 10px;
    text-align: center;
  }
  .time {
    font-weight: 600;
  }
  .date {
    word-spacing: -0.3em;
    text-transform: uppercase;
  }
</style>

<div class="wrapper">
  <span class="time">{date.hour}:{date.minute}</span>
  <span class="date">{date.day} {date.month} {date.year}</span>
</div>
