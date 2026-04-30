import { Box, Typography, Chip } from '@mui/material';
import { INTERNSHIPS } from '../../data/content';

const accentColors = [
  '#818cf8', // indigo
  '#38bdf8', // sky
  '#34d399', // emerald
  '#f472b6', // pink
  '#fb923c', // orange
  '#a78bfa', // violet
];

export default function ExperienceApp() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', mb: 0.5 }}>
        {INTERNSHIPS.length} internships across AI research, government, and industry
      </Typography>

      {INTERNSHIPS.map((job, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            gap: 2,
          }}
        >
          {/* Timeline line */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: '4px' }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: accentColors[i % accentColors.length],
                flexShrink: 0,
                boxShadow: `0 0 8px ${accentColors[i % accentColors.length]}80`,
              }}
            />
            {i < INTERNSHIPS.length - 1 && (
              <Box
                sx={{
                  width: 1,
                  flex: 1,
                  mt: 0.5,
                  background: `linear-gradient(to bottom, ${accentColors[i % accentColors.length]}50, transparent)`,
                  minHeight: 20,
                }}
              />
            )}
          </Box>

          {/* Content */}
          <Box
            sx={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 2,
              p: 2,
              mb: i < INTERNSHIPS.length - 1 ? 0.5 : 0,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#fff', lineHeight: 1.3 }}>
                {job.role}
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', ml: 1 }}>
                {job.period}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: 13,
                color: accentColors[i % accentColors.length],
                mb: 1,
                fontWeight: 500,
              }}
            >
              {job.company}
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 1.5, '& li': { fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, mb: 0.5 } }}>
              {job.bullets.map((b, bi) => (
                <li key={bi}>{b}</li>
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {job.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    fontSize: 10,
                    height: 20,
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
