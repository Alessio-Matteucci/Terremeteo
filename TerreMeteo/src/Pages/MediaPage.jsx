import { Box, Container, Typography } from '@mui/material';
import tachinnoVideo from '../assets/tachinno.mp4';

/**
 * Componente per la visualizzazione di contenuti multimediali
 */
export default function MediaPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 40%, #16213e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
              textAlign: 'center',
            }}
          >
            Contenuti Multimediali
          </Typography>

          <Box
            sx={{
              width: '100%',
              maxWidth: '900px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              backgroundColor: 'rgba(26, 26, 46, 0.6)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <video
              src={tachinnoVideo}
              controls
              autoPlay
              loop
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            >
              Il tuo browser non supporta il tag video.
            </video>
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              textAlign: 'center',
              maxWidth: 600,
              mt: 2,
            }}
          >
            ...
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

