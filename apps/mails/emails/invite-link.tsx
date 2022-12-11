import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';

const main = {
  backgroundColor: '#ffffff',
};

const container = {
  margin: '0 auto',
  paddingLeft: '12px',
  paddingRight: '12px',
};

const h1 = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const link = {
  color: '#2754C5',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  textDecoration: 'underline',
};

const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0',
};

const footer = {
  color: '#898989',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  lineHeight: '22px',
  marginBottom: '24px',
  marginTop: '12px',
};

const code = {
  backgroundColor: '#f4f4f4',
  border: '1px solid #eee',
  borderRadius: '5px',
  color: '#333',
  display: 'inline-block',
  padding: '16px 4.5%',
  width: '90.5%',
};

export default function InviteLinkEmail() {
  return (
    <Html>
      <Head />
      <Preview>Log in with this magic link</Preview>
      <Section style={main}>
        <Container style={container}>
          <Text style={h1}>Login</Text>
          <Link
            href="https://notion.so"
            target="_blank"
            style={{
              ...link,
              display: 'block',
              marginBottom: '16px',
            }}
          >
            Click here to log in with this magic link
          </Link>
          <Text style={{ ...text, marginBottom: '14px' }}>
            Or, copy and paste this temporary login code:
          </Text>
          <code style={code}>sparo-ndigo-amurt-secan</code>
          <Text
            style={{
              ...text,
              color: '#ababab',
              marginBottom: '16px',
              marginTop: '14px',
            }}
          >
            If you didn&apos;t try to login, you can safely ignore this email.
          </Text>
          <Text
            style={{
              ...text,
              color: '#ababab',
              marginBottom: '38px',
              marginTop: '12px',
            }}
          >
            Hint: You can set a permanent password in Settings & members → My
            account.
          </Text>
          <Img
            src="https://assets.react.email/demo/notion-logo.png"
            width="32"
            height="32"
            alt="Notion's Logo"
          />
          <Text style={footer}>
            <Link
              href="https://notion.so"
              target="_blank"
              style={{ ...link, color: '#898989' }}
            >
              Notion.so
            </Link>
            , the all-in-one-workspace
            <br />
            for your notes, tasks, wikis, and databases.
          </Text>
        </Container>
      </Section>
    </Html>
  );
}
