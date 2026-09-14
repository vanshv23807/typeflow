import { TestMode } from '../types';

export interface LevelTier {
  id: number;
  name: string;
  minLevel: number;
  maxLevel: number;
  color: string;
  bg: string;
  border: string;
  icon: string;
  description: string;
}

export interface LevelInfo {
  level: number;
  mode: TestMode;
  title: string;
  tier: LevelTier;
  benchmarkWpm: number;
  targetAccuracy: number;
  description: string;
  content: string;
  author?: string;
}

export const LEVEL_TIERS: LevelTier[] = [
  {
    id: 1,
    name: 'Novice Ground',
    minLevel: 1,
    maxLevel: 10,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: '🌱',
    description: 'Foundational keys, 2-4 letter words, zero punctuation stress'
  },
  {
    id: 2,
    name: 'Apprentice Rhythm',
    minLevel: 11,
    maxLevel: 20,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/30',
    icon: '⚡',
    description: 'Smooth rhythm, 4-6 letter common vocabulary and basic capitalizations'
  },
  {
    id: 3,
    name: 'Adept Flow',
    minLevel: 21,
    maxLevel: 30,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    icon: '🌊',
    description: 'Sentence transitions, light punctuation (commas, periods) and fluid pacing'
  },
  {
    id: 4,
    name: 'Skilled Velocity',
    minLevel: 31,
    maxLevel: 40,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: '🎯',
    description: 'Prefixes, suffixes, apostrophes (contractions), and higher velocity cadence'
  },
  {
    id: 5,
    name: 'Specialist Agility',
    minLevel: 41,
    maxLevel: 50,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    icon: '⚔️',
    description: 'Compound words, hyphenated phrases, numbers, and technical vocabulary'
  },
  {
    id: 6,
    name: 'Expert Precision',
    minLevel: 51,
    maxLevel: 60,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    icon: '🔮',
    description: 'Rich academic prose, quotation marks, semicolons, and code structures'
  },
  {
    id: 7,
    name: 'Master Endurance',
    minLevel: 61,
    maxLevel: 70,
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/30',
    icon: '💎',
    description: 'Multisyllabic cadence, rapid symbol switching, and dense literature'
  },
  {
    id: 8,
    name: 'Grandmaster Intensity',
    minLevel: 71,
    maxLevel: 80,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: '🏆',
    description: 'Philosophical treatises, TypeScript generics, and intense punctuation'
  },
  {
    id: 9,
    name: 'Legendary Apex',
    minLevel: 81,
    maxLevel: 90,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    icon: '🔥',
    description: 'Rare vocabulary, complex algorithmic logic, and high-frequency symbol shifts'
  },
  {
    id: 10,
    name: 'Omniscient Transcendent',
    minLevel: 91,
    maxLevel: 100,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: '👑',
    description: 'Ultimate gauntlet: sesquipedalian vocabulary, system calls, regex, and peak velocity'
  }
];

export function getTierForLevel(level: number): LevelTier {
  const bounded = Math.max(1, Math.min(100, level));
  return LEVEL_TIERS.find(t => bounded >= t.minLevel && bounded <= t.maxLevel) || LEVEL_TIERS[0];
}

export function getBenchmarkWpm(level: number): number {
  return Math.round(20 + (Math.max(1, Math.min(100, level)) - 1) * 1.15);
}

