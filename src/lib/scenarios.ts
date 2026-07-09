/* Live-call transcript scenarios, from "Homepage Directions" 2a. */

export interface Scenario {
  name: string;
  trade: string;
  t1: string;
  tc: string;
  t2: string;
}

export const SCENARIOS: Scenario[] = [
  {
    name: "Lauren",
    trade: "Plumber",
    t1: "You've reached Dave's Plumbing, this is Lauren. What can I get sorted for you?",
    tc: "Yeah hi — hot water system's carked it, no hot water since this morning.",
    t2: "No worries, we can sort that. What's your name and the best number to reach you on?",
  },
  {
    name: "Sarah",
    trade: "Electrician",
    t1: "You've reached Watt's Electrical, this is Sarah. Marco's up a ladder at the moment — what can I get sorted for you?",
    tc: "Half the house has lost power — the switchboard keeps tripping.",
    t2: "Righto, that sounds urgent. What's the address? I'll flag it as a priority for Marco.",
  },
  {
    name: "Jess",
    trade: "Builder",
    t1: "Hi, you've called Harbourline Building, Jess speaking. What's the project?",
    tc: "We're after a quote on a deck — about six by four metres, hardwood.",
    t2: "Lovely. What suburb are you in, and roughly when do you want it built? I'll get a site visit organised.",
  },
  {
    name: "Mel",
    trade: "Landscaper",
    t1: "G'day, Greenside Landscapes, Mel here. How can I help?",
    tc: "Storm brought a tree down on our back fence — it's flattened a whole section.",
    t2: "That's a priority job — I'm flagging it now. Give me the address and we'll get someone out today.",
  },
];

/** Rotating receptionist names for the name strip. */
export const STRIP_NAMES = [
  "Lauren",
  "Jess",
  "Bec",
  "Georgia",
  "Kate",
  "Holly",
  "Jack",
  "Drew",
  "Jason",
  "Marty",
];
