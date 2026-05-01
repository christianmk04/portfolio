import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { INTERNSHIPS, PROJECTS, SKILLS, PUBLICATION, CONTACT } from '../../data/content';

type FolderName = 'About' | 'Experience' | 'Projects' | 'Skills' | 'Publications' | 'Contact';

const FOLDERS: FolderName[] = ['About', 'Experience', 'Projects', 'Skills', 'Publications', 'Contact'];

const FOLDER_ICONS: Record<FolderName, string> = {
  About: '📁',
  Experience: '📁',
  Projects: '📁',
  Skills: '📁',
  Publications: '📁',
  Contact: '📁',
};

function AboutContent() {
  return (
    <Box sx={{ padding: '20px' }}>
      <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
        Christian Michael Koh
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {['IS Student @ SMU', 'AI/ML Engineer', 'Full Stack Developer', 'Researcher'].map(chip => (
          <span
            key={chip}
            style={{
              background: 'rgba(99,102,241,0.2)',
              color: '#a5b4fc',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '12px',
              padding: '3px 10px',
              fontSize: '11px',
              fontFamily: 'monospace',
            }}
          >
            {chip}
          </span>
        ))}
      </Box>
      <Typography sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
        I'm a final-year Information Systems student at SMU (GPA 3.96, Summa Cum Laude) with a strong passion
        for AI, full-stack development, and building meaningful products. I've had the privilege of interning
        at organisations ranging from government agencies to startups, working on everything from GenAI-powered
        tools and LLM infrastructure to agentic microservices. I love turning complex ideas into clean,
        working software.
      </Typography>
    </Box>
  );
}

