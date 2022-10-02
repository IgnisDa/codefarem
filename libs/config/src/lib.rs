use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct JwtConfig {
    /// The secret key used to sign all JWT keys
    jwt_secret: String,
}

impl JwtConfig {
    pub fn jwt_secret(&self) -> &[u8] {
        self.jwt_secret.as_bytes()
    }
}
