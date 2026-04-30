import { Box, Typography, Chip } from '@mui/material';
import { SKILLS } from '../../data/content';

const categoryColors: Record<string, { bg: string; color: string; border: string }> = {
  Languages:             { bg: 'rgba(129,140,248,0.15)', color: '#a5b4fc', border: 'rgba(129,140,248,0.3)' },
  'Frameworks & Libraries': { bg: 'rgba(56,189,248,0.15)',  color: '#7dd3fc', border: 'rgba(56,189,248,0.3)'  },
  'Cloud & DevOps':      { bg: 'rgba(52,211,153,0.15)',  color: '#6ee7b7', border: 'rgba(52,211,153,0.3)'  },
  'AI & ML':             { bg: 'rgba(244,114,182,0.15)', color: '#f9a8d4', border: 'rgba(244,114,182,0.3)' },
  Databases:             { bg: 'rgba(251,146,60,0.15)',  color: '#fdba74', border: 'rgba(251,146,60,0.3)'  },
  Certifications:        { bg: 'rgba(251,191,36,0.15)',  color: '#fcd34d', border: 'rgba(251,191,36,0.3)'  },
};

export default function SkillsApp() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {(Object.entries(SKILLS) as [string, string[]][]).map(([category, items]) => {
        const colors = categoryColors[category] ?? { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: 'rgba(255,255,255,0.15)' };
        return (
          <Box key={category}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: colors.color,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                mb: 1,
                opacity: 0.85,
              }}
            >
              {category}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {items.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  size="small"
                  sx={{
                    fontSize: 12,
                    height: 26,
                    background: colors.bg,
                    color: colors.color,
                    border: `1px solid ${colors.border}`,
                    fontWeight: 500,
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: `0 4px 12px ${colors.border}`,
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
