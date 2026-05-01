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

// Map company name substrings to logo files in /public/logos/
const COMPANY_LOGOS: Record<string, string> = {
  'Cinch':                       '/logos/cinch.png',
  'Mindsprint':                  '/logos/mindsprint.png',
  'Central Provident Fund':      '/logos/cpf.png',
  'Singapore Management University': '/logos/smu.png',
  'Ministry of Home Affairs':    '/logos/mha.png',
};

function getLogoSrc(company: string): string | null {
  for (const [key, src] of Object.entries(COMPANY_LOGOS)) {
    if (company.includes(key)) return src;
  }
  return null;
}

function CompanyLogo({ company, accent }: { company: string; accent: string }) {
  const src = getLogoSrc(company);
  if (!src) return null;

  // Logos with light/white backgrounds need a dark pill; others (Mindsprint on black) get a light pill
  const isMindSprint = company.includes('Mindsprint');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 52,
        height: 52,
        borderRadius: 2,
        flexShrink: 0,
        overflow: 'hidden',
        background: isMindSprint
          ? 'rgba(255,255,255,0.92)'
          : 'rgba(255,255,255,0.92)',
        border: `1px solid ${accent}30`,
        p: '6px',
      }}
    >
      <Box
        component="img"
        src={src}
        alt={company}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
        }}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </Box>
  );
}

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
          {/* Timeline dot + line */}
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

          {/* Card */}
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
            {/* Header row: logo + role/period */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1 }}>
              <CompanyLogo company={job.company} accent={accentColors[i % accentColors.length]} />

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.25 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#fff', lineHeight: 1.3 }}>
                    {job.role}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', ml: 1 }}>
                    {job.period}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: accentColors[i % accentColors.length],
                    fontWeight: 500,
                  }}
                >
                  {job.company}
                </Typography>
              </Box>
            </Box>

            {/* Bullets */}
            <Box component="ul" sx={{ pl: 2, mb: 1.5, '& li': { fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, mb: 0.5 } }}>
              {job.bullets.map((b, bi) => (
                <li key={bi}>{b}</li>
              ))}
            </Box>

            {/* Tags */}
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