// 100 Curated Quote Snippets from Level 1 to 100
const QUOTE_LEVELS: { title: string; author: string; content: string }[] = [
  // Levels 1-10: Novice (Short, clean, punchy)
  { title: "Simplicity", author: "Edsger W. Dijkstra", content: "Simplicity is prerequisite for reliability." },
  { title: "Stay Foolish", author: "Steve Jobs", content: "Stay hungry, stay foolish. Never settle." },
  { title: "Do or Do Not", author: "Yoda", content: "Do or do not. There is no try." },
  { title: "Light", author: "Aristotle", content: "It is during our darkest moments that we must focus to see the light." },
  { title: "The Present", author: "Marcus Aurelius", content: "Dwell on the beauty of life. Watch the stars, and see yourself running with them." },
  { title: "Beginning", author: "Lao Tzu", content: "A journey of a thousand miles begins with a single step." },
  { title: "Perseverance", author: "Confucius", content: "It does not matter how slowly you go as long as you do not stop." },
  { title: "Knowledge", author: "Francis Bacon", content: "Knowledge itself is power." },
  { title: "Courage", author: "Winston Churchill", content: "Success is not final, failure is not fatal: it is the courage to continue that counts." },
  { title: "Action", author: "Leonardo da Vinci", content: "Knowing is not enough; we must apply. Being willing is not enough; we must do." },

  // Levels 11-20: Apprentice
  { title: "Curiosity", author: "Albert Einstein", content: "I have no special talents. I am only passionately curious about everything in this world." },
  { title: "Vision", author: "Jonathan Swift", content: "Vision is the art of seeing what is invisible to others." },
  { title: "Habit", author: "Will Durant", content: "We are what we repeatedly do. Excellence, then, is not an act, but a habit." },
  { title: "Learning", author: "B.B. King", content: "The beautiful thing about learning is that no one can take it away from you." },
  { title: "Peace of Mind", author: "Seneca", content: "True happiness is to enjoy the present, without anxious dependence upon the future." },
  { title: "Discovery", author: "Marcel Proust", content: "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes." },
  { title: "Imagination", author: "George Bernard Shaw", content: "Imagination is the beginning of creation. You imagine what you desire, you will what you imagine." },
  { title: "Art of Living", author: "Epictetus", content: "First say to yourself what you would be; and then do what you have to do." },
  { title: "Potential", author: "Henry David Thoreau", content: "Go confidently in the direction of your dreams. Live the life you have imagined." },
  { title: "Resilience", author: "Helen Keller", content: "Although the world is full of suffering, it is also full of the overcoming of it." },

  // Levels 21-30: Adept
  { title: "The Cosmos", author: "Carl Sagan", content: "The cosmos is within us. We are made of star-stuff. We are a way for the cosmos to know itself." },
  { title: "Science & Wonder", author: "Richard Feynman", content: "I would rather have questions that cannot be answered than answers that cannot be questioned." },
  { title: "The Mind", author: "Ralph Waldo Emerson", content: "What lies behind us and what lies before us are tiny matters compared to what lies within us." },
  { title: "Character", author: "Heraclitus", content: "Day by day, what you choose, what you think and what you do is who you become." },
  { title: "Freedom", author: "Viktor Frankl", content: "Everything can be taken from a person but one thing: the last of the human freedoms—to choose one's attitude in any given set of circumstances." },
  { title: "The Open Road", author: "Walt Whitman", content: "Afoot and light-hearted I take to the open road, healthy, free, the world before me, the long brown path before me leading wherever I choose." },
  { title: "Striving", author: "Theodore Roosevelt", content: "It is not the critic who counts; not the man who points out how the strong man stumbles, or where the doer of deeds could have done them better." },
  { title: "Curiosity & Truth", author: "Marie Curie", content: "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less." },
  { title: "Creation", author: "Ada Lovelace", content: "The Analytical Engine weaves algebraical patterns just as the Jacquard-loom weaves flowers and leaves." },
  { title: "Logic & Nature", author: "Alan Turing", content: "We can only see a short distance ahead, but we can see plenty there that needs to be done." },

  // Levels 31-40: Skilled
  { title: "The Woods", author: "Robert Frost", content: "Two roads diverged in a wood, and I—I took the one less traveled by, and that has made all the difference." },
  { title: "Invictus", author: "William Ernest Henley", content: "It matters not how strait the gate, how charged with punishments the scroll, I am the master of my fate, I am the captain of my soul." },
  { title: " Walden", author: "Henry David Thoreau", content: "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach." },
  { title: "Self-Reliance", author: "Ralph Waldo Emerson", content: "Trust thyself: every heart vibrates to that iron string. Accept the place the divine providence has found for you, the society of your contemporaries, the connection of events." },
  { title: "On Time", author: "Seneca", content: "It is not that we have a short time to live, but that we waste a lot of it. Life is long enough, and a sufficiently generous estimate has been given to us." },
  { title: "Meditation", author: "Marcus Aurelius", content: "When you arise in the morning think of what a privilege it is to be alive, to think, to enjoy, to love." },
  { title: "Perception", author: "William Blake", content: "If the doors of perception were cleansed every thing would appear to man as it is, Infinite." },
  { title: "Truth & Art", author: "John Keats", content: "Beauty is truth, truth beauty,—that is all ye know on earth, and all ye need to know." },
  { title: "The River", author: "Hermann Hesse", content: "The river is everywhere at the same time, at the source and at the mouth, at the waterfall, at the ferry, at the current, in the ocean and in the mountains." },
  { title: "Socrates' Inquiry", author: "Plato", content: "The unexamined life is not worth living for a human being; to know oneself is the beginning of all wisdom and virtue." },

  // Levels 41-50: Specialist
  { title: "A Tale of Two Cities", author: "Charles Dickens", content: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity." },
  { title: "Moby Dick", author: "Herman Melville", content: "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world." },
  { title: "Pride & Prejudice", author: "Jane Austen", content: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood." },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", content: "So we beat on, boats against the current, borne back ceaselessly into the past. He looked at her the way all women want to be looked at by a man." },
  { title: "1984", author: "George Orwell", content: "It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors." },
  { title: "Brave New World", author: "Aldous Huxley", content: "Words can be like X-rays if you use them properly—they'll go through anything. You read and you're pierced. That's one of the things I try to teach my students." },
  { title: "Frankenstein", author: "Mary Shelley", content: "Beware; for I am fearless, and therefore powerful. I will watch with the wiliness of a snake, that I may sting with its venom. Man, you may hate me, but beware your hours of rest." },
  { title: "Crime and Punishment", author: "Fyodor Dostoevsky", content: "Pain and suffering are always inevitable for a large intelligence and a deep heart. The really great men must, I think, have great sadness on earth." },
  { title: "The Picture of Dorian Gray", author: "Oscar Wilde", content: "The books that the world calls immoral are books that show the world its own shame. Behind every exquisite thing that existed, there was something tragic." },
  { title: "To the Lighthouse", author: "Virginia Woolf", content: "What is the meaning of life? That was all—a simple question that would press upon one with the years. The great revelation had never come. The great revelation perhaps never came." },

  // Levels 51-60: Expert
  { title: "Beyond Good and Evil", author: "Friedrich Nietzsche", content: "Whoever fights monsters should see to it that in the process he does not become a monster. And if you gaze long enough into an abyss, the abyss will gaze back into you." },
  { title: "The Republic", author: "Plato", content: "The society we have described can never grow into a reality or see the light of day, and there will be no end to the troubles of states, till philosophers become kings in this world." },
  { title: "Critique of Pure Reason", author: "Immanuel Kant", content: "All our knowledge begins with the senses, proceeds then to the understanding, and ends with reason. There is nothing higher than reason." },
  { title: "The Myth of Sisyphus", author: "Albert Camus", content: "One must imagine Sisyphus happy. The struggle itself toward the heights is enough to fill a man's heart. He concludes that all is well." },
  { title: "Origin of Species", author: "Charles Darwin", content: "There is grandeur in this view of life, with its several powers, having been originally breathed into a few forms or into one; and that, whilst this planet has gone cycling on according to the fixed law of gravity, from so simple a beginning endless forms most beautiful and most wonderful have been, and are being, evolved." },
  { title: "Special Relativity", author: "Albert Einstein", content: "The laws of electrodynamics as well as of mechanics are identical in all inertial systems; therefore absolute rest does not exist in nature." },
  { title: "The Demon-Haunted World", author: "Carl Sagan", content: "Science is more than a body of knowledge; it is a way of thinking. I have a foreboding of an America in my children's or grandchildren's time—when the United States is a service and information economy." },
  { title: "QED & Light", author: "Richard Feynman", content: "Nature permits us to calculate only probabilities. Yet science has not collapsed! We have found the theory to be magnificent and utterly astonishing in its mathematical exactitude." },
  { title: "A Brief History of Time", author: "Stephen Hawking", content: "If we find the answer to that, it would be the ultimate triumph of human reason—for then we would know the mind of God." },
  { title: "Computing Machinery", author: "Alan Turing", content: "The idea behind digital computers may be explained by saying that these machines are intended to carry out any operations which could be done by a human computer." },

  // Levels 61-70: Master
  { title: "Hamlet's Soliloquy", author: "William Shakespeare", content: "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them." },
  { title: "Paradise Lost", author: "John Milton", content: "The mind is its own place, and in itself can make a heaven of hell, a hell of heaven. What though the field be lost? All is not lost; the unconquerable will, and study of revenge, immortal hate." },
  { title: "Divine Comedy: Inferno", author: "Dante Alighieri", content: "Through me you pass into the city of woe: through me you pass into eternal pain: through me among the people lost for aye. All hope abandon, ye who enter here." },
  { title: "The Brothers Karamazov", author: "Fyodor Dostoevsky", content: "The mystery of human existence lies not in just staying alive, but in finding something to live for. Without a firm idea of himself and the purpose of his life, man cannot live, and would sooner destroy himself than remain on earth." },
  { title: "Faust", author: "Johann Wolfgang von Goethe", content: "Two souls, alas! reside within my breast, and each withdraws from and contends with each: one with robust love of life clutches the world with all its limbs; the other fiercely mounts from dust to the high ancestral spheres." },
  { title: "War and Peace", author: "Leo Tolstoy", content: "Everything I know, I know because of love. Man lives consciously for himself, but is an unconscious instrument in the attainment of the historic, universal, aims of humanity." },
  { title: "Les Misérables", author: "Victor Hugo", content: "To love or have loved, that is enough. Ask nothing further. There is no other pearl to be found in the dark folds of life. The future has several names: for the weak, it is the impossible; for the fainthearted, it is the unknown; for the valiant, it is the ideal." },
  { title: "Don Quixote", author: "Miguel de Cervantes", content: "When life itself seems lunatic, who knows where madness lies? Perhaps to be too practical is madness. To surrender dreams—this may be madness. Too much sanity may be madness—and maddest of all: to see life as it is, and not as it should be!" },
  { title: "The Odyssey", author: "Homer", content: "Sing to me of the man, Muse, the man of twists and turns driven time and again off course, once he had plundered the hallowed heights of Troy. Many cities of men he saw and learned their minds, many pains he suffered, heartsick on the open sea." },
  { title: "Meditations Book IV", author: "Marcus Aurelius", content: "Time is a sort of river of passing events, and strong is its current; no sooner is a thing brought to sight than it is swept by and another takes its place, and this too will be swept away. All that is harmonious to thee, O Universe, is harmonious to me." },

  // Levels 71-80: Grandmaster
  { title: "Tractatus Logico-Philosophicus", author: "Ludwig Wittgenstein", content: "Whereof one cannot speak, thereof one must be silent. The world is everything that is the case. The world is the totality of facts, not of things. The facts in logical space are the world." },
  { title: "Being and Time", author: "Martin Heidegger", content: "Dasein is an entity which does not just occur among other entities. Rather it is ontically distinguished by the fact that, in its very Being, that Being is an issue for it." },
  { title: "Phenomenology of Spirit", author: "G.W.F. Hegel", content: "The true is the whole. The whole, however, is merely the essential nature reaching its completeness through the process of its own development. Of the Absolute it must be said that it is essentially a result." },
  { title: "Ethics: Proposition VII", author: "Baruch Spinoza", content: "Existence belongs to the nature of substances. A substance cannot be produced by anything else: it will therefore be its own cause; that is, its essence necessarily involves existence, or existence belongs to its nature." },
  { title: "Monadology", author: "Gottfried Wilhelm Leibniz", content: "The Monad, of which we will speak here, is nothing else than a simple substance, which enters into composites: 'simple' meaning having no parts. And there must be simple substances, since there are composites." },
  { title: "The Prince", author: "Niccolò Machiavelli", content: "Hence it comes that all armed prophets have been victorious, and all unarmed prophets have been destroyed. Because the nature of peoples is fickle, and it is easy to persuade them of something, but difficult to keep them in that persuasion." },
  { title: "Leviathan", author: "Thomas Hobbes", content: "In such condition there is no place for industry, because the fruit thereof is uncertain, and consequently no culture of the earth; no navigation... and the life of man, solitary, poor, nasty, brutish, and short." },
  { title: "The Social Contract", author: "Jean-Jacques Rousseau", content: "Man was born free, and he is everywhere in chains. Those who think themselves the masters of others are indeed greater slaves than they. How did this transformation come about? I do not know. What can make it legitimate? That question I think I can answer." },
  { title: "An Essay Concerning Human Understanding", author: "John Locke", content: "Let us then suppose the mind to be, as we say, white paper, void of all characters, without any ideas:—How comes it to be furnished? Whence comes it by that vast store which the busy and boundless fancy of man has painted on it? To this I answer, in one word, from EXPERIENCE." },
  { title: "Discourse on Method", author: "René Descartes", content: "Je pense, donc je suis (I think, therefore I am). Examining attentively what I was, and seeing that I could feign that I had no body and that there was no world nor any place where I was, I concluded that I was a substance whose whole essence or nature is to think." },

  // Levels 81-90: Legendary
  { title: "Ulysses: Proteus", author: "James Joyce", content: "Ineluctable modality of the visible: at least that if no more, thought through my eyes. Signatures of all things I am here to read, seaspawn and seawrack, the nearing tide, that rusty boot. Snotgreen, bluesilver, rust: coloured signs. Limits of the diaphane." },
  { title: "The Waste Land", author: "T.S. Eliot", content: "April is the cruellest month, breeding lilacs out of the dead land, mixing memory and desire, stirring dull roots with spring rain. Winter kept us warm, covering earth in forgetful snow, feeding a little life with dried tubers." },
  { title: "In Search of Lost Time: Combray", author: "Marcel Proust", content: "And suddenly the memory revealed itself. The taste was that of the little crumb of madeleine which on Sunday mornings at Combray, when I went to say good morning to her in her bedroom, my aunt Léonie used to give me, dipping it first in her cup of tea." },
  { title: "The Sound and the Fury", author: "William Faulkner", content: "When the shadow of the sash appeared on the curtains it was between seven and eight o'clock and then I was in time again, hearing the watch. It was Grandfather's and when Father gave it to me he said I give you the mausoleum of all hope and desire." },
  { title: "Absalom, Absalom!", author: "William Faulkner", content: "From a little after two o'clock until almost sundown of the long still hot weary dead September afternoon they sat in what Miss Coldfield still called the office because her father had called it that—a dim hot airless room with the blinds drawn." },
  { title: "Heart of Darkness", author: "Joseph Conrad", content: "The mind of man is capable of anything—because everything is in it, all the past as well as all the future. What was there after all? Joy, fear, sorrow, devotion, valour, rage—who can tell?—but truth—truth stripped of its cloak of time." },
  { title: "The Metamorphosis", author: "Franz Kafka", content: "As Gregor Samsa awoke one morning from uneasy dreams he found himself transformed in his bed into an enormous insect. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arched stiffeners." },
  { title: "The Trial", author: "Franz Kafka", content: "Someone must have slandered Josef K., for one morning, without having done anything truly wrong, he was arrested. Everyday life went on around him, yet an incomprehensible bureaucratic apparatus tightened its inscrutable grip upon his existence." },
  { title: "Steppenwolf", author: "Hermann Hesse", content: "He was a Steppenwolf, a beast of the steppes, who had strayed into the towns and the life of the herd—no other image could describe so vividly his shy loneliness, his savagery, his restlessness, his homesickness, his lack of a homeland." },
  { title: "The Magic Mountain", author: "Thomas Mann", content: "Space, like time, engenders forgetfulness; but it does so by setting us lofty distances from our customary surroundings, by lifting us out of our relationships and transporting us into a state of pristine freedom." },

  // Levels 91-100: Omniscient (Transcendent Complexity & Grandmaster Prose)
  { title: "Finnegans Wake: Riverrun", author: "James Joyce", content: "riverrun, past Eve and Adam's, from swerve of shore to bend of bay, brings us by a commodius vicus of recirculation back to Howth Castle and Environs. Sir Tristram, violer d'amores, fr'over the short sea, had passencore rearrived from North Armorica on this side the scraggy isthmus." },
  { title: "Principia Mathematica", author: "Alfred North Whitehead & Bertrand Russell", content: "*54·43. From this proposition it will follow, when arithmetical addition has been defined, that 1 + 1 = 2. The above proof is occasionally useful in demonstrating the formal independence of fundamental primitive propositions." },
  { title: "Gödel's Incompleteness", author: "Kurt Gödel", content: "To every ω-consistent recursive class κ of formulae there correspond recursive class-signs r, such that neither v Gen r nor Neg(v Gen r) belongs to Flg(κ) (where v is the free variable of r). Consequently, mathematics contains statements that are true but unprovable." },
  { title: "Cybernetics & Feedback", author: "Norbert Wiener", content: "Information is information, not matter or energy. No materialism which does not admit this can survive at the present day. Feedback is a method of controlling a system by reinserting into it the results of its past performance." },
  { title: "A Mathematical Theory of Communication", author: "Claude Shannon", content: "The fundamental problem of communication is that of reproducing at one point either exactly or approximately a message selected at another point. The system has an entropy H = -Σ p_i log_2(p_i) measuring average information." },
  { title: "The General Theory of Relativity", author: "Albert Einstein", content: "G_{μν} + Λ g_{μν} = (8πG / c^4) T_{μν}. Spacetime curvature tells matter how to move; matter tells spacetime how to curve through the stress-energy tensor in non-Euclidean differential Riemannian geometry." },
  { title: "Quantum Electrodynamics", author: "Paul Dirac", content: "The wave function ψ satisfies (i ħ γ^μ ∂_μ - m c) ψ = 0, uniting quantum mechanics with special relativity, predicting antimatter positrons through negative-energy solutions in four-component spinor space." },
  { title: "Universal Computation", author: "Alan M. Turing", content: "An a-machine is supplied with a tape running through it, divided into sections called squares, each capable of bearing a symbol. If an operation is computable, it can be simulated by a universal machine within finite steps." },
  { title: "The Architecture of Complexity", author: "Herbert A. Simon", content: "Hierarchic systems have some common properties independent of their specific content. In hierarchical evolutionary systems, complex structures will evolve much more rapidly if there are stable intermediate subassemblies." },
  { title: "The Transcendent Finale", author: "Ludwig Boltzmann", content: "Available energy is the main object at stake in the struggle for existence and the evolution of the world. S = k · log W: the entropy of the cosmos increases irrevocably, tracing the thermodynamic arrow of time to eternity." }
];

// 100 Curated Code Snippets from Level 1 to 100
const CODE_LEVELS: { title: string; language: string; content: string }[] = [
  // Levels 1-10: Novice (Variables, primitives, basic math)
  { title: "Variable Declaration", language: "JavaScript", content: "let count = 0;\nconst maxCount = 100;" },
  { title: "String Literal", language: "TypeScript", content: "const appName: string = \"TypeFlow\";" },
  { title: "Basic Arithmetic", language: "JavaScript", content: "let sum = a + b;\nlet diff = a - b;" },
  { title: "Boolean Flags", language: "TypeScript", content: "const isRunning: boolean = true;\nlet isPaused = false;" },
  { title: "Console Log", language: "JavaScript", content: "console.log(\"Telemetry initialized successfully\");" },
  { title: "Array of Numbers", language: "TypeScript", content: "const scores: number[] = [10, 20, 30, 40, 50];" },
  { title: "Object Literal", language: "JavaScript", content: "const player = { username: \"Keystroke\", rank: 1 };" },
  { title: "Template String", language: "JavaScript", content: "const greeting = `Welcome back, ${user.name}!`;" },
  { title: "Increment Operator", language: "JavaScript", content: "count += 1;\nactiveUsers++;" },
  { title: "Simple Comparison", language: "TypeScript", content: "const hasPassed = testScore >= 70 && accuracy >= 95;" },

  // Levels 11-20: Apprentice (Conditionals, loops, simple functions)
  { title: "If-Else Branching", language: "JavaScript", content: "if (speed > 100) {\n  tier = \"Legendary\";\n} else {\n  tier = \"Standard\";\n}" },
  { title: "For Loop Iteration", language: "JavaScript", content: "for (let i = 0; i < items.length; i++) {\n  total += items[i];\n}" },
  { title: "Arrow Function", language: "TypeScript", content: "const multiply = (x: number, y: number): number => x * y;" },
  { title: "Array Push & Pop", language: "JavaScript", content: "history.push(currentResult);\nconst last = history.pop();" },
  { title: "Ternary Operator", language: "TypeScript", content: "const status = isActive ? \"ONLINE\" : \"OFFLINE\";" },
  { title: "While Loop", language: "JavaScript", content: "while (remainingSeconds > 0) {\n  tick();\n  remainingSeconds--;\n}" },
  { title: "Switch Case", language: "JavaScript", content: "switch (mode) {\n  case \"time\": return 30;\n  case \"words\": return 25;\n  default: return 60;\n}" },
  { title: "Array Join", language: "JavaScript", content: "const sentence = words.join(\" \");" },
  { title: "Math Round & Floor", language: "JavaScript", content: "const netWpm = Math.max(0, Math.round((chars / 5) / minutes));" },
  { title: "Object Property Access", language: "TypeScript", content: "const { wpm, accuracy, durationSeconds } = testResult;" },

  // Levels 21-30: Adept (Array pipelines, higher order functions)
  { title: "Array Map", language: "TypeScript", content: "const doubled = numbers.map((n: number) => n * 2);" },
  { title: "Array Filter", language: "TypeScript", content: "const activePlayers = players.filter(p => p.wpm >= 60);" },
  { title: "Array Reduce", language: "TypeScript", content: "const totalScore = scores.reduce((acc, curr) => acc + curr, 0);" },
  { title: "String Split & Filter", language: "JavaScript", content: "const wordList = text.trim().split(/\\s+/).filter(Boolean);" },
  { title: "Object Spread", language: "TypeScript", content: "const updatedUser = { ...user, xp: user.xp + 150, level: 2 };" },
  { title: "Array Slice & Splice", language: "JavaScript", content: "const topThree = leaderboard.slice(0, 3);" },
  { title: "Optional Chaining", language: "TypeScript", content: "const bestScore = user?.stats?.bestWpm ?? 0;" },
  { title: "Nullish Coalescing", language: "TypeScript", content: "const configLimit = customLimit ?? defaultLimit ?? 50;" },
  { title: "Function Default Parameters", language: "TypeScript", content: "function createRoom(name = \"Public Lobby\", maxPlayers = 5) { return { name, maxPlayers }; }" },
  { title: "Set for Unique Values", language: "TypeScript", content: "const uniqueTags = Array.from(new Set(tags));" },

  // Levels 31-40: Skilled (DOM, timing, custom types)
  { title: "SetTimeout Timer", language: "JavaScript", content: "const timer = setTimeout(() => { finalizeRound(); }, 1000);" },
  { title: "SetInterval Clock", language: "JavaScript", content: "const interval = setInterval(() => setSeconds(s => s + 1), 1000);" },
  { title: "TypeScript Interface", language: "TypeScript", content: "interface Racer {\n  id: string;\n  name: string;\n  wpm: number;\n  progress: number;\n}" },
  { title: "TypeScript Type Union", language: "TypeScript", content: "type Status = \"idle\" | \"running\" | \"paused\" | \"completed\";" },
  { title: "CSS In JS Object", language: "CSS", content: "display: flex; justify-content: space-between; align-items: center; gap: 1rem;" },
  { title: "Window Event Listener", language: "JavaScript", content: "window.addEventListener(\"keydown\", (e) => {\n  if (e.key === \"Tab\") e.preventDefault();\n});" },
  { title: "Local Storage Read/Write", language: "JavaScript", content: "localStorage.setItem(\"high_score\", JSON.stringify({ wpm: 124 }));" },
  { title: "Promise Instantiation", language: "TypeScript", content: "const sleep = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));" },
  { title: "Date Formatting", language: "JavaScript", content: "const timestamp = new Date().toISOString().slice(0, 19).replace(\"T\", \" \");" },
  { title: "Regex Test Pattern", language: "JavaScript", content: "const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/.test(email);" },

  // Levels 41-50: Specialist (Async, Fetch, React Patterns)
  { title: "Async / Await Fetch", language: "TypeScript", content: "async function getLeaderboard(): Promise<Racer[]> {\n  const res = await fetch(\"/api/leaderboard\");\n  return res.json();\n}" },
  { title: "Try / Catch / Finally", language: "TypeScript", content: "try {\n  await syncTelemetry();\n} catch (err) {\n  console.error(\"Sync failed:\", err);\n} finally {\n  setIsLoading(false);\n}" },
  { title: "React useState Hook", language: "TypeScript", content: "const [wpm, setWpm] = useState<number>(0);\nconst [active, setActive] = useState<boolean>(false);" },
  { title: "React useEffect Hook", language: "TypeScript", content: "useEffect(() => {\n  const token = localStorage.getItem(\"auth_token\");\n  if (token) verifySession(token);\n}, []);" },
  { title: "React useRef Hook", language: "TypeScript", content: "const inputRef = useRef<HTMLInputElement | null>(null);\nuseEffect(() => { inputRef.current?.focus(); }, []);" },
  { title: "Express Route POST", language: "TypeScript", content: "router.post(\"/test/submit\", async (req: Request, res: Response) => {\n  const { wpm, accuracy } = req.body;\n  res.json({ success: true, rank: 1 });\n});" },
  { title: "Express Middleware", language: "TypeScript", content: "const authMiddleware = (req: Request, res: Response, next: NextFunction) => {\n  if (!req.headers.authorization) return res.status(401).json({ error: \"Unauthorized\" });\n  next();\n};" },
  { title: "Python List Comprehension", language: "Python", content: "high_scores = [p['wpm'] for p in players if p['accuracy'] >= 95]" },
  { title: "Python Dict Sorting", language: "Python", content: "sorted_players = sorted(players, key=lambda x: (-x['wpm'], -x['accuracy']))" },
  { title: "SQL SELECT & JOIN", language: "SQL", content: "SELECT u.username, t.wpm, t.accuracy FROM tests t JOIN users u ON t.user_id = u.id ORDER BY t.wpm DESC LIMIT 10;" },

  // Levels 51-60: Expert (Custom Hooks, Reducers, Socket.io)
  { title: "Custom React Hook", language: "TypeScript", content: "export function useDebounce<T>(value: T, delay: number): T {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const id = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(id);\n  }, [value, delay]);\n  return debounced;\n}" },
  { title: "React useReducer", language: "TypeScript", content: "function reducer(state: State, action: Action): State {\n  switch (action.type) {\n    case \"KEYSTROKE\": return { ...state, chars: state.chars + 1 };\n    case \"RESET\": return initialState;\n    default: return state;\n  }\n}" },
  { title: "Socket.IO Client Emit", language: "TypeScript", content: "socket.emit(\"race:progress\", { roomId, progress: percent, currentWpm: wpm });" },
  { title: "Socket.IO Server Listen", language: "TypeScript", content: "io.on(\"connection\", (socket) => {\n  socket.on(\"join_room\", (roomCode) => socket.join(roomCode));\n});" },
  { title: "Promise.all Pipeline", language: "TypeScript", content: "const [profile, history, leaderboard] = await Promise.all([\n  api.getProfile(),\n  api.getHistory(),\n  api.getTopScores()\n]);" },
  { title: "Web Audio Oscillator", language: "JavaScript", content: "const osc = audioCtx.createOscillator();\nconst gain = audioCtx.createGain();\nosc.connect(gain);\ngain.connect(audioCtx.destination);\nosc.start();\nosc.stop(audioCtx.currentTime + 0.05);" },
  { title: "HTML Canvas Drawing", language: "JavaScript", content: "ctx.clearRect(0, 0, width, height);\nctx.fillStyle = \"#06b6d4\";\nctx.fillRect(x, y, 40, 20);" },
  { title: "CSS Keyframe Animation", language: "CSS", content: "@keyframes pulseGlow {\n  0%, 100% { transform: scale(1); opacity: 0.8; }\n  50% { transform: scale(1.05); opacity: 1; }\n}" },
  { title: "Generic Interface", language: "TypeScript", content: "interface ApiResponse<T> {\n  status: 200 | 400 | 404 | 500;\n  data: T;\n  message?: string;\n}" },
  { title: "Type Narrowing Guard", language: "TypeScript", content: "function isRacer(entity: any): entity is Racer {\n  return typeof entity?.wpm === \"number\" && typeof entity?.id === \"string\";\n}" },

  // Levels 61-70: Master (Data Structures & Complex Logic)
  { title: "Binary Search Algorithm", language: "TypeScript", content: "function binarySearch(arr: number[], target: number): number {\n  let l = 0, r = arr.length - 1;\n  while (l <= r) {\n    const m = (l + r) >> 1;\n    if (arr[m] === target) return m;\n    if (arr[m] < target) l = m + 1; else r = m - 1;\n  }\n  return -1;\n}" },
  { title: "Queue Implementation", language: "TypeScript", content: "class Queue<T> {\n  private items: T[] = [];\n  enqueue(item: T): void { this.items.push(item); }\n  dequeue(): T | undefined { return this.items.shift(); }\n  size(): number { return this.items.length; }\n}" },
  { title: "Stack Implementation", language: "TypeScript", content: "class Stack<T> {\n  private stack: T[] = [];\n  push(val: T) { this.stack.push(val); }\n  pop(): T | undefined { return this.stack.pop(); }\n  peek(): T | undefined { return this.stack[this.stack.length - 1]; }\n}" },
  { title: "Depth First Search Tree", language: "TypeScript", content: "function dfs(node: TreeNode | null, visit: (val: number) => void): void {\n  if (!node) return;\n  visit(node.val);\n  dfs(node.left, visit);\n  dfs(node.right, visit);\n}" },
  { title: "Levenshtein Distance", language: "TypeScript", content: "function editDistance(s1: string, s2: string): number {\n  const dp: number[][] = Array.from({ length: s1.length + 1 }, () => Array(s2.length + 1).fill(0));\n  for (let i = 0; i <= s1.length; i++) dp[i][0] = i;\n  for (let j = 0; j <= s2.length; j++) dp[0][j] = j;\n  return dp[s1.length][s2.length];\n}" },
  { title: "Memoization Decorator", language: "TypeScript", content: "function memoize<T extends (...args: any[]) => any>(fn: T): T {\n  const cache = new Map<string, any>();\n  return ((...args: any[]) => {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn(...args);\n    cache.set(key, result);\n    return result;\n  }) as T;\n}" },
  { title: "Currying Function", language: "TypeScript", content: "const curry = (fn: Function) => (...args: any[]) => args.length >= fn.length ? fn(...args) : (...next: any[]) => curry(fn)(...args, ...next);" },
  { title: "Event Emitter Class", language: "TypeScript", content: "class SimpleEmitter {\n  private handlers = new Map<string, Function[]>();\n  on(e: string, fn: Function) { (this.handlers.get(e) ?? this.handlers.set(e, []).get(e)!).push(fn); }\n  emit(e: string, ...args: any[]) { this.handlers.get(e)?.forEach(fn => fn(...args)); }\n}" },
  { title: "Observable Pattern", language: "TypeScript", content: "class Subject<T> {\n  private observers: ((val: T) => void)[] = [];\n  subscribe(fn: (val: T) => void) { this.observers.push(fn); }\n  next(val: T) { this.observers.forEach(o => o(val)); }\n}" },
  { title: "Immutable State Update", language: "TypeScript", content: "const updateGrid = (matrix: number[][], r: number, c: number, v: number): number[][] => matrix.map((row, ri) => ri === r ? row.map((cell, ci) => ci === c ? v : cell) : row);" },

  // Levels 71-80: Grandmaster (TypeScript Advanced Types, Generics & Monads)
  { title: "Deep Partial Utility", language: "TypeScript", content: "type DeepPartial<T> = T extends Function ? T : T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;" },
  { title: "Deep Readonly Utility", language: "TypeScript", content: "type DeepReadonly<T> = { readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]; };" },
  { title: "Conditional Return Type", language: "TypeScript", content: "type InferReturn<T> = T extends (...args: any[]) => infer R ? R : never;" },
  { title: "Discriminated Union Handler", language: "TypeScript", content: "type Action = { type: \"LOGIN\"; user: User } | { type: \"LOGOUT\" } | { type: \"SYNC\"; count: number };\nfunction handle(a: Action) {\n  switch (a.type) {\n    case \"LOGIN\": return a.user.username;\n    case \"LOGOUT\": return null;\n    case \"SYNC\": return a.count;\n  }\n}" },
  { title: "Maybe Monad", language: "TypeScript", content: "class Maybe<T> {\n  private constructor(private val: T | null) {}\n  static of<T>(v: T | null) { return new Maybe(v); }\n  map<U>(fn: (v: T) => U): Maybe<U> { return this.val === null ? Maybe.of<U>(null) : Maybe.of(fn(this.val)); }\n}" },
  { title: "Bitwise Permissions Bitmask", language: "TypeScript", content: "const READ = 1 << 0, WRITE = 1 << 1, EXEC = 1 << 2;\nconst hasWrite = (perms: number) => (perms & WRITE) === WRITE;\nconst grantExec = (perms: number) => perms | EXEC;" },
  { title: "Linked List Reversal", language: "TypeScript", content: "function reverseList(head: ListNode | null): ListNode | null {\n  let prev: ListNode | null = null, curr = head;\n  while (curr) { const nxt = curr.next; curr.next = prev; prev = curr; curr = nxt; }\n  return prev;\n}" },
  { title: "QuickSort Partition", language: "TypeScript", content: "function partition(arr: number[], lo: number, hi: number): number {\n  const pivot = arr[hi]; let i = lo;\n  for (let j = lo; j < hi; j++) { if (arr[j] < pivot) { [arr[i], arr[j]] = [arr[j], arr[i]]; i++; } }\n  [arr[i], arr[hi]] = [arr[hi], arr[i]];\n  return i;\n}" },
  { title: "Trie Node Insertion", language: "TypeScript", content: "class TrieNode {\n  children = new Map<string, TrieNode>();\n  isEnd = false;\n  insert(word: string): void {\n    let node: TrieNode = this;\n    for (const ch of word) { if (!node.children.has(ch)) node.children.set(ch, new TrieNode()); node = node.children.get(ch)!; }\n    node.isEnd = true;\n  }\n}" },
  { title: "LRU Cache Replacement", language: "TypeScript", content: "class LRUCache<K, V> {\n  private cache = new Map<K, V>();\n  constructor(private capacity: number) {}\n  get(k: K): V | undefined { if (!this.cache.has(k)) return; const val = this.cache.get(k)!; this.cache.delete(k); this.cache.set(k, val); return val; }\n  put(k: K, v: V) { if (this.cache.has(k)) this.cache.delete(k); else if (this.cache.size >= this.capacity) this.cache.delete(this.cache.keys().next().value!); this.cache.set(k, v); }\n}" },

  // Levels 81-90: Legendary (Complex Parsing, Matrix Ops & State Engines)
  { title: "Regex Tokenizer Parser", language: "TypeScript", content: "const TOKEN_REGEX = /\\s*(?:(\\d+)|([+\\-*/()])|([a-zA-Z_]\\w*))/g;\nfunction* tokenize(code: string) {\n  let match;\n  while ((match = TOKEN_REGEX.exec(code)) !== null) {\n    if (match[1]) yield { type: \"NUM\", val: Number(match[1]) };\n    else if (match[2]) yield { type: \"OP\", val: match[2] };\n  }\n}" },
  { title: "Matrix Multiplication", language: "TypeScript", content: "function multiplyMatrices(A: number[][], B: number[][]): number[][] {\n  return A.map(rowA => B[0].map((_, c) => rowA.reduce((sum, val, r) => sum + val * B[r][c], 0)));\n}" },
  { title: "Finite State Machine", language: "TypeScript", content: "type State = \"IDLE\" | \"COUNTING\" | \"TYPING\" | \"DONE\";\ntype Event = \"START\" | \"TICK\" | \"FINISH\" | \"RESET\";\nconst transitions: Record<State, Partial<Record<Event, State>>> = {\n  IDLE: { START: \"COUNTING\" },\n  COUNTING: { TICK: \"TYPING\" },\n  TYPING: { FINISH: \"DONE\" },\n  DONE: { RESET: \"IDLE\" }\n};" },
  { title: "Web Worker Message Dispatch", language: "TypeScript", content: "const worker = new Worker(new URL(\"./telemetryWorker.ts\", import.meta.url), { type: \"module\" });\nworker.postMessage({ type: \"COMPUTE_STATS\", payload: { rawKeystrokes } });\nworker.onmessage = (e) => updateAnalytics(e.data);" },
  { title: "IndexedDB Key-Value Store", language: "TypeScript", content: "const req = indexedDB.open(\"TypeFlowDB\", 1);\nreq.onupgradeneeded = (e) => {\n  const db = (e.target as any).result;\n  if (!db.objectStoreNames.contains(\"history\")) db.createObjectStore(\"history\", { keyPath: \"id\" });\n};" },
  { title: "Dijkstra Shortest Path", language: "TypeScript", content: "function dijkstra(graph: Record<string, Record<string, number>>, start: string): Record<string, number> {\n  const dist: Record<string, number> = {}, visited = new Set<string>();\n  dist[start] = 0;\n  // compute relaxation edges\n  return dist;\n}" },
  { title: "Redux Middleware Thunk", language: "TypeScript", content: "const thunk = ({ dispatch, getState }: any) => (next: any) => (action: any) => typeof action === \"function\" ? action(dispatch, getState) : next(action);" },
  { title: "Custom WebRTC Peer Connection", language: "TypeScript", content: "const pc = new RTCPeerConnection({ iceServers: [{ urls: \"stun:stun.l.google.com:19302\" }] });\npc.onicecandidate = (e) => { if (e.candidate) signalingSocket.send(JSON.stringify(e.candidate)); };" },
  { title: "WebGL Shader Compilation", language: "JavaScript", content: "const shader = gl.createShader(gl.VERTEX_SHADER);\ngl.shaderSource(shader, vertexSource);\ngl.compileShader(shader);\nif (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));" },
  { title: "Async Generator Stream", language: "TypeScript", content: "async function* generateKeystrokes(stream: ReadableStream<Uint8Array>) {\n  const reader = stream.getReader();\n  while (true) {\n    const { done, value } = await reader.read();\n    if (done) break;\n    yield new TextDecoder().decode(value);\n  }\n}" },

  // Levels 91-100: Omniscient (Transcendent Systems, Compilers & Bit Shifting)
  { title: "AST Recursive Descent Parser", language: "TypeScript", content: "class Parser {\n  private pos = 0;\n  constructor(private tokens: Token[]) {}\n  parseExpr(): ExprNode {\n    let left = this.parseTerm();\n    while (this.peek()?.type === \"PLUS\" || this.peek()?.type === \"MINUS\") {\n      const op = this.next().value;\n      left = { type: \"BIN_OP\", op, left, right: this.parseTerm() };\n    }\n    return left;\n  }\n}" },
  { title: "Virtual DOM Diff Algorithm", language: "TypeScript", content: "function diff(oldV: VNode, newV: VNode): Patch[] {\n  if (oldV.tag !== newV.tag) return [{ type: \"REPLACE\", node: newV }];\n  const propPatches = diffProps(oldV.props, newV.props);\n  const childPatches = diffChildren(oldV.children, newV.children);\n  return [...propPatches, ...childPatches];\n}" },
  { title: "SHA-256 Bit Manipulation", language: "TypeScript", content: "const rotr = (n: number, b: number) => (n >>> b) | (n << (32 - b));\nconst sigma0 = (x: number) => rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3);\nconst sigma1 = (x: number) => rotr(x, 17) ^ rotr(x, 19) ^ (x >>> 10);" },
  { title: "Garbage Collector Mark & Sweep", language: "TypeScript", content: "function markSweep(roots: HeapObject[], heap: HeapObject[]): void {\n  const queue = [...roots];\n  while (queue.length) {\n    const obj = queue.pop()!;\n    if (!obj.marked) { obj.marked = true; queue.push(...obj.references); }\n  }\n  heap.filter(o => !o.marked).forEach(o => o.dispose());\n}" },
  { title: "Actor Model Message Inbox", language: "TypeScript", content: "class Actor<T> {\n  private mailbox: T[] = [];\n  private busy = false;\n  constructor(private handle: (msg: T) => Promise<void>) {}\n  send(msg: T) { this.mailbox.push(msg); this.process(); }\n  private async process() { if (this.busy) return; this.busy = true; while (this.mailbox.length) await this.handle(this.mailbox.shift()!); this.busy = false; }\n}" },
  { title: "Lock-Free Ring Buffer", language: "TypeScript", content: "class RingBuffer {\n  private buffer: Float64Array;\n  private head = 0;\n  private tail = 0;\n  constructor(private size: number) { this.buffer = new Float64Array(size); }\n  push(val: number): boolean { if ((this.head + 1) % this.size === this.tail) return false; this.buffer[this.head] = val; this.head = (this.head + 1) % this.size; return true; }\n}" },
  { title: "Rust-Style Result Monad", language: "TypeScript", content: "type Result<T, E> = { ok: true; val: T } | { ok: false; err: E };\nconst Ok = <T, E = never>(val: T): Result<T, E> => ({ ok: true, val });\nconst Err = <E, T = never>(err: E): Result<T, E> => ({ ok: false, err });\nconst andThen = <T, U, E>(r: Result<T, E>, fn: (v: T) => Result<U, E>): Result<U, E> => r.ok ? fn(r.val) : r;" },
  { title: "Tail Call Optimization Trampoline", language: "TypeScript", content: "type Thunk<T> = () => T | Thunk<T>;\nconst trampoline = <T>(fn: (...args: any[]) => Thunk<T>) => (...args: any[]): T => {\n  let res = fn(...args);\n  while (typeof res === \"function\") res = (res as any)();\n  return res as T;\n};" },
  { title: "Quantum Gate Transformation", language: "TypeScript", content: "class Qubit {\n  constructor(public alpha: number, public beta: number) {}\n  hadamard(): Qubit {\n    const invSqrt2 = 1 / Math.SQRT2;\n    return new Qubit(invSqrt2 * (this.alpha + this.beta), invSqrt2 * (this.alpha - this.beta));\n  }\n}" },
  { title: "The Grandmaster Kernel", language: "C/Assembly", content: "void _start() { asm volatile(\"mov $1, %rax; mov $1, %rdi; mov $msg, %rsi; mov $14, %rdx; syscall; mov $60, %rax; xor %rdi, %rdi; syscall; msg: .ascii \\\"TYPEFLOW APEX\\\\n\\\"\"); }" }
];

// Vocabulary pools classified by difficulty for procedural generation in Words & Time modes
const NOVICE_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
];

