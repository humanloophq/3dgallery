"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  AudioLines,
  Headphones,
  Pause,
  Play,
  Radio,
  Volume2,
  VolumeX,
} from "lucide-react";
import { FEATURES } from "@/lib/product";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const round = (value: number) => Math.round(value * 100) / 100;

const BARS = Array.from({ length: 72 }, (_, index) => {
  const height =
    18 +
    Math.abs(Math.sin(index * 0.52)) * 62 +
    Math.abs(Math.cos(index * 0.21)) * 18;
  return {
    height: `${round(Math.min(100, height))}%`,
    delay: `${round(-((index % 13) * 0.13))}s`,
    duration: `${round(1.35 + (index % 6) * 0.14)}s`,
  };
});

export function AudioExperience() {
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<{
    context: AudioContext;
    master: GainNode;
  } | null>(null);

  const stopAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const now = audio.context.currentTime;
    audio.master.gain.cancelScheduledValues(now);
    audio.master.gain.setTargetAtTime(0, now, 0.25);
    window.setTimeout(() => {
      void audio.context.close();
      if (audioRef.current === audio) audioRef.current = null;
    }, 900);
    setPlaying(false);
  };

  const startAudio = async () => {
    if (audioRef.current) return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.value = 0;
    master.connect(context.destination);

    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 780;
    filter.Q.value = 0.8;
    filter.connect(master);

    const frequencies = [110, 164.81, 220, 277.18, 329.63];
    frequencies.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = index % 2 === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index * 4 - 8;
      const gain = context.createGain();
      gain.gain.value = 0.055 / (index * 0.55 + 1);
      oscillator.connect(gain);
      gain.connect(filter);
      oscillator.start();

      const lfo = context.createOscillator();
      lfo.frequency.value = 0.06 + index * 0.017;
      const lfoGain = context.createGain();
      lfoGain.gain.value = 0.018;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();
    });

    // A soft, filtered noise bed for air.
    const bufferSize = context.sampleRate * 2;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < bufferSize; index += 1) {
      data[index] = (Math.random() * 2 - 1) * 0.16;
    }
    const noise = context.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const noiseFilter = context.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 620;
    noiseFilter.Q.value = 0.5;
    const noiseGain = context.createGain();
    noiseGain.gain.value = 0.018;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();

    await context.resume();
    master.gain.setTargetAtTime(0.16, context.currentTime, 1.4);
    audioRef.current = { context, master };
    setPlaying(true);
  };

  const toggleAudio = () => {
    if (playing) stopAudio();
    else void startAudio();
  };

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        void audio.context.close();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <section
      id="sound"
      data-scene="sound"
      aria-labelledby="sound-title"
      className="relative z-10 overflow-hidden py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgba(139,92,246,0.13),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-ink via-ink/60 to-transparent" />

      <div className="shell relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <p className="section-index">03 — Sound</p>
          <p className="hidden text-[0.5625rem] uppercase tracking-[0.18em] text-silver/30 sm:block">
            Adaptive acoustics · Spatial engine
          </p>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 xl:col-span-5">
            <h2
              id="sound-title"
              className="display-xl max-w-[10ch] text-gradient-silver"
            >
              A field, not a frequency.
            </h2>
            <p className="mt-6 max-w-md body-lg">
              AURA ONE does not place sound in your ears. It builds a room around
              them — stable, spacious and impossibly quiet. Eight microphones
              listen; the A1 engine answers.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={toggleAudio}
                aria-pressed={playing}
                aria-label={
                  playing
                    ? "Stop the generated AURA soundscape"
                    : "Play the generated AURA soundscape"
                }
                className="btn btn-primary"
              >
                {playing ? (
                  <Pause className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Play className="h-4 w-4" aria-hidden="true" />
                )}
                {playing ? "Stop soundscape" : "Hear the quiet"}
              </button>
              <p className="flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.16em] text-silver/35">
                {playing ? (
                  <Volume2 className="h-3.5 w-3.5 text-violet-soft" aria-hidden="true" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                Generated in your browser
              </p>
            </div>
            <p className="mt-3 max-w-sm text-[0.625rem] leading-relaxed text-silver/30">
              A short, generative ambient pad — no audio file is downloaded. Use
              headphones for the intended effect. Volume is kept low.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {[
                { value: "48 kHz", label: "Adaptive sampling" },
                { value: "6-axis", label: "Head tracking" },
                { value: "24/96", label: "Lossless path" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-display text-lg tracking-tight text-chalk md:text-xl">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[0.5rem] uppercase tracking-[0.16em] text-silver/35">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 xl:col-span-7">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-5 backdrop-blur-xl md:p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(139,92,246,0.16),transparent_62%)]" />
              <div className="relative flex items-center justify-between">
                <p className="flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.18em] text-silver/45">
                  <Radio className="h-3 w-3 text-violet-soft" aria-hidden="true" />
                  AURA spatial engine
                </p>
                <p className="text-[0.5rem] uppercase tracking-[0.18em] text-silver/25">
                  {playing ? "Live" : "Standby"}
                </p>
              </div>

              <div className="relative mt-4 flex h-[19rem] items-center justify-center md:h-[24rem]">
                <div className="absolute h-[15rem] w-[15rem] rounded-full border border-white/[0.07] md:h-[19rem] md:w-[19rem]" />
                <div className="absolute h-[11rem] w-[11rem] rounded-full border border-violet/20 md:h-[14rem] md:w-[14rem]" />
                <div className="absolute h-[7rem] w-[7rem] rounded-full border border-violet/30 md:h-[9rem] md:w-[9rem]" />
                <div
                  className={`absolute h-[16rem] w-[16rem] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(139,92,246,0.22)_80deg,transparent_160deg,transparent_360deg)] blur-xl md:h-[20rem] md:w-[20rem] ${
                    playing && !reduced ? "animate-slow-spin" : ""
                  }`}
                />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full border border-white/15 bg-ink/60 backdrop-blur-md">
                    <Headphones className="h-6 w-6 text-violet-soft" aria-hidden="true" />
                  </div>
                  <p className="mt-4 font-display text-lg tracking-tight text-chalk">
                    {playing ? "A room without walls" : "The room is quiet"}
                  </p>
                  <p className="mt-1 max-w-[14rem] text-[0.625rem] leading-relaxed text-silver/40">
                    {playing
                      ? "Spatial field active. The generated pad is playing locally."
                      : "Press play to generate a short ambient field in your browser."}
                  </p>
                </div>
              </div>

              <div
                className="relative flex h-24 items-end justify-between gap-[3px] overflow-hidden md:h-28"
                aria-hidden="true"
              >
                {BARS.map((bar, index) => (
                  <span
                    key={index}
                    className="wave-bar w-full rounded-full bg-gradient-to-t from-violet/20 via-violet/60 to-violet-soft/90"
                    style={{
                      height: bar.height,
                      animationDelay: bar.delay,
                      animationDuration: bar.duration,
                      animationPlayState: playing && !reduced ? "running" : "paused",
                      opacity: playing ? "1" : "0.35",
                    }}
                  />
                ))}
              </div>
              <div className="relative mt-3 flex items-center justify-between text-[0.5rem] uppercase tracking-[0.16em] text-silver/25">
                <span>20 Hz</span>
                <span className="flex items-center gap-1.5">
                  <AudioLines className="h-3 w-3" aria-hidden="true" />
                  {playing ? "Playing · generated locally" : "Paused"}
                </span>
                <span>44 kHz</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] sm:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((feature) => (
            <article
              key={feature.index}
              className="group relative bg-[#0b0b0f]/95 p-6 transition-colors duration-500 hover:bg-[#111116] md:p-7"
            >
              <div className="flex items-start justify-between">
                <span className="text-[0.5625rem] tracking-[0.18em] text-violet-soft/80">
                  {feature.index}
                </span>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[0.5rem] uppercase tracking-[0.14em] text-silver/40">
                  {feature.meta}
                </span>
              </div>
              <h3 className="mt-8 font-display text-xl font-medium tracking-tight text-chalk">
                {feature.title}
              </h3>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-silver/45">
                {feature.description}
              </p>
              <ArrowUpRight
                className="mt-6 h-4 w-4 text-silver/20 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-violet-soft"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>

        <figure className="mx-auto mt-20 max-w-4xl text-center">
          <blockquote className="font-display text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[1.15] tracking-tight text-silver/80">
            “Silence is not the absence of sound.
            <br />
            <span className="text-violet-soft">It is the space sound deserves.</span>”
          </blockquote>
          <figcaption className="mt-5 text-[0.5625rem] uppercase tracking-[0.22em] text-silver/30">
            AURA design principle 03
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
