import * as ml5 from "ml5";

// ml5 ships a built-in DoodleNet model — a "Quick, Draw!" sketch classifier
// trained on the same 345 categories the game uses as drawing prompts. The
// model weights are fetched from ml5's CDN on first use, so we cache the
// classifier promise for the lifetime of the page rather than reloading it.
let classifierPromise = null;

export const getDoodleNetClassifier = () => {
  if (!classifierPromise) {
    classifierPromise = new Promise((resolve, reject) => {
      try {
        // imageClassifier invokes its callback once the model has loaded.
        const classifier = ml5.imageClassifier("DoodleNet", (err) => {
          if (err) {
            classifierPromise = null;
            reject(err);
          } else {
            resolve(classifier);
          }
        });
        return classifier;
      } catch (err) {
        classifierPromise = null;
        reject(err);
      }
    });
  }
  return classifierPromise;
};

// Classify a canvas or image element. Returns ml5's results array, each entry
// shaped { label, confidence }, sorted by confidence descending.
export const classifyDrawing = async (inputElement) => {
  const classifier = await getDoodleNetClassifier();
  const results = await new Promise((resolve, reject) => {
    classifier.classify(inputElement, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
  return results;
};

// Turn the model's confidence for the target prompt into a 0–100 score.
// Prompt strings come straight from the Quick, Draw! label set (e.g.
// "smiley_face"), so they match DoodleNet labels after normalisation.
export const scoreDrawing = (results, targetPrompt) => {
  if (!Array.isArray(results) || results.length === 0) return 0;
  const normalizedTarget = String(targetPrompt || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  const match = results.find(
    (r) => r.label && r.label.toLowerCase() === normalizedTarget
  );
  const confidence = match ? match.confidence : 0;
  return Math.round(confidence * 100);
};

// Human-readable version of the model's top guess, for display.
export const topGuess = (results) => {
  if (!Array.isArray(results) || results.length === 0) return null;
  const top = results[0];
  return { label: String(top.label).replace(/_/g, " "), score: Math.round((top.confidence || 0) * 100) };
};
