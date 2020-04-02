<script>
  import Button from "./Button.svelte";
  export let props;
</script>

<Button {...props} type="link" />
<Button {...props} type="outline" />
<Button {...props} type="flat" />