const INTERMEDIATE_WORDS = [
  'system', 'program', 'speed', 'flow', 'focus', 'rhythm', 'precision', 'keyboard', 'screen', 'latency', 'network', 'code', 'buffer', 'stream', 'matrix', 'quantum', 'velocity', 'engine', 'circuit', 'signal', 'pulse', 'spark', 'vector', 'pixel', 'memory', 'thread', 'cache', 'socket', 'packet', 'router', 'server', 'client', 'device', 'module', 'syntax', 'logic', 'energy', 'impact', 'stride', 'dynamic', 'future', 'challenge', 'progress', 'stamina', 'momentum', 'control', 'accuracy', 'reflex', 'dexterity', 'technique', 'harmony', 'cadence', 'frequency', 'interval', 'measure', 'standard', 'telemetry', 'digital', 'dimension', 'balance', 'mastery'
];

const ADVANCED_WORDS = [
  'architecture', 'asynchronous', 'optimization', 'distributed', 'concurrency', 'abstraction', 'encapsulation', 'polymorphism', 'algorithmic', 'deterministic', 'computational', 'synchronization', 'phenomenon', 'deliberate', 'perseverance', 'formidable', 'ubiquitous', 'synthesized', 'articulate', 'melancholy', 'contemplation', 'transcendence', 'equilibrium', 'kaleidoscopic', 'serendipity', 'idiosyncratic', 'labyrinthine', 'quintessential', 'epistemological', 'juxtaposition', 'phosphorescent', 'reverberation', 'microsecond', 'transmission', 'electromagnetic', 'oscillating', 'infrastructure', 'configuration', 'verification', 'authentication'
];

