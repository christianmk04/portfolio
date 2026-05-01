import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWindowStore } from '../../store/windowStore';
import type { AppId } from '../../store/windowStore';
import { APPS, INTERNSHIPS, PROJECTS, SKILLS, PUBLICATION } from '../../data/content';

interface SpotlightResult {
  id: string;
  category: 'Apps' | 'Experience' | 'Projects' | 'Skills' | 'Publications';
  title: string;
  subtitle: string;
  icon: string;
  action: () => void;
}

function scoreMatch(haystack: string, needle: string): number {
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  if (h === n) return 3;
  if (h.startsWith(n)) return 2;
  if (h.includes(n)) return 1;
  return 0;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Spotlight({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const openWindow = useWindowStore((s) => s.openWindow);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  const getResults = useCallback((): SpotlightResult[] => {
    if (!query.trim()) return [];
    const q = query.trim();
    const results: (SpotlightResult & { score: number })[] = [];

    // Apps
    for (const app of APPS.filter(a => !a.desktopOnly)) {
      const score = scoreMatch(app.label, q);
      if (score > 0) {
        results.push({
          id: `app-${app.id}`,
          category: 'Apps',
          title: app.label,
          subtitle: 'Application',
          icon: app.icon,
          score,
          action: () => {
            openWindow(app.id as AppId);
            onClose();
          },
        });
      }
    }

    // Experience
    for (const intern of INTERNSHIPS) {
      const score = Math.max(
        scoreMatch(intern.company, q),
        scoreMatch(intern.role, q),
        ...intern.tags.map(t => scoreMatch(t, q)),
      );
      if (score > 0) {
        results.push({
          id: `exp-${intern.company}`,
          category: 'Experience',
          title: intern.company,
          subtitle: intern.role,
          icon: '💼',
          score,
          action: () => {
            openWindow('experience');
            onClose();
          },
        });
      }
    }

    // Projects
    for (const proj of PROJECTS) {
      const score = Math.max(
        scoreMatch(proj.name, q),
        scoreMatch(proj.description, q),
        ...proj.tags.map(t => scoreMatch(t, q)),
      );
      if (score > 0) {
        results.push({
          id: `proj-${proj.name}`,
          category: 'Projects',
          title: proj.name,
          subtitle: proj.description,
          icon: '🚀',
          score,
          action: () => {
            openWindow('projects');
            onClose();
          },
        });
      }
    }

    // Skills
    for (const [category, skills] of Object.entries(SKILLS)) {
      const catScore = scoreMatch(category, q);
      const skillMatches = (skills as string[]).filter(s => scoreMatch(s, q) > 0);
      if (catScore > 0 || skillMatches.length > 0) {
        results.push({
          id: `skill-${category}`,
          category: 'Skills',
          title: category,
          subtitle: skillMatches.length > 0 ? skillMatches.slice(0, 3).join(', ') : (skills as string[]).slice(0, 3).join(', '),
          icon: '⚡',
          score: catScore > 0 ? catScore : 1,
          action: () => {
            openWindow('skills');
            onClose();
          },
        });
      }
    }

    // Publication
    const pubScore = Math.max(
      scoreMatch(PUBLICATION.title, q),
      scoreMatch(PUBLICATION.venue, q),
      scoreMatch(PUBLICATION.conference, q),
    );
    if (pubScore > 0) {
      results.push({
        id: 'publication',
        category: 'Publications',
        title: 'IEEE Publication',
        subtitle: PUBLICATION.venue,
        icon: '📄',
        score: pubScore,
        action: () => {
          openWindow('publications');
          onClose();
        },
      });
    }

    // Sort by score desc, then cap at 8 unique results
    results.sort((a, b) => b.score - a.score);
    const seen = new Set<string>();
    return results.filter(r => {
      const key = r.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 8);
  }, [query, openWindow, onClose]);

  const results = getResults();

  // Group by category
  const grouped: Record<string, SpotlightResult[]> = {};
  for (const r of results) {
    if (!grouped[r.category]) grouped[r.category] = [];
    grouped[r.category].push(r);
  }

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedId(results[0]?.id ?? null);
  }, [results.map(r => r.id).join(',')]);  // eslint-disable-line

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = results.findIndex(r => r.id === selectedId);
      setSelectedId(results[(idx + 1) % results.length]?.id ?? null);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = results.findIndex(r => r.id === selectedId);
      setSelectedId(results[(idx - 1 + results.length) % results.length]?.id ?? null);
    }
    if (e.key === 'Enter') {
      const selected = results.find(r => r.id === selectedId);
      selected?.action();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: '15vh',
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              width: '580px',
              maxWidth: '90vw',
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'rgba(18,18,28,0.92)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
            }}
          >
            {/* Search input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 18px',
              borderBottom: results.length > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
            }}>
              <span style={{ fontSize: '18px', opacity: 0.5 }}>🔍</span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Spotlight Search"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '20px',
                  color: '#fff',
                  fontFamily: 'inherit',
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '11px',
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px 0' }}>
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <div style={{
                      padding: '6px 18px 4px',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.35)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}>
                      {category}
                    </div>
                    {items.map(result => (
                      <div
                        key={result.id}
                        onClick={result.action}
                        onMouseEnter={() => setSelectedId(result.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px 18px',
                          cursor: 'pointer',
                          background: selectedId === result.id ? 'rgba(99,102,241,0.25)' : 'transparent',
                          transition: 'background 0.1s',
                          borderRadius: '6px',
                          margin: '0 8px',
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          flexShrink: 0,
                        }}>
                          {result.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '1px' }}>
                            {result.title}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.45)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {result.subtitle}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {query.trim() && results.length === 0 && (
              <div style={{ padding: '20px 18px', color: 'rgba(255,255,255,0.3)', fontSize: '13px', textAlign: 'center' }}>
                No results for "{query}"
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
