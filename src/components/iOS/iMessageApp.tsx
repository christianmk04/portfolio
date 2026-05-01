import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Message {
  from: 'sarah' | 'christian';
  text: string;
  timestamp?: string;
}

const MESSAGES: (Message | { type: 'timestamp'; label: string })[] = [
  { type: 'timestamp', label: 'Today 9:14 AM' },
  { from: 'sarah',     text: "Hi Christian! I came across your portfolio and it's genuinely impressive. Are you open to a quick chat about a role?" },
  { from: 'christian', text: "Hey Sarah! Thanks so much, really glad you liked it. Happy to chat!" },
  { from: 'sarah',     text: "Amazing 😊 I'm reaching out from TechCorp. We're hiring for an AI/ML Engineer role. What's your current stack?" },
  { from: 'christian', text: "Mainly Python for backend and AI work. I've been using LangChain and building RAG pipelines. On the frontend I do React + TypeScript. Most of my recent work has been around agentic AI systems." },
  { from: 'sarah',     text: "That's exactly what we're looking for! Can you tell me about a project you're most proud of?" },
  { from: 'christian', text: "Probably my work at CPF Board. I rebuilt their GenAI knowledge assistant from scratch, revamped the RAG pipeline, and shipped a Telegram bot for HR automation. Went from concept to production in 3 months." },
  { type: 'timestamp', label: '9:18 AM' },
  { from: 'sarah',     text: "Wow, that's impressive. And you've done 6 internships? That's rare for a final-year student." },
  { from: 'christian', text: "Yeah! Started early. My first internship was a GenAI research role at SMU back in 2023. Each one stacked on the last. Went from pure research to building production systems." },
  { from: 'sarah',     text: "What's your graduation timeline?" },
  { from: 'christian', text: "Graduating May 2026! So I'm actively looking for full-time roles. Preferably in Singapore but open to remote too." },
  { from: 'sarah',     text: "Perfect timing for us. One last thing: what do you consider your superpower?" },
  { from: 'christian', text: "Shipping fast. I can go from a vague problem statement to a working prototype in a day, and to production in a week. I'm comfortable across the full stack and AI layer." },
  { type: 'timestamp', label: '9:21 AM' },
  { from: 'sarah',     text: "😄 I love that. Let me loop in our tech lead. Can I send a follow-up to 04christiankoh@gmail.com?" },
  { from: 'christian', text: "Absolutely! Looking forward to it 🙌" },
];

function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '4px 0 12px' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'linear-gradient(135deg, #4f4f6f, #6b6b8e)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, flexShrink: 0,
      }}>
        👩‍💼
      </div>
      <div style={{
        background: 'rgba(60,60,67,0.6)',
        borderRadius: '18px 18px 18px 4px',
        padding: '10px 14px',
        display: 'flex', gap: 4, alignItems: 'center',
      }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.8, delay: i * 0.18, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  );
}

export default function IMessageApp() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', background: '#000',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    }}>

      {/* Header */}
      <div style={{
        padding: '12px 16px 10px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(28,28,30,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f4f6f, #6b6b8e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0,
          }}>
            👩‍💼
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Sarah Chen</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>
              HR @ TechCorp
            </div>
          </div>
          {/* Info icon */}
          <div style={{ fontSize: 20, color: '#1d7cf2', cursor: 'default' }}>ⓘ</div>
        </div>
      </div>

      {/* Message list */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 12px 0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {MESSAGES.map((item, i) => {
          if ('type' in item) {
            return (
              <div key={i} style={{
                textAlign: 'center', fontSize: 11,
                color: 'rgba(255,255,255,0.35)',
                margin: '12px 0 6px',
              }}>
                {item.label}
              </div>
            );
          }

          const isChristian = item.from === 'christian';
          const isLast = i === MESSAGES.length - 1;

          return (
            <div key={i} style={{
              display: 'flex',
              flexDirection: isChristian ? 'row-reverse' : 'row',
              alignItems: 'flex-end',
              gap: 6,
              marginBottom: 4,
            }}>
              {!isChristian && (
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4f4f6f, #6b6b8e)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, flexShrink: 0,
                }}>
                  👩‍💼
                </div>
              )}
              <div style={{ maxWidth: '72%' }}>
                <div style={{
                  background: isChristian ? '#1d7cf2' : 'rgba(60,60,67,0.6)',
                  color: '#fff',
                  borderRadius: isChristian
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  padding: '9px 13px',
                  fontSize: 14,
                  lineHeight: 1.45,
                  wordBreak: 'break-word',
                }}>
                  {item.text}
                </div>
                {isLast && isChristian && (
                  <div style={{
                    fontSize: 10, color: 'rgba(255,255,255,0.35)',
                    textAlign: 'right', marginTop: 3, paddingRight: 2,
                  }}>
                    Delivered ✓
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        <TypingDots />
      </div>

      {/* Input bar (decorative) */}
      <div style={{
        padding: '10px 12px 14px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(28,28,30,0.95)',
        display: 'flex', alignItems: 'center', gap: 8,
        flexShrink: 0,
      }}>
        {/* + button */}
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: 'rgba(255,255,255,0.4)', cursor: 'default', flexShrink: 0,
        }}>
          +
        </div>
        {/* Input field */}
        <div style={{
          flex: 1,
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 20,
          padding: '8px 14px',
          fontSize: 14,
          color: 'rgba(255,255,255,0.25)',
          border: '1px solid rgba(255,255,255,0.1)',
          userSelect: 'none',
        }}>
          iMessage
        </div>
        {/* Send button */}
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(29,124,242,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: 'rgba(29,124,242,0.5)', cursor: 'default', flexShrink: 0,
        }}>
          ↑
        </div>
      </div>
    </div>
  );
}
