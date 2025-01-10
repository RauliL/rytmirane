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
    <div class="toolbar">
      <button
        id="play-button"
        data={{ tooltip: "Play/pause" }}
        onclick={(ev: MouseEvent) => {
          if (pattern.isPlaying) {
            pattern.stop();
            (ev.target as HTMLButtonElement).textContent = "▶️";
          } else {
            pattern.play();
            (ev.target as HTMLButtonElement).textContent = "⏸️";
          }
        }}
      >
        ▶️
      </button>
      <button data={{ tooltip: "Clear" }} onclick={() => pattern.clear()}>
        🧹
      </button>
      <label for="bpm">BPM:</label>
      <input
        type="number"
        id="bpm"
        min={1}
        max={300}
        value={DEFAULT_BPM}
        onchange={(ev: Event) => {
          pattern.tempo = (ev.target as HTMLInputElement).valueAsNumber;
        }}
      />
    </div>,
  );

  ALL_SAMPLE_NAMES.forEach((name) => {
    const container = (
      <div class="track">
        <span class="icon" data={{ tooltip: name }}>
          {getIcon(name)}
        </span>
      </div>
    );

    for (let i = 0; i < Pattern.SIZE; ++i) {
      const button = (
        <button
          class={["step", pattern.steps[name][i] ? "on" : null]
            .filter((x) => !!x)
            .join(" ")}
          data={{ index: i }}
        />
      );

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
