use anyhow::{Ok, Result};
use lettre::transport::smtp::response::Response;
use lettre::Transport;
use lettre::{
    message::MessageBuilder, transport::smtp::authentication::Credentials, Message, SmtpTransport,
};

pub struct Mailer {
    mailer: SmtpTransport,

    message_builder: MessageBuilder,
}

impl Mailer {
    pub fn new(
        smtp_host: String,
        smtp_port: u16,
        smtp_username: String,
        smtp_password: String,
        smtp_from_name: String,
        smtp_from_email: String,
    ) -> Result<Self> {
        let credentials = Credentials::new(smtp_username, smtp_password);

        let mailer = if cfg!(debug_assertions) {
            SmtpTransport::builder_dangerous(&smtp_host)
                .port(smtp_port)
                .credentials(credentials)
                .build()
        } else {
            SmtpTransport::relay(&smtp_host)
                .unwrap()
                .credentials(credentials)
                .build()
        };

        let mailbox = format!("{smtp_from_name} <{smtp_from_email}>")
            .parse()
            .unwrap();
        let message_builder = Message::builder().from(mailbox);

        mailer.test_connection()?;

        Ok(Self {
            mailer,
            message_builder,
        })
    }

    fn send(&self, message: &Message) -> Result<Response> {
        Ok(self.mailer.send(message)?)
    }
}

impl Mailer {
    pub async fn create_invite_link(
        &self,
        to_email: &'_ str,
        role: &'_ str,
        invite_token: &'_ str,
    ) -> Result<()> {
        let body = format!(
            r"
You have been invited to join Codefarem as a {role:?}.
Please use the below given invite token to join the platform.

Invite Token: {invite_token:?}
"
        );
        let message = self
            .message_builder
            .clone()
            .to(to_email.parse().unwrap())
            .subject("Codefarem Invite")
            .body(body)
            .unwrap();
        self.send(&message)?;
        Ok(())
    }
}
