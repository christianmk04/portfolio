import { Box, Typography, Chip } from '@mui/material';
import { INTERNSHIPS, SKILLS, PUBLICATION } from '../../data/content';

const sectionHeader: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#818cf8',
  marginBottom: '12px',
  fontVariant: 'small-caps',
};

const divider: React.CSSProperties = {
  borderBottom: '1px solid rgba(255,255,255,0.07)',
  marginBottom: '20px',
  marginTop: '20px',
};

export default function ResumeApp() {
  return (
    <Box
      sx={{
        background: '#0d1117',
        color: 'rgba(255,255,255,0.88)',
        height: '100%',
        overflowY: 'auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      }}
    >
      {/* Header Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 28px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <Box>
          <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
            Christian Michael Koh
          </Typography>
          <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
            Information Systems · SMU · GPA 3.96
          </Typography>
        </Box>
        <a
          href="/Christian_Koh_Resume.pdf"
          download="Christian_Koh_Resume.pdf"
          style={{
            background: '#6366f1',
            color: '#fff',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#4f46e5')}
          onMouseLeave={e => (e.currentTarget.style.background = '#6366f1')}
        >
          ⬇ Download PDF
        </a>
      </Box>

      {/* Content */}
      <Box sx={{ padding: '24px 28px' }}>

        {/* Education */}
        <div style={sectionHeader}>Education</div>
        <Box sx={{ marginBottom: '8px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                Singapore Management University, School of Computing &amp; Information Systems
              </Typography>
              <Typography sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>
                B.Sc. Information Systems
              </Typography>
              <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
                GPA: 3.96 / 4.00 &nbsp;·&nbsp; Summa Cum Laude &nbsp;·&nbsp; Dean's List (all applicable years)
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', ml: 2, mt: '2px' }}>
              Aug 2021 – May 2026
            </Typography>
          </Box>
        </Box>

        <div style={divider} />

        {/* Experience */}
        <div style={sectionHeader}>Experience</div>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '4px' }}>
          {INTERNSHIPS.map((intern, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: '10px 12px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                  {intern.company}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '1px' }}>
                  {intern.role}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', ml: 2, mt: '2px' }}>
                {intern.period}
              </Typography>
            </Box>
          ))}
        </Box>

        <div style={divider} />

        {/* Skills */}
        <div style={sectionHeader}>Skills</div>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '4px' }}>
          {Object.entries(SKILLS).map(([category, items]) => (
            <Box key={category}>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: '6px' }}>
                {category}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {items.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    size="small"
                    sx={{
                      background: 'rgba(99,102,241,0.15)',
                      color: '#a5b4fc',
                      border: '1px solid rgba(99,102,241,0.25)',
                      fontSize: '11px',
                      height: '22px',
                    }}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        <div style={divider} />

        {/* Publications */}
        <div style={sectionHeader}>Publications</div>
        <Box
          sx={{
            padding: '14px',
            borderRadius: '6px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#fff', lineHeight: 1.5, marginBottom: '6px' }}>
            {PUBLICATION.title}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '4px' }}>
            {PUBLICATION.venue} &nbsp;·&nbsp; {PUBLICATION.conference}
          </Typography>
          <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>
            {PUBLICATION.location} &nbsp;·&nbsp; pp. {PUBLICATION.pages}
          </Typography>
          <a
            href={PUBLICATION.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '12px', color: '#818cf8', textDecoration: 'none' }}
          >
            View on SMU Ink Library →
          </a>
        </Box>

      </Box>
    </Box>
  );
}
