use anyhow::Result;
use lettre::{transport::smtp::authentication::Credentials, SmtpTransport};
use std::env;

pub struct Mailer {
    mailer: SmtpTransport,
}

impl Mailer {
    pub fn new() -> Result<Self> {
        let smtp_host = env::var("SMTP_HOST")?;
        let smtp_port = env::var("SMTP_PORT")?.parse::<u16>()?;
        let smtp_username = env::var("SMTP_USER")?;
        let smtp_password = env::var("SMTP_PASSWORD")?;

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

        Ok(Self { mailer })
    }
}
