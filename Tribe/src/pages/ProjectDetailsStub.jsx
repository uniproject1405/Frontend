import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Alert, Button, Container, Typography } from '@mui/material';
import { getExploreProjectById } from '../services/exploreService';

// Placeholder so card links work. Replace with the real details page.
export default function ProjectDetailsStub() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getExploreProjectById(projectId).then(setProject).catch(err => setError(err.message));
  }, [projectId]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button component={Link} to="/explore">بازگشت به کاوش پروژه‌ها</Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {project && (
        <>
          <Typography variant="h4" fontWeight={800} mt={2}>{project.title}</Typography>
          <Typography color="text.secondary" mt={1} lineHeight={1.9}>{project.description}</Typography>
        </>
      )}
    </Container>
  );
}
