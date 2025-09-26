// plan-engine.js

// Lightweight, data-driven yoga plan generator that adapts to user profiles

/**
 * Exercise Library with instructions, benefits, and suggested durations
 * Types: warmup, asana, pranayama, meditation, cooldown
 */
const EXERCISES = [
  // Warm-ups
  {
    name: "Cat-Cow",
    sanskrit: "Marjaryasana-Bitilasana",
    type: "warmup",
    goals: ["flexibility", "stress_relief", "pain_relief"],
    contraindications: [],
    instructions: [
      "Start on all fours with wrists under shoulders and knees under hips.",
      "Inhale, arch your back, lift your tailbone and chest (Cow).",
      "Exhale, round your spine, tuck your tailbone and chin (Cat).",
      "Flow smoothly with your breath."
    ],
    benefits: ["Mobilizes spine", "Warms up back and core", "Eases stress"],
    duration: { min: 2, max: 4 },
    reps: { sets: 1, perSet: 8 }
  },
  {
    name: "Sun Salutation A",
    sanskrit: "Surya Namaskar A",
    type: "warmup",
    goals: ["strength", "weight_loss", "balance"],
    contraindications: ["arthritis", "hypertension"],
    instructions: [
      "Begin standing, inhale reach arms overhead.",
      "Exhale fold forward, inhale half lift.",
      "Exhale step back to plank and lower.",
      "Inhale cobra/up-dog, exhale down-dog.",
      "Step forward, half lift, fold, rise to stand."
    ],
    benefits: ["Full-body warm-up", "Builds heat", "Improves mobility"],
    duration: { min: 3, max: 6 },
    reps: { sets: 2, perSet: 3 }
  },

  // Asanas (standing / seated / balance)
  {
    name: "Warrior II",
    sanskrit: "Virabhadrasana II",
    type: "asana",
    goals: ["strength", "weight_loss", "balance"],
    contraindications: ["arthritis", "hypertension"],
    instructions: [
      "Step feet wide, turn front toes forward, back foot slightly in.",
      "Bend front knee over ankle, arms reach parallel to floor.",
      "Gaze over front fingers, keep torso upright and strong.",
      "Press into outer edge of back foot."
    ],
    benefits: ["Strengthens legs and core", "Improves stamina", "Enhances focus"],
    duration: { min: 1, max: 2 },
    hold_time: "20-40 seconds each side"
  },
  {
    name: "Tree Pose",
    sanskrit: "Vrikshasana",
    type: "asana",
    goals: ["balance", "mindfulness", "stress_relief"],
    contraindications: ["arthritis"],
    instructions: [
      "Stand tall, shift weight to one foot.",
      "Place sole of other foot to ankle, calf, or inner thigh (avoid knee).",
      "Hands at heart or overhead, keep hips level.",
      "Gaze softly at a fixed point."
    ],
    benefits: ["Improves balance", "Strengthens legs", "Calms the mind"],
    duration: { min: 1, max: 2 },
    hold_time: "20-40 seconds each side"
  },
  {
    name: "Seated Forward Bend",
    sanskrit: "Paschimottanasana",
    type: "asana",
    goals: ["flexibility", "better_sleep", "mindfulness"],
    contraindications: ["back_pain"],
    instructions: [
      "Sit with legs extended, flex feet.",
      "Inhale lengthen spine, exhale hinge from hips to fold.",
      "Keep spine long, use strap if needed.",
      "Breathe steadily without forcing."
    ],
    benefits: ["Stretches hamstrings and back", "Soothes nervous system"],
    duration: { min: 2, max: 3 },
    hold_time: "30-60 seconds"
  },
  {
    name: "Child's Pose",
    sanskrit: "Balasana",
    type: "cooldown",
    goals: ["relaxation", "stress_relief", "pain_relief", "better_sleep"],
    contraindications: [],
    instructions: [
      "Kneel, sit back on heels, fold torso over thighs.",
      "Arms forward or by sides, relax shoulders and jaw.",
      "Breathe into back body.",
      "Use bolster or blanket as needed."
    ],
    benefits: ["Releases back and hips", "Calms mind"],
    duration: { min: 2, max: 4 }
  },
  {
    name: "Legs Up The Wall",
    sanskrit: "Viparita Karani",
    type: "cooldown",
    goals: ["relaxation", "better_sleep", "stress_relief"],
    contraindications: ["hypertension"],
    instructions: [
      "Sit sideways to a wall, swing legs up and lie back.",
      "Hips a few inches from wall, arms relaxed by sides.",
      "Soften breath and face.",
      "Exit slowly rolling to side."
    ],
    benefits: ["Relieves tired legs", "Supports relaxation"],
    duration: { min: 3, max: 6 }
  },

  // Pranayama
  {
    name: "Box Breathing",
    sanskrit: "Sama Vritti",
    type: "pranayama",
    goals: ["stress_relief", "mindfulness", "better_sleep"],
    contraindications: [],
    instructions: [
      "Inhale 4, hold 4, exhale 4, hold 4.",
      "Breathe through the nose, keep shoulders relaxed.",
      "Repeat cycles with smooth, even rhythm."
    ],
    benefits: ["Balances nervous system", "Improves focus"],
    duration: { min: 3, max: 6 }
  },
  {
    name: "Alternate Nostril Breathing",
    sanskrit: "Nadi Shodhana",
    type: "pranayama",
    goals: ["mindfulness", "stress_relief", "balance"],
    contraindications: ["sinus_congestion"],
    instructions: [
      "Right hand in Vishnu mudra: close right nostril, inhale left.",
      "Close both briefly, open right, exhale right.",
      "Inhale right, close both, exhale left. Repeat."
    ],
    benefits: ["Calms mind", "Balances hemispheres"],
    duration: { min: 3, max: 6 }
  },

  // Meditation
  {
    name: "Body Scan Meditation",
    sanskrit: "",
    type: "meditation",
    goals: ["mindfulness", "better_sleep", "stress_relief"],
    contraindications: [],
    instructions: [
      "Lie or sit comfortably, close eyes.",
      "Scan attention from toes to head slowly.",
      "Notice sensations without judgment, return to breath when distracted."
    ],
    benefits: ["Enhances awareness", "Reduces stress"],
    duration: { min: 5, max: 10 }
  },
  {
    name: "Loving-Kindness Meditation",
    sanskrit: "Metta",
    type: "meditation",
    goals: ["mindfulness", "depression", "anxiety"],
    contraindications: [],
    instructions: [
      "Sit comfortably, breathe naturally.",
      "Silently repeat phrases of goodwill for self and others.",
      "Expand circle from self to loved ones to all beings."
    ],
    benefits: ["Improves mood", "Builds compassion"],
    duration: { min: 5, max: 10 }
  }
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function pick(list, count) {
  const copy = [...list];
  const out = [];
  while (copy.length > 0 && out.length < count) {
    out.push(copy.shift());
  }
  return out;
}

function scoreByGoals(exercise, goals) {
  if (!goals || goals.length === 0) return 0;
  return goals.reduce((acc, g) => acc + (exercise.goals?.includes(g) ? 1 : 0), 0);
}

function filterByContra(profile) {
  const conditions = new Set(profile.conditions || []);
  const age = profile.age || 30;
  return (ex) => {
    if (ex.contraindications?.some(c => conditions.has(c))) return false;
    if (age < 18 && ex.name === "Warrior II") return false;
    return true;
  };
}

// Updated function to randomize durations
function computeSessionDurations(profile) {
  const fitness = (profile.fitness_level || 'beginner').toLowerCase();
  const goalSet = new Set(profile.goals || []);

  let minTotal, maxTotal;
  switch (fitness) {
    case 'low':
    case 'beginner':
      minTotal = 20;
      maxTotal = 30;
      break;
    case 'moderate':
      minTotal = 30;
      maxTotal = 40;
      break;
    case 'high':
    case 'athlete':
      minTotal = 40;
      maxTotal = 50;
      break;
    default:
      minTotal = 25;
      maxTotal = 35;
  }
  
  // Randomize the total duration within the defined range
  const total = Math.floor(Math.random() * (maxTotal - minTotal + 1)) + minTotal;

  // Use a flexible distribution based on goals
  let warmup, asana, pranayama, meditation, cooldown;
  if (goalSet.has('stress_relief') || goalSet.has('mindfulness') || goalSet.has('better_sleep')) {
    warmup = Math.round(total * 0.15);
    pranayama = Math.round(total * 0.25);
    meditation = Math.round(total * 0.15);
    asana = Math.round(total * 0.30);
    cooldown = total - (warmup + asana + pranayama + meditation);
  } else if (goalSet.has('strength') || goalSet.has('weight_loss') || goalSet.has('flexibility')) {
    warmup = Math.round(total * 0.15);
    asana = Math.round(total * 0.50);
    pranayama = Math.round(total * 0.10);
    meditation = Math.round(total * 0.10);
    cooldown = total - (warmup + asana + pranayama + meditation);
  } else {
    // Default distribution
    warmup = Math.round(total * 0.15);
    asana = Math.round(total * 0.40);
    pranayama = Math.round(total * 0.15);
    meditation = Math.round(total * 0.10);
    cooldown = total - (warmup + asana + pranayama + meditation);
  }
  
  // Ensure phases have at least a minimum duration
  warmup = Math.max(warmup, 3);
  cooldown = Math.max(cooldown, 3);
  pranayama = Math.max(pranayama, 2);
  meditation = Math.max(meditation, 2);
  asana = total - (warmup + pranayama + meditation + cooldown);

  return { total, warmup, asana, pranayama, meditation, cooldown };
}

function buildPhase(name, duration, candidates) {
  const exercises = [];
  let remaining = duration;
  const shuffledCandidates = shuffle([...candidates]); // Shuffle candidates to get a new sequence each time
  for (const ex of shuffledCandidates) {
    const target = Math.min(remaining, ex.duration?.max || 2);
    if (target <= 0) break;
    exercises.push({
      name: ex.name,
      sanskrit: ex.sanskrit || "",
      type: ex.type,
      instructions: ex.instructions || [],
      benefits: ex.benefits || [],
      recommendedDuration: Math.max(ex.duration?.min || 1, Math.min(target, ex.duration?.max || target)),
      hold_time: ex.hold_time,
      modifications: ex.modifications || undefined
    });
    remaining -= Math.max(ex.duration?.min || 1, Math.min(target, ex.duration?.max || target));
    if (remaining <= 0) break;
  }
  return { name, duration: duration - remaining, exercises };
}

function makeWeeklySchedule(profile) {
  const fitness = (profile.fitness_level || 'beginner').toLowerCase();
  const activeDays = fitness === 'high' || fitness === 'athlete' ? 6 : fitness === 'moderate' ? 5 : 4;
  const schedule = [];
  for (let i = 0; i < 7; i++) {
    const active = i < activeDays;
    // Calculate durations inside the loop to get new values for each day
    const durations = computeSessionDurations(profile);
    schedule.push({
      day: DAYS[i],
      active,
      focus: active ? (profile.goals?.[i % (profile.goals?.length || 1)] || 'balance') : 'rest',
      duration: active ? durations.total : 0
    });
  }
  // Distribute rest days towards end of week
  schedule.sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1));
  // Keep original day order in final mapping
  return DAYS.map(d => schedule.find(s => s.day === d));
}

