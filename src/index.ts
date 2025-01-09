import "./style.css";

import p from "pakertaja";

import { DEFAULT_BPM, Pattern } from "./pattern";
import { ALL_SAMPLE_NAMES, getIcon, play } from "./samples";

window.addEventListener("load", () => {
  const pattern = new Pattern();
  const root = document.querySelector("#root") as HTMLDivElement;

  if (window.location.hash.length > 0) {
    pattern.load(window.location.hash.substring(1));
  }

  p.append(
    root,
    p.div(
      { class: "toolbar" },
      p.button("▶️", {
        id: "play-button",
        "data-tooltip": "Play/pause",
        onclick: function () {
          if (pattern.isPlaying) {
            pattern.stop();
            Reflect.set(this, "textContent", "▶️");
          } else {
            pattern.play();
            Reflect.set(this, "textContent", "⏸️");
          }
        },
      }),
      p.button("🧹", {
        "data-tooltip": "Clear",
        onclick: function () {
          pattern.clear();
        },
      }),
      p.span("BPM:"),
      p.input({
        type: "number",
        min: 1,
        max: 300,
        value: DEFAULT_BPM,
        onchange: function () {
          pattern.tempo = Reflect.get(this, "valueAsNumber");
        },
      }),
    ),
  );

  ALL_SAMPLE_NAMES.forEach((name) => {
    const container = p.div(
      p.span(getIcon(name), { class: "icon", "data-tooltip": name }),
      {
        class: "track",
      },
    );

    for (let i = 0; i < Pattern.SIZE; ++i) {
      const button = p.button({ class: "step", "data-index": i });

      if (pattern.steps[name][i]) {
        button.classList.add("on");
      }
      button.addEventListener("click", () => {
        if (pattern.steps[name][i]) {
          pattern.steps[name][i] = false;
          button.classList.remove("on");
        } else {
          pattern.steps[name][i] = true;
          if (!pattern.isPlaying) {
            play(name);
          }
          button.classList.add("on");
        }
        window.location.hash = pattern.serialize();
      });
      p.append(container, button);
    }
    p.append(root, container);
  });

  pattern.addEventListener("step", (event: CustomEventInit<number>) => {
    const index = event.detail;

    document
      .querySelectorAll(`.step`)
      .forEach((step) => step.classList.remove("active"));
    document
      .querySelectorAll(`.step[data-index="${index}"]`)
      .forEach((step) => step.classList.add("active"));
  });

  pattern.addEventListener("clear", () => {
    window.location.hash = "";
    document
      .querySelectorAll(`.step`)
      .forEach((step) => step.classList.remove("on"));
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === " ") {
      event.preventDefault();
      document.getElementById("play-button")?.click();
    }
  });
});
