import { Box, Typography, Chip, Avatar } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export default function AboutApp() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header: photo + name */}
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        <Avatar
          src="/profile.jpg"
          alt="Christian Koh"
          sx={{
            width: 120,
            height: 120,
            flexShrink: 0,
            border: '2px solid rgba(255,255,255,0.15)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
            Christian Michael Koh
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, mt: 0.5 }}>
            Information Systems Student · Software Engineer
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
            <Chip
              label="AI / LLMs"
              size="small"
              sx={{ background: 'rgba(129,140,248,0.18)', color: '#a5b4fc', border: '1px solid rgba(129,140,248,0.3)', fontSize: 11 }}
            />
            <Chip
              label="Full Stack"
              size="small"
              sx={{ background: 'rgba(56,189,248,0.15)', color: '#7dd3fc', border: '1px solid rgba(56,189,248,0.3)', fontSize: 11 }}
            />
            <Chip
              label="Cloud & DevOps"
              size="small"
              sx={{ background: 'rgba(52,211,153,0.15)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.3)', fontSize: 11 }}
            />
          </Box>
        </Box>
      </Box>

      {/* Bio */}
      <Box
        sx={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 2,
          p: 2,
        }}
      >
        <Typography sx={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.75)' }}>
          Hi! I'm a final-year Information Systems student at SMU passionate about AI, full-stack development,
          and building things that matter. I've worked across government agencies, research labs, and startups,
          always at the intersection of AI and software engineering. I love turning complex problems into elegant, practical solutions.
        </Typography>
      </Box>

      {/* Education */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <SchoolIcon sx={{ fontSize: 16, color: '#818cf8' }} />
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Education
          </Typography>
        </Box>
        <Box
          sx={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 2,
            p: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>
              B.Sc. (Information Systems)
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
              Aug 2021 – May 2026
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', mb: 1.5 }}>
            Singapore Management University, School of Computing & Information Systems
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={<EmojiEventsIcon sx={{ fontSize: '14px !important' }} />}
              label="GPA 3.96 / 4.00 · Summa Cum Laude"
              size="small"
              sx={{ background: 'rgba(251,191,36,0.15)', color: '#fcd34d', border: '1px solid rgba(251,191,36,0.3)', fontSize: 11 }}
            />
            <Chip
              label="Dean's List · All Applicable Years"
              size="small"
              sx={{ background: 'rgba(251,191,36,0.1)', color: '#fcd34d', border: '1px solid rgba(251,191,36,0.2)', fontSize: 11 }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            <Chip
              label="SCIS Excellence Scholarship AY2022-23"
              size="small"
              sx={{ background: 'rgba(129,140,248,0.1)', color: '#a5b4fc', border: '1px solid rgba(129,140,248,0.2)', fontSize: 11 }}
            />
            <Chip
              label="SAS Institute Scholarship AY2024-25"
              size="small"
              sx={{ background: 'rgba(129,140,248,0.1)', color: '#a5b4fc', border: '1px solid rgba(129,140,248,0.2)', fontSize: 11 }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
