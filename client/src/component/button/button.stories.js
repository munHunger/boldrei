import Button from "./Button.stories.svelte";

import { action } from "@storybook/addon-actions";
import { withKnobs, text, boolean, number } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/svelte";

const defaultProps = () => ({
  text: "Click me!",
  type: "NORMAL"
});

storiesOf("Button", module)
  .addDecorator(withKnobs)
  .add("success", () => ({
    Component: Button,
    props: {
      props: {
        ...defaultProps(),
        onClick: () =>
          new Promise((resolve, reject) => resolve(action("clicked")()))
      }
    }
  }))
  .add("fail", () => ({
    Component: Button,
    props: {
      props: {
        ...defaultProps(),
        onClick: () =>
          new Promise((resolve, reject) => reject(action("clicked")()))
      }
    }
  }))
  .add("delay", () => ({
    Component: Button,
    props: {
      props: {
        ...defaultProps(),
        onClick: () =>
          new Promise((resolve, reject) =>
            setTimeout(() => resolve(action("clicked")()), 3000)
          )
      }
    }
  }));
