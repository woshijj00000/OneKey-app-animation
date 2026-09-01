import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';

const sampleRate = 48000;

const clamp = (value) => Math.max(-1, Math.min(1, value));

const writeWav = (path, left, right = left) => {
  const frameCount = Math.min(left.length, right.length);
  const dataSize = frameCount * 4;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(2, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 4, 28);
  buffer.writeUInt16LE(4, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let index = 0; index < frameCount; index++) {
    buffer.writeInt16LE(Math.round(clamp(left[index]) * 32767), 44 + index * 4);
    buffer.writeInt16LE(Math.round(clamp(right[index]) * 32767), 46 + index * 4);
  }

  mkdirSync(dirname(path), {recursive: true});
  writeFileSync(path, buffer);
};

let randomState = 0x1a2b3c4d;
const random = () => {
  randomState = (1664525 * randomState + 1013904223) >>> 0;
  return randomState / 0xffffffff;
};

const clickDuration = 0.18;
const clickFrames = Math.round(clickDuration * sampleRate);
const clickLeft = new Float32Array(clickFrames);
const clickRight = new Float32Array(clickFrames);
for (let index = 0; index < clickFrames; index++) {
  const t = index / sampleRate;
  const envelope = Math.exp(-35 * t);
  const tone = Math.sin(2 * Math.PI * 920 * t) * 0.26 + Math.sin(2 * Math.PI * 1540 * t) * 0.12;
  const transient = (random() * 2 - 1) * Math.exp(-85 * t) * 0.09;
  clickLeft[index] = (tone + transient) * envelope;
  clickRight[index] = (tone - transient * 0.45) * envelope;
}

const logoDuration = 1.35;
const logoFrames = Math.round(logoDuration * sampleRate);
const logoLeft = new Float32Array(logoFrames);
const logoRight = new Float32Array(logoFrames);
let smoothNoise = 0;
for (let index = 0; index < logoFrames; index++) {
  const t = index / sampleRate;
  const whooshEnvelope = Math.sin(Math.PI * Math.min(1, t / 0.72)) ** 1.6 * Math.exp(-1.25 * t);
  const rawNoise = random() * 2 - 1;
  smoothNoise += (rawNoise - smoothNoise) * (0.015 + t * 0.02);
  const sweepFrequency = 210 + 530 * Math.min(1, t / 0.65) ** 1.5;
  const sweep = Math.sin(2 * Math.PI * sweepFrequency * t) * 0.08;
  const chimeTime = Math.max(0, t - 0.24);
  const chimeEnvelope = t < 0.24 ? 0 : Math.exp(-2.9 * chimeTime) * Math.min(1, chimeTime * 14);
  const chime = (Math.sin(2 * Math.PI * 659.25 * chimeTime) * 0.13 + Math.sin(2 * Math.PI * 987.77 * chimeTime) * 0.07) * chimeEnvelope;
  logoLeft[index] = smoothNoise * whooshEnvelope * 0.16 + sweep * whooshEnvelope + chime;
  logoRight[index] = smoothNoise * whooshEnvelope * 0.14 + sweep * whooshEnvelope * 0.9 + chime * 1.08;
}

const bedDuration = 11;
const bedFrames = Math.round(bedDuration * sampleRate);
const bedLeft = new Float32Array(bedFrames);
const bedRight = new Float32Array(bedFrames);
const chords = [
  [130.81, 164.81, 196, 246.94],
  [110, 130.81, 164.81, 196],
  [87.31, 110, 130.81, 164.81],
  [98, 123.47, 146.83, 196],
];

for (let index = 0; index < bedFrames; index++) {
  const t = index / sampleRate;
  const chordIndex = Math.min(chords.length - 1, Math.floor(t / 2.75));
  const chord = chords[chordIndex];
  const chordTime = t - chordIndex * 2.75;
  const edgeFade = Math.min(1, t / 0.9, (bedDuration - t) / 1.1);
  const swell = 0.72 + 0.28 * Math.sin(Math.PI * Math.min(1, chordTime / 2.75));
  let left = 0;
  let right = 0;

  chord.forEach((frequency, toneIndex) => {
    const detune = 1 + (toneIndex - 1.5) * 0.0018;
    const phase = 2 * Math.PI * frequency * detune * t;
    const body = Math.sin(phase) + Math.sin(phase * 2) * 0.12;
    const amplitude = 0.021 * edgeFade * swell / (1 + toneIndex * 0.2);
    const pan = (toneIndex - 1.5) / 3;
    left += body * amplitude * (1 - pan * 0.25);
    right += body * amplitude * (1 + pan * 0.25);
  });

  const pulsePosition = (t % 1.375) / 1.375;
  const pulseEnvelope = Math.exp(-7.5 * pulsePosition) * edgeFade;
  const pulseFrequency = chord[1] * 2;
  const pulse = Math.sin(2 * Math.PI * pulseFrequency * t) * 0.018 * pulseEnvelope;
  bedLeft[index] = left + pulse;
  bedRight[index] = right + pulse * 0.92;
}

