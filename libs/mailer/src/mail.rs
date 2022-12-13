use anyhow::Result;
use lettre::{
    message::MessageBuilder, transport::smtp::authentication::Credentials, Message, SmtpTransport,
};
use std::env;

fn message_settings() -> Result<MessageBuilder> {
    let from_name = env::var("CODEFAREM_FROM_EMAIL_NAME")?;
    let from_email = env::var("CODEFAREM_FROM_EMAIL")?;
    let mailbox = format!("{from_name} <{from_email}>").parse().unwrap();
    Ok(Message::builder().from(mailbox))
}

pub struct Mailer {
    mailer: SmtpTransport,
}

impl Mailer {
    // TODO: Use figment to validate the env vars

    pub fn new() -> Result<Self> {
        let smtp_host = env::var("CODEFAREM_SMTP_HOST")?;
        let smtp_port = env::var("CODEFAREM_SMTP_PORT")?.parse::<u16>()?;
        let smtp_username = env::var("CODEFAREM_SMTP_USER")?;
        let smtp_password = env::var("CODEFAREM_SMTP_PASSWORD")?;

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

        mailer.test_connection()?;

        message_settings()?;

        Ok(Self { mailer })
    }
}

impl Mailer {
    pub async fn create_invite_link() {}
}
