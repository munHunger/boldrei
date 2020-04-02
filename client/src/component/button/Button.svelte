<script>
  export let text;
  export let onClick;
  export let type;

  let status = "";

  function clicked() {
    status = "loading";
    onClick()
      .then(data => (status = "success"))
      .catch(err => (status = "error"))
      .finally(_ => setTimeout(() => (status = ""), 500));
    console.log("Clicked");
  }
</script>

<style>
  button {
    outline: none;
    border: 0;
    background: none;
    box-shadow: none;
    font-weight: 600;
    /* border-radius: 3px; */
    padding: 10px;
    cursor: pointer;
    transition: all 0.3s;
    font-family: "Cousine", monospace;
    /* box-shadow: inset 0 -4px 0px -2px #4897cd; */
  }

  .flat {
    background-color: #2081c3;
    color: #f7f9f9;
  }

  .flat.success {
    background-color: #78d5d7;
  }
  .flat.error {
    background-color: #ff5a5f;
  }
  .flat.loading {
    animation: flat-loading 0.5s ease-in-out 0s infinite alternate-reverse;
  }

  @keyframes flat-loading {
    0% {
      background-color: #71aed8;
    }
    100% {
      background-color: rgb(75, 122, 153);
    }
  }

  .link:hover,
  .outline:hover {
    box-shadow: inset 0px 0px 0px 2px #78d5d760;
  }

  .link,
  .outline {
    border-radius: 6px;
    color: #333;
  }

  .outline {
    box-shadow: inset 0px 0px 0px 2px #2081c3;
  }

  .link.success,
  .outline.success {
    box-shadow: inset 0px 0px 0px 3px rgba(0, 146, 7, 0.3);
  }

  .link.error,
  .outline.error {
    box-shadow: inset 0px 0px 0px 3px #ff5a5f60;
  }

  .link.loading,
  .outline.loading {
    animation: outline-loading 0.5s ease-in-out 0s infinite alternate-reverse;
  }

  @keyframes outline-loading {
    0% {
      box-shadow: inset 0px 0px 0px 2px #2081c360;
    }
    100% {
      box-shadow: inset 0px 0px 0px 2px #2081c3ff;
    }
  }

  button:hover {
    /* box-shadow: inset 0 -6px 0px -2px #4897cd; */
  }
</style>

<button class="{type} {status}" on:click={clicked}>{text}</button>