const dynamicDuration = 11;
const dynamicFrames = Math.round(dynamicDuration * sampleRate);
const dynamicLeft = new Float32Array(dynamicFrames);
const dynamicRight = new Float32Array(dynamicFrames);
const bpm = 112;
const beatDuration = 60 / bpm;
const dynamicChords = [
  [130.81, 164.81, 196, 246.94],
  [110, 130.81, 164.81, 196],
  [87.31, 110, 130.81, 164.81],
  [98, 123.47, 146.83, 196],
];
let previousNoise = 0;

for (let index = 0; index < dynamicFrames; index++) {
  const t = index / sampleRate;
  const beat = t / beatDuration;
  const beatIndex = Math.floor(beat);
  const beatPhase = beat - beatIndex;
  const eighth = beat * 2;
  const eighthIndex = Math.floor(eighth);
  const eighthPhase = eighth - eighthIndex;
  const barIndex = Math.floor(beatIndex / 4);
  const chord = dynamicChords[barIndex % dynamicChords.length];
  const root = chord[0] / 2;
  const edgeFade = Math.max(0, Math.min(1, t / 0.55, (dynamicDuration - t) / 1.25));

  const kickEnvelope = Math.exp(-15 * beatPhase);
  const kickFrequency = 46 + 58 * Math.exp(-18 * beatPhase);
  const kick = Math.sin(2 * Math.PI * kickFrequency * beatPhase * beatDuration) * kickEnvelope * 0.115;

  const clapBeat = beatIndex % 4 === 1 || beatIndex % 4 === 3;
  const rawNoise = random() * 2 - 1;
  const highNoise = rawNoise - previousNoise * 0.7;
  previousNoise = rawNoise;
  const clap = clapBeat ? highNoise * Math.exp(-24 * beatPhase) * 0.026 : 0;
  const hat = highNoise * Math.exp(-38 * eighthPhase) * (eighthIndex % 2 === 1 ? 0.018 : 0.009);

  const bassEnvelope = Math.exp(-5.8 * eighthPhase);
  const bassFrequency = eighthIndex % 4 === 3 ? root * 1.5 : root;
  const bass =
    (Math.sin(2 * Math.PI * bassFrequency * t) + Math.sin(2 * Math.PI * bassFrequency * 2 * t) * 0.16) *
    bassEnvelope *
    0.047;

  const arpFrequency = chord[eighthIndex % chord.length] * 2;
  const arpEnvelope = Math.exp(-7.5 * eighthPhase);
  const arp =
    (Math.sin(2 * Math.PI * arpFrequency * t) + Math.sin(2 * Math.PI * arpFrequency * 2 * t) * 0.2) *
    arpEnvelope *
    0.021;

  const sidechain = 0.58 + 0.42 * Math.min(1, beatPhase * 5.5);
  let padLeft = 0;
  let padRight = 0;
  chord.forEach((frequency, toneIndex) => {
    const phase = 2 * Math.PI * frequency * t;
    const tone = Math.sin(phase) + Math.sin(phase * 2) * 0.1;
    const pan = (toneIndex - 1.5) / 3;
    padLeft += tone * 0.013 * (1 - pan * 0.3);
    padRight += tone * 0.013 * (1 + pan * 0.3);
  });

  const stereoPulse = Math.sin(2 * Math.PI * 0.18 * t) * 0.09;
  dynamicLeft[index] = (kick + clap * 0.94 + hat * 0.82 + bass + arp * (1 - stereoPulse) + padLeft * sidechain) * edgeFade;
  dynamicRight[index] = (kick * 0.98 + clap * 1.06 + hat + bass * 0.96 + arp * (1 + stereoPulse) + padRight * sidechain) * edgeFade;
}

const audioDir = resolve('public/audio');
writeWav(resolve(audioDir, 'ui-click.wav'), clickLeft, clickRight);
writeWav(resolve(audioDir, 'logo-reveal.wav'), logoLeft, logoRight);
writeWav(resolve(audioDir, 'ambient-bed.wav'), bedLeft, bedRight);
writeWav(resolve(audioDir, 'dynamic-bed.wav'), dynamicLeft, dynamicRight);

console.log(`Generated audio assets in ${audioDir}`);
