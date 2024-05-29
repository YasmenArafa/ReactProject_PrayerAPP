
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';
import { Container } from '@mui/material'

const ResponsiveCard = styled(Card)(({ theme }) => ({ width: '100%', height: 'auto',
[theme.breakpoints.up('sm')]: {width: '150px', height: '300px',margin: "-20px"}, 
[theme.breakpoints.up('md')]: { width: '16vw', height: '300px',  margin: "-20px"}, 
[theme.breakpoints.up('lg')]: { width: '16vw', height: '310px', margin: "-20px"},
}));

export default function Prayer({name, time, image}) {
  return (
    <Container>
      <ResponsiveCard>
      <CardMedia
        sx={{ height: 140 }}
        image= {image}
        title="green iguana"
      />
      <CardContent >
        <Typography variant='h4'>
          {name}
        </Typography>
        <Typography variant="h3" color="text.secondary">
            {time}
        </Typography>
      </CardContent>
    </ResponsiveCard>
    </Container>
  );
}