function makeProgressionPlan(profile) {
  const fitness = (profile.fitness_level || 'beginner').toLowerCase();
  const weeks = fitness === 'high' || fitness === 'athlete' ? 8 : 6;
  return {
    timeline: `${weeks} weeks`,
    phases: [
      {
        weeks: "1-2",
        focus: "Foundation and mobility",
        goals: ["Learn safe form", "Build consistency (4 sessions/week)", "Gentle breath work"]
      },
      {
        weeks: "3-4",
        focus: "Strength and stamina",
        goals: ["Increase asana holds by 10-20%", "Add 1 set of Sun Salutations", "Longer pranayama"]
      },
      {
        weeks: weeks > 6 ? "5-6" : "5-6",
        focus: "Balance and depth",
        goals: ["Introduce single-leg balance daily", "Refine alignment", "Meditation 8-10 min"]
      },
      ...(weeks > 6 ? [{
        weeks: "7-8",
        focus: "Performance and recovery",
        goals: ["6 sessions/week, 1 full rest day", "Deload every 4th week", "Prioritize sleep and mobility"]
      }] : [])
    ]
  };
}

function makeSafetyNotes(profile) {
  const notes = [
    "Warm up for at least 5 minutes before deeper stretches.",
    "Move within a pain-free range; never force positions.",
    "Breathe through the nose and avoid breath-holding unless instructed."
  ];
  const conditions = new Set(profile.conditions || []);
  if (conditions.has('hypertension')) notes.push("Avoid long inversions like Legs Up The Wall; keep head above heart.");
  if (conditions.has('arthritis')) notes.push("Favor gentle range of motion; avoid deep knee flexion and long static holds.");
  if (conditions.has('asthma')) notes.push("Keep pranayama light and even; stop if breath feels strained.");
  if ((profile.age || 0) >= 60) notes.push("Use support (blocks/chair) to reduce balance risk; rise slowly to avoid dizziness.");
  if (profile.injuries) notes.push("Modify poses around recent injuries; consult a professional if unsure.");
  return notes;
}

