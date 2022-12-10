use edgedb_tokio::Client;
use lettre::SmtpTransport;
use std::sync::Arc;

pub struct Service {
    pub db_conn: Arc<Client>,
    pub mailer: Arc<SmtpTransport>,
}
