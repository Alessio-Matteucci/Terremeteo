import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';

/**
 * Componente Footer per l'applicazione
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        backgroundColor: 'rgba(26, 26, 46, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(102, 126, 234, 0.2)',
        py: { xs: 3, sm: 4, md: 5 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Sezione Logo e Descrizione */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              TerreMeteo
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 2,
                lineHeight: 1.6,
              }}
            >
              Esplora il meteo e il clima di qualsiasi località del mondo con un'esperienza immersiva e dati aggiornati in tempo reale.
            </Typography>
          </Grid>

          {/* Sezione Link Utili */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: 'white',
                fontSize: { xs: '1rem', sm: '1.125rem' },
              }}
            >
              Link Utili
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Link
                component={RouterLink}
                to="/"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: '#667eea',
                  },
                }}
              >
                Home
              </Link>
              <Link
                component={RouterLink}
                to="/explore"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: '#667eea',
                  },
                }}
              >
                Esplora
              </Link>
              <Link
                component={RouterLink}
                to="/media"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: '#667eea',
                  },
                }}
              >
                Media
              </Link>
            </Box>
          </Grid>

          {/* Sezione Contatti */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: 'white',
                fontSize: { xs: '1rem', sm: '1.125rem' },
              }}
            >
              Contatti
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <EmailIcon sx={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.7)' }} />
                <Link
                  href="mailto:info@terremeteo.com"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: '#667eea',
                    },
                  }}
                >
                  info@terremeteo.com
                </Link>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <PublicIcon sx={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.7)' }} />
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.875rem',
                  }}
                >
                  www.terremeteo.com
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Sezione Social e Copyright */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid rgba(102, 126, 234, 0.2)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.75rem',
            }}
          >
            © {currentYear} TerreMeteo. Tutti i diritti riservati.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
            }}
          >
            <IconButton
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: '#667eea',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                },
              }}
            >
              <GitHubIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
