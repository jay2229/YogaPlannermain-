// yoga-logic.js

// Comprehensive Pose Library
const poseLibrary = [
  // Warm-up
  { name: "Cat-Cow", type: "warm-up", duration: 2, exclusions: [] },
  { name: "Sun Salutation", type: "warm-up", duration: 5, exclusions: ["arthritis"] },
  { name: "Neck Rolls", type: "warm-up", duration: 2, exclusions: [] },

  // Standing
  { name: "Warrior II", type: "standing", duration: 3, exclusions: ["hypertension", "arthritis"] },
  { name: "Tree Pose", type: "standing", duration: 2, exclusions: ["arthritis"] },
  { name: "Triangle Pose", type: "standing", duration: 3, exclusions: ["back_pain"] },

  // Seated
  { name: "Seated Forward Bend", type: "seated", duration: 3, exclusions: ["back_pain"] },
  { name: "Butterfly Pose", type: "seated", duration: 2, exclusions: ["arthritis"] },
  { name: "Pigeon Pose", type: "seated", duration: 4, exclusions: ["arthritis", "back_pain"] },

  // Balance
  { name: "Eagle Pose", type: "standing", duration: 2, exclusions: ["arthritis"] },
  { name: "Half Moon", type: "standing", duration: 2, exclusions: ["arthritis"] },

  // Relaxation/Cool-down
  { name: "Child's Pose", type: "cool-down", duration: 3, exclusions: [] },
  { name: "Savasana", type: "cool-down", duration: 5, exclusions: [] },
  { name: "Legs Up The Wall", type: "cool-down", duration: 4, exclusions: ["hypertension"] }
];

const purposeToPeakPose = {
  flexibility: "Pigeon Pose",
  strength: "Warrior II",
  relaxation: "Child's Pose",
  balance: "Tree Pose"
};

function poseExclusions(medicalConditions = [], age) {
  // Exclude poses based on medical conditions and age
  return poseLibrary.filter(pose => {
    // Exclude poses if any exclusion matches user's medical conditions
    if (pose.exclusions.some(ex => medicalConditions.includes(ex))) return false;
    // Example: If age < 18, don't include "Warrior II" for safety
    if (pose.name === "Warrior II" && age < 18) return false;
    // For elderly, reduce intensity and exclude some balance poses
    if (age >= 60 && ["Eagle Pose", "Half Moon"].includes(pose.name)) return false;
    return true;
  });
}

function sequenceBuilder({ age, medicalConditions, yogaPurpose }) {
  const availablePoses = poseExclusions(medicalConditions, age);

  // Build sequence:
  // 1. Warm-up (always 2 poses)
  const warmups = availablePoses.filter(p => p.type === "warm-up").slice(0, 2);

  // 2. Build-up (3 poses not peak, not warm-up)
  const peakPoseName = purposeToPeakPose[yogaPurpose] || "Child's Pose";
  const peakPose = availablePoses.find(p => p.name === peakPoseName) || availablePoses.find(p => p.type === 'standing');
  const buildups = availablePoses
    .filter(p => p.type !== "warm-up" && p.name !== peakPoseName && p.type !== "cool-down")
    .slice(0, 3);

  // 3. Peak Pose
  // 4. Wind-down (2 poses of type 'cool-down')
  const winddowns = availablePoses.filter(p => p.type === "cool-down").slice(0, 2);

  // 5. Finish (always Savasana if allowed)
  const finish = availablePoses.find(p => p.name === "Savasana") ? [availablePoses.find(p => p.name === "Savasana")] : [];

  // Adjust durations for age
  function adjustDuration(duration) {
    if (age < 18) return Math.max(1, Math.round(duration * 0.7));
    if (age >= 60) return Math.max(1, Math.round(duration * 0.8));
    return duration;
  }

  const sequence = [
    ...warmups.map(p => ({ ...p, duration: adjustDuration(p.duration) })),
    ...buildups.map(p => ({ ...p, duration: adjustDuration(p.duration) })),
    { ...peakPose, duration: adjustDuration(peakPose.duration) },
    ...winddowns.map(p => ({ ...p, duration: adjustDuration(p.duration) })),
    ...finish.map(p => ({ ...p, duration: adjustDuration(p.duration) }))
  ];

  // Remove any undefined
  return { sequence: sequence.filter(Boolean) };
}

module.exports = { sequenceBuilder };