const GRANDMASTER_WORDS = [
  'sesquipedalian', 'antidisestablishmentarianism', 'floccinaucinihilipilification', 'incomprehensibilities', 'pseudopseudohypoparathyroidism', 'supercalifragilisticexpialidocious', 'psychoneuroimmunology', 'honorificabilitudinitatibus', 'spectrophotometrically', 'electroencephalographically', 'radioimmunoelectrophoresis', 'counterrevolutionaries', 'uncharacteristically', 'interchangeableness', 'disproportionableness', 'incommensurability', 'interconnectedness', 'microarchitectural', 'differentiability', 'thermodynamically', 'electrocardiographic', 'crystalloluminescence', 'anesthesiologist', 'uncompromised'
];

// Procedural word generator scaled exactly to level (1 to 100)
export function generateLevelWords(level: number, count: number = 25): { title: string; content: string } {
  const boundedLevel = Math.max(1, Math.min(100, level));
  const tier = getTierForLevel(boundedLevel);
  const words: string[] = [];

  for (let i = 0; i < count; i++) {
    let word: string;

    if (boundedLevel <= 15) {
      // Novice words
      word = NOVICE_WORDS[Math.floor(Math.random() * NOVICE_WORDS.length)];
    } else if (boundedLevel <= 40) {
      // Blend novice & intermediate
      const pool = Math.random() < 0.6 ? NOVICE_WORDS : INTERMEDIATE_WORDS;
      word = pool[Math.floor(Math.random() * pool.length)];
    } else if (boundedLevel <= 70) {
      // Blend intermediate & advanced
      const pool = Math.random() < 0.4 ? INTERMEDIATE_WORDS : ADVANCED_WORDS;
      word = pool[Math.floor(Math.random() * pool.length)];
    } else if (boundedLevel <= 90) {
      // Advanced vocabulary with occasional grandmaster words
      const pool = Math.random() < 0.75 ? ADVANCED_WORDS : GRANDMASTER_WORDS;
      word = pool[Math.floor(Math.random() * pool.length)];
    } else {
      // Levels 91-100: Grandmaster gauntlet
      const pool = Math.random() < 0.5 ? ADVANCED_WORDS : GRANDMASTER_WORDS;
      word = pool[Math.floor(Math.random() * pool.length)];
    }

    // Capitalization chance scales with level
    if (boundedLevel > 10 && i % 4 === 0) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }

    // Punctuation probability scales with level
    const punctChance = Math.min(0.4, boundedLevel * 0.004);
    if (boundedLevel > 20 && Math.random() < punctChance) {
      const puncts = boundedLevel > 60 
        ? [',', '.', '!', '?', ';', ':', '-', '\"'] 
        : [',', '.', '!', '?'];
      const p = puncts[Math.floor(Math.random() * puncts.length)];
      if (p === '\"') {
        word = `"${word}"`;
      } else {
        word = `${word}${p}`;
      }
    }

    // Number injection for levels above 35
    if (boundedLevel >= 35 && Math.random() < (boundedLevel * 0.0015)) {
      word = String(Math.floor(Math.random() * (boundedLevel * 10)) + 1);
    }

    words.push(word);
  }

  // Capitalize first word
  if (words.length > 0 && !words[0].startsWith('"')) {
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }

  return {
    title: `Level ${boundedLevel} Words (${tier.name})`,
    content: words.join(' ')
  };
}

