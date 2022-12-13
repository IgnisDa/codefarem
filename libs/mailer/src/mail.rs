use anyhow::Result;
use lettre::{
    message::MessageBuilder, transport::smtp::authentication::Credentials, Message, SmtpTransport,
};
use std::env;

fn message_settings() -> Result<MessageBuilder> {
    let from_name = env::var("CODEFAREM_SMTP__FROM__NAME")?;
    let from_email = env::var("CODEFAREM_SMTP__FROM__EMAIL")?;
    let mailbox = format!("{from_name} <{from_email}>").parse().unwrap();
    Ok(Message::builder().from(mailbox))
}

pub struct Mailer {
    mailer: SmtpTransport,
}

impl Mailer {
    pub fn new(
        smtp_host: String,
        smtp_port: u16,
        smtp_username: String,
        smtp_password: String,
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

        mailer.test_connection()?;

        message_settings()?;

        Ok(Self { mailer })
    }
}

impl Mailer {
    pub async fn create_invite_link() {}
}
