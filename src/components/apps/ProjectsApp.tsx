import { Box, Typography, Chip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { PROJECTS } from '../../data/content';

const cardAccents = ['#818cf8', '#34d399', '#38bdf8'];

export default function ProjectsApp() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {PROJECTS.map((project, i) => (
        <Box
          key={i}
          sx={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid rgba(255,255,255,0.08)`,
            borderLeft: `3px solid ${cardAccents[i % cardAccents.length]}`,
            borderRadius: 2,
            p: 2.5,
            transition: 'background 0.2s ease',
            '&:hover': {
              background: 'rgba(255,255,255,0.06)',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>
                {project.name}
              </Typography>
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <OpenInNewIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#818cf8' }, transition: 'color 0.2s' }} />
                </a>
              )}
            </Box>
            <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
              {project.period}
            </Typography>
          </Box>

          <Typography sx={{ fontSize: 12, color: cardAccents[i % cardAccents.length], fontWeight: 500, mb: 1 }}>
            {project.role}
          </Typography>

          <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, mb: 1.5 }}>
            {project.description}
          </Typography>

          <Box component="ul" sx={{ pl: 2, mb: 1.5, '& li': { fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, mb: 0.5 } }}>
            {project.bullets.map((b, bi) => (
              <li key={bi}>{b}</li>
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {project.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  fontSize: 10,
                  height: 20,
                  background: `${cardAccents[i % cardAccents.length]}18`,
                  color: cardAccents[i % cardAccents.length],
                  border: `1px solid ${cardAccents[i % cardAccents.length]}40`,
                }}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
