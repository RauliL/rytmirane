import { Howl } from "howler";

export type SampleName = "hi-hat" | "kick" | "snare";

export const ALL_SAMPLE_NAMES: Readonly<SampleName[]> = [
  "kick",
  "hi-hat",
  "snare",
];

const kick = new Howl({ src: ["kick.mp3"] });
const hat = new Howl({ src: ["hi-hat.mp3"] });
const snare = new Howl({ src: ["snare.mp3"] });

export const play = (sample: SampleName) => {
  switch (sample) {
    case "hi-hat":
      hat.play();
      break;

    case "kick":
      kick.play();
      break;

    case "snare":
      snare.play();
      break;
  }
};

export const getIcon = (sample: SampleName): string => {
  switch (sample) {
    case "hi-hat":
      return "🎩";

    case "kick":
      return "🦶";

    case "snare":
      return "🥁";
  }
};
