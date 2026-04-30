import { Box, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import GitHubIcon from '@mui/icons-material/GitHub';
import { CONTACT } from '../../data/content';

interface ContactRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  color: string;
}

function ContactRow({ icon, label, value, href, color }: ContactRowProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderRadius: 2,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          cursor: 'pointer',
          transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.15s ease',
          '&:hover': {
            background: 'rgba(255,255,255,0.07)',
            borderColor: `${color}60`,
            transform: 'translateX(4px)',
          },
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${color}18`,
            border: `1px solid ${color}30`,
            color: color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {label}
          </Typography>
          <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 500, mt: 0.25 }}>
            {value}
          </Typography>
        </Box>
      </Box>
    </a>
  );
}

export default function ContactApp() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
          Let's Connect
        </Typography>
        <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
          Open to full-time roles and interesting collaborations
        </Typography>
      </Box>

      <ContactRow
        icon={<EmailIcon fontSize="small" />}
        label="Email"
        value={CONTACT.email}
        href={`mailto:${CONTACT.email}`}
        color="#818cf8"
      />
      <ContactRow
        icon={<LinkedInIcon fontSize="small" />}
        label="LinkedIn"
        value="linkedin.com/in/04christiankoh"
        href={CONTACT.linkedin}
        color="#38bdf8"
      />
      <ContactRow
        icon={<PhoneIcon fontSize="small" />}
        label="Phone"
        value={CONTACT.phone}
        href={`tel:${CONTACT.phone}`}
        color="#34d399"
      />
      <ContactRow
        icon={<GitHubIcon fontSize="small" />}
        label="GitHub"
        value="04christiankoh"
        href={CONTACT.github}
        color="#f472b6"
      />
    </Box>
  );
}