function buildDailySessions(profile, weeklySchedule) {
  const sessions = {};
  const allow = filterByContra(profile);
  const goals = profile.goals || [];

  for (const day of weeklySchedule) {
    if (!day.active) {
      sessions[day.day] = { type: 'rest' };
      continue;
    }
    const durs = computeSessionDurations(profile);
    const warmups = shuffle(EXERCISES.filter(e => e.type === 'warmup' && allow(e)).sort((a,b)=>scoreByGoals(b,goals)-scoreByGoals(a,goals)));
    const asanas = shuffle(EXERCISES.filter(e => e.type === 'asana' && allow(e)).sort((a,b)=>scoreByGoals(b,goals)-scoreByGoals(a,goals)));
    const pranayamas = shuffle(EXERCISES.filter(e => e.type === 'pranayama' && allow(e)).sort((a,b)=>scoreByGoals(b,goals)-scoreByGoals(a,goals)));
    const meditations = shuffle(EXERCISES.filter(e => e.type === 'meditation' && allow(e)).sort((a,b)=>scoreByGoals(b,goals)-scoreByGoals(a,goals)));
    const cooldowns = shuffle(EXERCISES.filter(e => e.type === 'cooldown' && allow(e)).sort((a,b)=>scoreByGoals(b,goals)-scoreByGoals(a,goals)));

    const warmupPhase = buildPhase('Warm-up', durs.warmup, warmups);
    const asanaPhase = buildPhase('Asana Flow', durs.asana, asanas);
    const pranayamaPhase = buildPhase('Pranayama', durs.pranayama, pranayamas);
    const meditationPhase = buildPhase('Meditation', durs.meditation, meditations);
    const cooldownPhase = buildPhase('Cool-down', durs.cooldown, cooldowns);
    
    sessions[day.day] = {
      type: 'active',
      totalDuration: durs.total,
      phases: [warmupPhase, asanaPhase, pranayamaPhase, meditationPhase, cooldownPhase]
    };
  }
  return sessions;
}

function normalizeProfile(input) {
  const profile = { ...input };
  // map alternative keys from input.html to our internal names
  if (profile.medicalConditions && !profile.conditions) profile.conditions = profile.medicalConditions;
  if (typeof profile.yogaPurpose === 'string' && (!profile.goals || profile.goals.length === 0)) profile.goals = [profile.yogaPurpose];
  // remove "none" from conditions if combined with others
  if (Array.isArray(profile.conditions)) profile.conditions = profile.conditions.filter(c => c && c !== 'none');
  return profile;
}

function buildComprehensivePlan(rawProfile) {
  const profile = normalizeProfile(rawProfile || {});
  const weeklySchedule = makeWeeklySchedule(profile);
  const dailySessions = buildDailySessions(profile, weeklySchedule);
  const progressionPlan = makeProgressionPlan(profile);
  const safetyNotes = makeSafetyNotes(profile);
  return { weeklySchedule, dailySessions, progressionPlan, safetyNotes };
}

module.exports = { buildComprehensivePlan };