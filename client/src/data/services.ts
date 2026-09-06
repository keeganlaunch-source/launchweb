export interface Service {
  id: string;
  title: string;
  summary: string;
  description: string;
  schedule?: string;
  pricing: string[];
  firstSessionFree?: boolean;
}

export const services: Service[] = [
  {
    id: "personal-training",
    title: "Private Personal Training",
    summary: "One-on-one coaching at your home, estate or outdoors in Ballito.",
    description: "One-on-one coaching at your home, estate or outdoors in Ballito. Every session designed around you.",
    pricing: ["30 min — R300", "45 min — R350", "60 min — R400"],
    firstSessionFree: true
  },
  {
    id: "partner-training",
    title: "Partner & Small-Group Training",
    summary: "Train with friends, family, a partner or colleagues — same coaching, split between you.",
    description: "Train with friends, family, a partner or colleagues. Same coaching, same attention, split between you.",
    pricing: ["Rates on enquiry"],
    firstSessionFree: true
  },
  {
    id: "group-fitness",
    title: "Outdoor Group Fitness Classes",
    summary: "Sugar Rush Park, Ballito. All levels, real community.",
    description: "Sugar Rush Park, Ballito. All levels welcome, real community.",
    schedule: "Monday, Wednesday & Friday at 5AM",
    pricing: ["R800/month — unlimited"],
    firstSessionFree: true
  },
  {
    id: "kids-coaching",
    title: "Kids & Youth Coaching",
    summary: "From age 5 — movement, coordination, confidence and discipline.",
    description: "From age 5. Movement, coordination, confidence and discipline.",
    pricing: ["From R300/session"],
    firstSessionFree: true
  },
  {
    id: "kids-mtb",
    title: "Kids Mountain Biking",
    summary: "Tuesdays, under 12s — a full hour on the trails.",
    description: "A full hour of mountain biking for kids under 12.",
    schedule: "Tuesdays, 2:30PM, 1 hour · Under 12s",
    pricing: ["R350/month", "Bundled with Kids Sports Academy: R600/month"]
  },
  {
    id: "kids-sports-academy",
    title: "Kids Sports Academy",
    summary: "A different sport every week, plus mobility, core and athletic development.",
    description: "A different sport each week, plus mobility, core, motor skills and athletic development.",
    schedule: "Thursdays, 3:30PM, 1 hour",
    pricing: ["R350/month", "Bundled with Kids Mountain Biking: R600/month"]
  },
  {
    id: "neurodiverse-coaching",
    title: "Neurodiverse Specialist Coaching",
    summary: "Accredited 1-on-1 coaching for Autism Spectrum, ADHD, sensory processing and more.",
    description: "Accredited one-on-one coaching for Autism Spectrum, ADHD, sensory processing and more. One of the only certified coaches in KZN.",
    pricing: ["From R300/session"],
    firstSessionFree: true
  },
  {
    id: "strength-longevity",
    title: "Strength & Longevity Coaching",
    summary: "For every age and stage — older adults, rehab and post-injury training.",
    description: "For every age and stage, including older adults, rehab and post-injury training. Any condition, any starting point.",
    pricing: ["Rates on enquiry"],
    firstSessionFree: true
  }
];

export const appService: Service = {
  id: "app",
  title: "The Launch Lifestyle App",
  summary: "Hundreds of coach-built workouts. Train anywhere in the world.",
  description: "Hundreds of workouts, every one built by a coach. Filter by your equipment: full gym, limited kit, bodyweight, rehab, kids. Train anywhere in the world.",
  pricing: ["R300/month", "7-day free trial"]
};
