import { Router } from 'express';
import { db, TextSnippet } from '../db';

export const textsRouter = Router();

const COMMON_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'system', 'program', 'speed', 'flow', 'focus', 'rhythm', 'precision', 'keyboard',
  'screen', 'latency', 'network', 'code', 'buffer', 'stream', 'matrix', 'quantum',
  'velocity', 'engine', 'circuit', 'signal', 'pulse', 'spark', 'vector', 'pixel',
  'memory', 'thread', 'cache', 'socket', 'packet', 'router', 'server', 'client',
  'device', 'module', 'syntax', 'logic', 'energy', 'impact', 'stride', 'dynamic'
];

const CODE_SNIPPETS = [
  {
    title: 'Array Filter & Map Pipeline',
    category: 'code',
    difficulty: 'medium',
    content: 'const activeScores = players.filter(p => p.isActive).map(p => ({ id: p.id, score: p.wpm * p.accuracy }));'
  },
  {
    title: 'React Custom Hook Pattern',
    category: 'code',
    difficulty: 'hard',
    content: 'export function useDebounce<T>(value: T, delay: number): T { const [debounced, setDebounced] = useState(value); useEffect(() => { const timer = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(timer); }, [value, delay]); return debounced; }'
  },
  {
    title: 'Express Route Handler',
    category: 'code',
    difficulty: 'medium',
    content: 'app.post("/api/race/submit", async (req, res) => { const { roomId, metrics } = req.body; const result = await raceService.record(roomId, metrics); return res.status(200).json(result); });'
  },
  {
    title: 'CSS Grid Responsive Layout',
    category: 'code',
    difficulty: 'easy',
    content: 'display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; align-items: stretch;'
  }
];

// Get random text based on options
textsRouter.get('/random', (req, res): void => {
  const { mode = 'words', count = 25, category = 'standard', punctuation = 'false', numbers = 'false', level = '1' } = req.query;
  const levelNum = Math.max(1, Math.min(100, Number(level) || 1));
  const wordCount = Math.min(200, Math.max(5, Number(count)));
  const includePunctuation = punctuation === 'true' || levelNum > 25;
  const includeNumbers = numbers === 'true' || levelNum > 45;

  if (mode === 'quote') {
    const quotes = db.getTexts().filter(t => t.category === 'quote' || t.category === 'tech' || t.category === 'standard');
    // Pick based on level or index
    const quoteIndex = (levelNum - 1) % quotes.length;
    const randomQuote = quotes[quoteIndex] || quotes[0];
    res.json({
      title: `Level ${levelNum}: ${randomQuote.title}`,
      author: randomQuote.author,
      content: randomQuote.content,
      mode: 'quote',
      level: levelNum
    });
    return;
  }

  if (mode === 'code') {
    const codeList = CODE_SNIPPETS;
    const codeIndex = (levelNum - 1) % codeList.length;
    const randomCode = codeList[codeIndex];
    res.json({
      title: `Level ${levelNum}: ${randomCode.title}`,
      content: randomCode.content,
      mode: 'code',
      level: levelNum
    });
    return;
  }

  // Generate word sequence scaled to level
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    let word = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
    
    if (includeNumbers && Math.random() < Math.min(0.2, levelNum * 0.002)) {
      word = String(Math.floor(Math.random() * (levelNum * 10)) + 1);
    } else if (includePunctuation && Math.random() < Math.min(0.35, levelNum * 0.004)) {
      const puncts = levelNum > 60 ? [',', '.', '!', '?', ';', ':', '-', '"'] : [',', '.', '!', '?'];
      const p = puncts[Math.floor(Math.random() * puncts.length)];
      if (p === '"') {
        word = `"${word}"`;
      } else {
        word = `${word}${p}`;
      }
    }
    words.push(word);
  }

  // Capitalize words based on level
  if (words.length > 0) {
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    if (levelNum > 15) {
      for (let i = 4; i < words.length; i += 4) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
      }
    }
  }

  res.json({
    title: `Level ${levelNum} Words Flow`,
    content: words.join(' '),
    mode: 'words',
    count: wordCount,
    level: levelNum
  });
});

// List all pre-stored snippets
textsRouter.get('/snippets', (req, res): void => {
  res.json({ texts: db.getTexts() });
});
