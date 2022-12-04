import { Box, Button } from '@mui/material';
import { type NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Codefarem Admin</title>
        <meta name="description" content="The admin app for Codefarem" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <h1>Hello world!</h1>
        <Button>Click me</Button>
      </Box>
    </>
  );
};

export default Home;
