import { Box, Typography, Chip } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { PUBLICATION } from '../../data/content';

export default function PublicationsApp() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pb: 1.5,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <ArticleIcon sx={{ color: '#818cf8', fontSize: 18 }} />
        <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
          Peer-Reviewed Publication
        </Typography>
      </Box>

      <Box
        sx={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(129,140,248,0.2)',
          borderRadius: 2,
          p: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label="ICSE-SEET 2024"
            size="small"
            sx={{ background: 'rgba(129,140,248,0.2)', color: '#a5b4fc', border: '1px solid rgba(129,140,248,0.35)', fontWeight: 600 }}
          />
          <Chip
            label="IEEE / ACM"
            size="small"
            sx={{ background: 'rgba(56,189,248,0.15)', color: '#7dd3fc', border: '1px solid rgba(56,189,248,0.3)' }}
          />
        </Box>

        <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.5, mb: 1.5 }}>
          {PUBLICATION.title}
        </Typography>

        <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, mb: 1.5 }}>
          {PUBLICATION.conference}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            fontSize: 12,
            color: 'rgba(255,255,255,0.4)',
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
            {PUBLICATION.location} · pp. {PUBLICATION.pages}
          </Typography>
        </Box>

        <a href={PUBLICATION.link} target="_blank" rel="noopener noreferrer">
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 2,
              py: 0.75,
              borderRadius: 1.5,
              background: 'rgba(129,140,248,0.15)',
              border: '1px solid rgba(129,140,248,0.3)',
              color: '#a5b4fc',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s ease',
              '&:hover': { background: 'rgba(129,140,248,0.25)' },
            }}
          >
            <OpenInNewIcon sx={{ fontSize: 14 }} />
            View on SMU Ink Library
          </Box>
        </a>
      </Box>

      <Box
        sx={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 2,
          p: 2,
        }}
      >
        <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
          This paper presents a novel microservice-based collaborative problem-solving approach for teaching
          software development using real-world problems, published at the premier international software
          engineering conference.
        </Typography>
      </Box>
    </Box>
  );
}