// Procedural time text generator scaled to level
export function generateLevelTimeText(level: number, durationSeconds: number = 30): { title: string; content: string } {
  const boundedLevel = Math.max(1, Math.min(100, level));
  // Word count estimation based on benchmark WPM * time + safety buffer
  const benchmark = getBenchmarkWpm(boundedLevel);
  const estimatedWords = Math.max(35, Math.ceil((benchmark / 60) * durationSeconds * 2.2));
  const res = generateLevelWords(boundedLevel, estimatedWords);
  const tier = getTierForLevel(boundedLevel);
  
  return {
    title: `Level ${boundedLevel} Sprint (${durationSeconds}s · ${tier.name})`,
    content: res.content
  };
}

// Universal level info resolver for all modes
export function getLevelSnippet(
  mode: TestMode,
  level: number,
  options?: { durationSeconds?: number; wordCount?: number }
): LevelInfo {
  const boundedLevel = Math.max(1, Math.min(100, level));
  const tier = getTierForLevel(boundedLevel);
  const benchmarkWpm = getBenchmarkWpm(boundedLevel);
  const targetAccuracy = Math.min(99, 90 + Math.floor(boundedLevel / 15));

  if (mode === 'code') {
    const codeItem = CODE_LEVELS[boundedLevel - 1] || CODE_LEVELS[0];
    return {
      level: boundedLevel,
      mode: 'code',
      title: codeItem.title,
      tier,
      benchmarkWpm,
      targetAccuracy,
      description: `${codeItem.language} syntax · ${codeItem.title} (${tier.name})`,
      content: codeItem.content,
      author: codeItem.language
    };
  }

  if (mode === 'quote') {
    const quoteItem = QUOTE_LEVELS[boundedLevel - 1] || QUOTE_LEVELS[0];
    return {
      level: boundedLevel,
      mode: 'quote',
      title: quoteItem.title,
      tier,
      benchmarkWpm,
      targetAccuracy,
      description: `${quoteItem.author} · "${quoteItem.title}" (${tier.name})`,
      content: quoteItem.content,
      author: quoteItem.author
    };
  }

  // Descriptions for tiers in words & time modes
  const tierDescriptions: Record<number, string> = {
    1: 'Home row keys & 2-4 letter simple words, zero punctuation',
    2: 'Steady keystroke cadence, 4-6 letter common vocabulary',
    3: 'Fluid sentence transitions, light commas and periods',
    4: 'Prefixes, suffixes, contractions (apostrophes) & speed',
    5: 'Compound words, hyphenated phrases, digits & tech terms',
    6: 'Rich academic prose, quotation marks, semicolons & syntax',
    7: 'Polysyllabic vocabulary, endurance pacing & symbol shifts',
    8: 'Advanced nomenclature, rapid brackets & symbol pairs',
    9: 'Rare scientific terminology, intricate alternating shifts',
    10: 'Peak sesquipedalian gauntlet, ultimate velocity test'
  };
  const tierDesc = tierDescriptions[tier.id] || tier.description;

  if (mode === 'words') {
    const count = options?.wordCount || 25;
    const generated = generateLevelWords(boundedLevel, count);
    return {
      level: boundedLevel,
      mode: 'words',
      title: `Level ${boundedLevel} Lexicon`,
      tier,
      benchmarkWpm,
      targetAccuracy,
      description: `${count} Words · ${tierDesc}`,
      content: generated.content
    };
  }

  // mode === 'time'
  const duration = options?.durationSeconds || 30;
  const generatedTime = generateLevelTimeText(boundedLevel, duration);
  return {
    level: boundedLevel,
    mode: 'time',
    title: `Level ${boundedLevel} Endurance`,
    tier,
    benchmarkWpm,
    targetAccuracy,
    description: `${duration}s Challenge · ${tierDesc}`,
    content: generatedTime.content
  };
}

