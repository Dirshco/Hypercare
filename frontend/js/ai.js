import * as tf from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js";

let model;

export async function loadModel() {
  model = tf.sequential();
  model.add(tf.layers.dense({ units: 8, inputShape: [3], activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
  model.compile({ optimizer: "adam", loss: "binaryCrossentropy" });
}

export function predictRisk(sysAvg, variability, adherence) {
  const input = tf.tensor([[sysAvg, variability, adherence]]);
  const output = model.predict(input);
  return output.dataSync()[0];
}
