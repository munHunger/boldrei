import App from "./component/App.svelte";

var app = new App({
  target: document.body
});

import "./server";
export default app;
