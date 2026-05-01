import { useState, useRef, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { useWindowStore } from '../../store/windowStore';
import type { AppId } from '../../store/windowStore';
import { APPS } from '../../data/content';

type LineType = 'input' | 'output' | 'error' | 'system' | 'matrix';

interface Line {
  text: string;
  type: LineType;
}

const PROMPT = 'christian@portfolio:~$ ';

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
  "Why do Java developers wear glasses? Because they don't C#.",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "I would tell you a joke about UDP... but you might not get it.",
  "To understand recursion, you must first understand recursion.",
];

const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEF012345';

function getMatrixLine(): string {
  return Array.from({ length: 52 }, () =>
    MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
  ).join(' ');
}

export default function TerminalApp() {
  const openWindow = useWindowStore((s) => s.openWindow);
  const [lines, setLines] = useState<Line[]>([
    { text: 'Christian Koh\'s Portfolio Terminal v1.0.0', type: 'system' },
    { text: 'Type "help" for available commands.', type: 'system' },
    { text: '', type: 'output' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [isMatrix, setIsMatrix] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const matrixTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const addLines = useCallback((newLines: Line[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const runMatrix = useCallback(() => {
    setIsMatrix(true);
    let count = 0;
    matrixTimerRef.current = setInterval(() => {
      setLines((prev) => [...prev, { text: getMatrixLine(), type: 'matrix' }]);
      count++;
      if (count >= 18) {
        clearInterval(matrixTimerRef.current!);
        setIsMatrix(false);
        setLines((prev) => [...prev, { text: '', type: 'output' }, { text: '[matrix exited]', type: 'system' }]);
      }
    }, 80);
  }, []);

  useEffect(() => () => { if (matrixTimerRef.current) clearInterval(matrixTimerRef.current); }, []);

  const processCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const parts = cmd.split(/\s+/);

    addLines([{ text: PROMPT + raw, type: 'input' }]);

    if (!cmd) { addLines([{ text: '', type: 'output' }]); return; }

    switch (parts[0]) {
      case 'help':
        addLines([
          { text: 'Available commands:', type: 'output' },
          { text: '  help           show this help', type: 'output' },
          { text: '  whoami         about Christian', type: 'output' },
          { text: '  ls             list files', type: 'output' },
          { text: '  cat resume.pdf print resume summary', type: 'output' },
          { text: '  open <app>     open an app (about, experience, projects, skills,', type: 'output' },
          { text: '                 publications, contact, snake, minesweeper,', type: 'output' },
          { text: '                 wordle, mastermind, flappybird, twentyfortyeight)', type: 'output' },
          { text: '  matrix         👀', type: 'output' },
          { text: '  joke           random dev joke', type: 'output' },
          { text: '  clear          clear terminal', type: 'output' },
          { text: '', type: 'output' },
        ]);
        break;

      case 'whoami':
        addLines([
          { text: 'Christian Michael Koh', type: 'output' },
          { text: 'B.Sc. Information Systems, Singapore Management University', type: 'output' },
          { text: 'GPA: 3.96/4.00 (Summa Cum Laude)', type: 'output' },
          { text: 'Focus: AI/ML · Full Stack · Cloud & DevOps', type: 'output' },
          { text: 'Email: 04christiankoh@gmail.com', type: 'output' },
          { text: '', type: 'output' },
        ]);
        break;

      case 'ls':
        addLines([
          { text: 'drwxr-xr-x  projects/', type: 'output' },
          { text: '-rw-r--r--  resume.pdf', type: 'output' },
          { text: '-rw-r--r--  skills.txt', type: 'output' },
          { text: '-rw-r--r--  contact.txt', type: 'output' },
          { text: '-rwxr-xr-x  snake.exe', type: 'output' },
          { text: '-rwxr-xr-x  minesweeper.exe', type: 'output' },
          { text: '', type: 'output' },
        ]);
        break;

      case 'cat':
        if (parts[1] === 'resume.pdf') {
          addLines([
            { text: '╔══════════════════════════════════════╗', type: 'output' },
            { text: '║      CHRISTIAN MICHAEL KOH           ║', type: 'output' },
            { text: '╠══════════════════════════════════════╣', type: 'output' },
            { text: '║ SMU IS · GPA 3.96 · Summa Cum Laude  ║', type: 'output' },
            { text: '║ Dean\'s List · 2 Scholarships          ║', type: 'output' },
            { text: '╠══════════════════════════════════════╣', type: 'output' },
            { text: '║ EXPERIENCE (6 internships)            ║', type: 'output' },
            { text: '║  · Cinch SG (2026–present)            ║', type: 'output' },
            { text: '║  · Mindsprint/Olam (2025)             ║', type: 'output' },
            { text: '║  · CPF Board (2025)                   ║', type: 'output' },
            { text: '║  · SMU Research · MHA (2023–2024)     ║', type: 'output' },
            { text: '╠══════════════════════════════════════╣', type: 'output' },
            { text: '║ SKILLS: Python · React · AWS · LLMs   ║', type: 'output' },
            { text: '║         Docker · Flask · TypeScript    ║', type: 'output' },
            { text: '╚══════════════════════════════════════╝', type: 'output' },
            { text: '', type: 'output' },
          ]);
        } else if (parts[1] === 'skills.txt') {
          addLines([
            { text: 'Python, JavaScript, TypeScript, Java, Go, SQL', type: 'output' },
            { text: 'React, Next.js, Flask, Node.js, Vue.js', type: 'output' },
            { text: 'AWS, Docker, Kubernetes, Apache Spark', type: 'output' },
            { text: 'LLMs, RAG, GenAI, HuggingFace, vLLM', type: 'output' },
            { text: '', type: 'output' },
          ]);
        } else if (parts[1] === 'contact.txt') {
          addLines([
            { text: 'Email:    04christiankoh@gmail.com', type: 'output' },
            { text: 'LinkedIn: linkedin.com/in/04christiankoh', type: 'output' },
            { text: 'Phone:    +65 9732 7232', type: 'output' },
            { text: '', type: 'output' },
          ]);
        } else {
          addLines([{ text: `cat: ${parts[1] ?? ''}: No such file or directory`, type: 'error' }]);
        }
        break;

      case 'open': {
        const appName = parts[1];
        const match = APPS.find(
          (a) => a.id === appName || a.label.toLowerCase() === appName
        );
        if (match) {
          openWindow(match.id as AppId);
          addLines([{ text: `Opening ${match.label}...`, type: 'output' }, { text: '', type: 'output' }]);
        } else {
          addLines([
            { text: `open: app not found: ${appName ?? ''}`, type: 'error' },
            { text: 'Try: about, experience, projects, skills, publications, contact,', type: 'output' },
            { text: '     snake, minesweeper, terminal, wordle, mastermind, flappybird, twentyfortyeight', type: 'output' },
          ]);
        }
        break;
      }

      case 'matrix':
        addLines([{ text: 'Entering the Matrix...', type: 'system' }]);
        setTimeout(runMatrix, 300);
        break;

      case 'joke':
        addLines([
          { text: JOKES[Math.floor(Math.random() * JOKES.length)], type: 'output' },
          { text: '', type: 'output' },
        ]);
        break;

      case 'clear':
        setLines([]);
        return;

      case 'sudo':
        if (raw.trim() === 'sudo rm -rf /') {
          addLines([{ text: 'Nice try 😏', type: 'error' }]);
        } else {
          addLines([{ text: 'Permission denied: this portfolio is read-only.', type: 'error' }]);
        }
        break;

      default:
        addLines([
          { text: `command not found: ${parts[0]}. Type 'help' for commands.`, type: 'error' },
        ]);
    }
  }, [addLines, openWindow, runMatrix]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = input;
      if (val.trim()) setHistory((h) => [val, ...h]);
      setHistoryIdx(-1);
      setInput('');
      processCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(next);
      setInput(history[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(historyIdx - 1, -1);
      setHistoryIdx(next);
      setInput(next === -1 ? '' : history[next]);
    }
  };

  const lineColor = (type: LineType) => {
    if (type === 'input') return '#a5b4fc';
    if (type === 'error') return '#f87171';
    if (type === 'system') return 'rgba(255,255,255,0.4)';
    if (type === 'matrix') return '#4ade80';
    return 'rgba(255,255,255,0.75)';
  };

  return (
    <Box
      onClick={() => inputRef.current?.focus()}
      sx={{
        fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', 'Cascadia Code', monospace",
        fontSize: 12,
        lineHeight: 1.6,
        background: '#0d1117',
        borderRadius: 1,
        minHeight: 340,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'text',
        mx: -2.5,
        mb: -2.5,
        px: 2,
        py: 1.5,
      }}
    >
      {/* Output history */}
      <Box sx={{ flex: 1, overflowY: 'auto', mb: 0.5 }}>
        {lines.map((line, i) => (
          <Box key={i} sx={{ color: lineColor(line.type), whiteSpace: 'pre', wordBreak: 'break-all' }}>
            {line.text || ' '}
          </Box>
        ))}
        <div ref={bottomRef} />
      </Box>

      {/* Input row */}
      {!isMatrix && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <Box component="span" sx={{ color: '#4ade80', flexShrink: 0, mr: 0.5 }}>
            {PROMPT}
          </Box>
          <Box
            component="input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput((e.target as HTMLInputElement).value)}
            onKeyDown={handleKeyDown}
            autoFocus
            sx={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              caretColor: '#4ade80',
            }}
          />
        </Box>
      )}
    </Box>
  );
}
