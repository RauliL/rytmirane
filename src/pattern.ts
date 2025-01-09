import { ALL_SAMPLE_NAMES, SampleName, play } from "./samples";

export const DEFAULT_BPM = 160;

export type PatternEventType = "clear" | "step";

export class Pattern {
  public static readonly SIZE = 16;

  public readonly steps: Record<SampleName, boolean[]>;
  private _tempo: number;
  private readonly eventListeners: Map<string, EventListener[]>;
  private index: number;
  private interval: ReturnType<typeof setInterval> | undefined;

  constructor() {
    this.steps = {
      kick: Array(Pattern.SIZE).fill(false),
      "hi-hat": Array(Pattern.SIZE).fill(false),
      snare: Array(Pattern.SIZE).fill(false),
    };
    this._tempo = 60000 / DEFAULT_BPM / 4;
    this.eventListeners = new Map();
    this.index = 0;
  }

  public get isPlaying(): boolean {
    return this.interval != null;
  }

  public set tempo(bpm: number) {
    this._tempo = 60000 / bpm / 4;
    if (this.isPlaying) {
      this.stop();
      this.play();
    }
  }

  public addEventListener(type: PatternEventType, listener: EventListener) {
    let list = this.eventListeners.get(type);

    if (!list) {
      list = [];
      this.eventListeners.set(type, list);
    }
    list.push(listener);
  }

  public removeEventListener(type: PatternEventType, listener: EventListener) {
    const list = this.eventListeners.get(type);

    if (list) {
      const index = list.indexOf(listener);

      if (index > -1) {
        list.splice(index, 1);
      }
    }
  }

  public dispatchEvent(event: Event) {
    this.eventListeners
      .get(event.type)
      ?.forEach((listener) => listener(event));
  }

  public clear() {
    ALL_SAMPLE_NAMES.forEach((name) => {
      this.steps[name].fill(false);
    });
    this.dispatchEvent(new CustomEvent("clear"));
  }

  public play() {
    if (this.interval) {
      return;
    }

    this.interval = setInterval(() => {
      this.dispatchEvent(
        new CustomEvent<number>("step", { detail: this.index }),
      );
      ALL_SAMPLE_NAMES.forEach((name) => {
        if (this.steps[name][this.index]) {
          play(name);
        }
      });
      this.index = this.index + 1 < Pattern.SIZE ? this.index + 1 : 0;
    }, this._tempo);
  }

  public stop() {
    if (!this.interval) {
      return;
    }

    clearTimeout(this.interval);
    delete this.interval;
  }

  public load(input: string) {
    if (input.length !== Pattern.SIZE * ALL_SAMPLE_NAMES.length) {
      throw new Error("Invalid pattern size");
    }
    ALL_SAMPLE_NAMES.forEach((name, index) => {
      for (let i = 0; i < Pattern.SIZE; ++i) {
        this.steps[name][i] =
          input[Pattern.SIZE * index + i] === "1" ? true : false;
      }
    });
  }

  public serialize(): string {
    return ALL_SAMPLE_NAMES.map((name) =>
      this.steps[name].map((value) => (value ? 1 : 0)).join(""),
    ).join("");
  }
}
