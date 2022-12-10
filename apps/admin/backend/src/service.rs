use std::sync::Arc;

use edgedb_tokio::Client as DbClient;

pub struct Service {
    pub db_conn: Arc<DbClient>,
}