function ExperienceContent() {
  return (
    <Box sx={{ padding: '12px 0' }}>
      {INTERNSHIPS.map((intern, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            cursor: 'default',
            '&:hover': { background: 'rgba(255,255,255,0.04)' },
          }}
        >
          <Box>
            <Typography sx={{ fontSize: '13px', fontFamily: 'monospace', color: '#fff', fontWeight: 600 }}>
              {intern.company}
            </Typography>
            <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.45)', marginTop: '1px' }}>
              {intern.role}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)' }}>
            {intern.period}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function ProjectsContent() {
  return (
    <Box sx={{ padding: '12px 0' }}>
      {PROJECTS.map((project, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            cursor: 'default',
            '&:hover': { background: 'rgba(255,255,255,0.04)' },
          }}
        >
          <Box>
            <Typography sx={{ fontSize: '13px', fontFamily: 'monospace', color: '#fff', fontWeight: 600 }}>
              {project.name}
            </Typography>
            <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.45)', marginTop: '1px' }}>
              {project.role}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)' }}>
            {project.period}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function SkillsContent() {
  return (
    <Box sx={{ padding: '20px' }}>
      {Object.entries(SKILLS).map(([category, items]) => (
        <Box key={category} sx={{ marginBottom: '16px' }}>
          <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#818cf8', fontFamily: 'monospace', marginBottom: '6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {category}
          </Typography>
          <Typography sx={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
            {items.join(', ')}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function PublicationsContent() {
  return (
    <Box sx={{ padding: '20px' }}>
      <Box
        sx={{
          padding: '16px',
          borderRadius: '6px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#fff', lineHeight: 1.6, marginBottom: '8px' }}>
          {PUBLICATION.title}
        </Typography>
        <Typography sx={{ fontSize: '12px', fontFamily: 'monospace', color: '#818cf8', marginBottom: '4px' }}>
          {PUBLICATION.venue}
        </Typography>
        <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>
          {PUBLICATION.conference} · {PUBLICATION.location} · pp. {PUBLICATION.pages}
        </Typography>
        <a
          href={PUBLICATION.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '12px', fontFamily: 'monospace', color: '#6366f1', textDecoration: 'none' }}
        >
          🔗 View Publication →
        </a>
      </Box>
    </Box>
  );
}

function ContactContent() {
  const rows = [
    { icon: '✉️', label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/04christiankoh', href: CONTACT.linkedin },
    { icon: '🐙', label: 'GitHub', value: 'github.com/christianmk04', href: CONTACT.github },
    { icon: '📱', label: 'Phone', value: CONTACT.phone, href: `tel:${CONTACT.phone}` },
  ];
  return (
    <Box sx={{ padding: '12px 0' }}>
      {rows.map((row) => (
        <a
          key={row.label}
          href={row.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', display: 'block' }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              cursor: 'pointer',
              '&:hover': { background: 'rgba(255,255,255,0.04)' },
            }}
          >
            <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{row.icon}</span>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', marginBottom: '1px' }}>
                {row.label}
              </Typography>
              <Typography sx={{ fontSize: '13px', fontFamily: 'monospace', color: '#a5b4fc' }}>
                {row.value}
              </Typography>
            </Box>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>›</span>
          </Box>
        </a>
      ))}
    </Box>
  );
}

function FolderContent({ folder }: { folder: FolderName }) {
  switch (folder) {
    case 'About': return <AboutContent />;
    case 'Experience': return <ExperienceContent />;
    case 'Projects': return <ProjectsContent />;
    case 'Skills': return <SkillsContent />;
    case 'Publications': return <PublicationsContent />;
    case 'Contact': return <ContactContent />;
  }
}

export default function FinderApp() {
  const [activeFolder, setActiveFolder] = useState<FolderName | null>(null);

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", monospace',
        background: '#242428',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: '180px',
          flexShrink: 0,
          background: '#1c1c1e',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          paddingTop: '8px',
          overflowY: 'auto',
        }}
      >
        <Typography
          sx={{
            fontSize: '10px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '8px 12px 4px',
          }}
        >
          Portfolio
        </Typography>
        {FOLDERS.map((folder) => (
          <Box
            key={folder}
            onClick={() => setActiveFolder(folder)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '6px 12px',
              cursor: 'pointer',
              borderRadius: '5px',
              margin: '1px 6px',
              background: activeFolder === folder ? 'rgba(99,102,241,0.25)' : 'transparent',
              color: activeFolder === folder ? '#c7d2fe' : 'rgba(255,255,255,0.65)',
              fontSize: '13px',
              '&:hover': {
                background: activeFolder === folder ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)',
              },
            }}
          >
            <span style={{ fontSize: '14px' }}>{FOLDER_ICONS[folder]}</span>
            <span style={{ fontSize: '13px' }}>{folder}</span>
          </Box>
        ))}
      </Box>

      {/* Main panel */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeFolder ? (
          <>
            {/* Breadcrumb */}
            <Box
              sx={{
                height: '32px',
                background: '#1a1a1e',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                gap: '8px',
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => setActiveFolder(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '0 4px',
                  lineHeight: 1,
                }}
              >
                ←
              </button>
              <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>
                Macintosh HD / Portfolio /
              </Typography>
              <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                {activeFolder}
              </Typography>
            </Box>
            {/* Folder content */}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              <FolderContent folder={activeFolder} />
            </Box>
          </>
        ) : (
          <>
            {/* Breadcrumb for root */}
            <Box
              sx={{
                height: '32px',
                background: '#1a1a1e',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
              }}
            >
              <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)' }}>
                Macintosh HD / Portfolio
              </Typography>
            </Box>
            {/* Root grid */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                alignContent: 'start',
              }}
            >
              {FOLDERS.map((folder) => (
                <Box
                  key={folder}
                  onClick={() => setActiveFolder(folder)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    padding: '8px',
                    '&:hover': { background: 'rgba(255,255,255,0.06)' },
                  }}
                >
                  <span style={{ fontSize: '36px', lineHeight: 1 }}>🗂</span>
                  <Typography
                    sx={{
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      color: 'rgba(255,255,255,0.7)',
                      marginTop: '6px',
                      textAlign: 'center',
                    }}
                  >
                    {folder}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