export interface LevelUserRecord {
  completedCount: number;
  highestAccuracy: number;
  bestWpm: number;
  lastAttemptAt?: string;
}

// Local storage progress tracking
export function getCompletedLevels(mode: TestMode): number[] {
  try {
    const data = localStorage.getItem(`typeflow_completed_levels_${mode}`);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveCompletedLevel(mode: TestMode, level: number): void {
  try {
    const current = getCompletedLevels(mode);
    if (!current.includes(level)) {
      const updated = [...current, level].sort((a, b) => a - b);
      localStorage.setItem(`typeflow_completed_levels_${mode}`, JSON.stringify(updated));
    }
  } catch (e) {
    console.error('Failed to save completed level:', e);
  }
}

export function getAllLevelRecords(mode: TestMode): Record<number, LevelUserRecord> {
  try {
    const raw = localStorage.getItem(`typeflow_level_records_${mode}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getLevelUserRecord(mode: TestMode, level: number): LevelUserRecord | null {
  const records = getAllLevelRecords(mode);
  return records[level] || null;
}

export function saveLevelAttempt(
  mode: TestMode,
  level: number,
  accuracy: number,
  wpm: number,
  isPassed: boolean
): void {
  try {
    const records = getAllLevelRecords(mode);
    const existing = records[level] || {
      completedCount: 0,
      highestAccuracy: 0,
      bestWpm: 0
    };

    const newCompletedCount = isPassed ? existing.completedCount + 1 : existing.completedCount;
    const newHighestAcc = Math.max(existing.highestAccuracy, accuracy);
    const newBestWpm = Math.max(existing.bestWpm, wpm);

    records[level] = {
      completedCount: newCompletedCount,
      highestAccuracy: newHighestAcc,
      bestWpm: newBestWpm,
      lastAttemptAt: new Date().toISOString()
    };

    localStorage.setItem(`typeflow_level_records_${mode}`, JSON.stringify(records));

    if (isPassed) {
      saveCompletedLevel(mode, level);
    }
  } catch (e) {
    console.error('Failed to save level attempt:', e);
  }
}

export function getCommunityCompletionCount(mode: TestMode, level: number): number {
  // Deterministic realistic base curve: high at lv 1 (~19k), decreasing down to lv 100 (~160)
  const seed = ((level * 37) + mode.length * 19) % 67;
  const base = Math.floor(19400 / Math.pow(1 + (level - 1) * 0.082, 1.84));
  return Math.max(145, base + seed * 3);
}

export function getLevelCompletionStats(mode: TestMode, level: number) {
  const userRec = getLevelUserRecord(mode, level);
  const communityBase = getCommunityCompletionCount(mode, level);
  const isCompletedInList = getCompletedLevels(mode).includes(level);
  const userCompletions = userRec?.completedCount ?? (isCompletedInList ? 1 : 0);
  const userCompleted = userCompletions > 0 || isCompletedInList;
  const totalCompleted = communityBase + userCompletions;

  return {
    totalCompleted,
    userCompletions,
    highestAccuracy: userRec && userRec.highestAccuracy > 0 ? userRec.highestAccuracy : null,
    bestWpm: userRec && userRec.bestWpm > 0 ? userRec.bestWpm : null,
    isCompleted: userCompleted
  };
}

export function getHighestUnlockedLevel(mode: TestMode): number {
  const completed = getCompletedLevels(mode);
  if (completed.length === 0) return 1;
  const max = Math.max(...completed);
  return Math.min(100, max + 1);
}
