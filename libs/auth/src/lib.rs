mod errors;
mod jwt;

use std::str::FromStr;

use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use jwt::Claim;
use scrypt::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Scrypt,
};
use uuid::Uuid;

/// Hashes the password using a randomly generated salt string
pub fn get_hashed_password(password: &str) -> String {
    let salt = SaltString::generate(&mut OsRng);
    let password_hash = Scrypt
        .hash_password(password.as_bytes(), &salt)
        .unwrap()
        .to_string();
    password_hash
}

/// Verify the provided password
pub fn verify_password(password: &str, password_hash: &str) -> bool {
    let parsed_hash = PasswordHash::new(password_hash).unwrap();
    Scrypt
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok()
}

/// Create a JWT token using the given id
pub fn create_jwt_token(secret: &[u8], user_id: &str) -> String {
    let expiration_time = Utc::now()
        .checked_add_signed(Duration::days(60))
        .expect("invalid timestamp")
        .timestamp();
    let claim = Claim {
        sub: user_id.to_string(),
        exp: expiration_time as usize,
    };
    encode(
        &Header::default(),
        &claim,
        &EncodingKey::from_secret(secret),
    )
    .expect("Could not encode token")
}

///.Returns the user ID from the given JWT
pub fn get_user_id_from_authorization_token(secret: &[u8], token: &str) -> Result<Uuid, AuthError> {
    let jwt = token
        .strip_prefix("Bearer ")
        .ok_or(AuthError::InvalidAuthHeader)?;
    let decoded = decode::<Claim>(
        jwt,
        &DecodingKey::from_secret(secret),
        &Validation::default(),
    )
    .map_err(|x| AuthError::InvalidJwtToken(x.to_string()))?;
    Ok(Uuid::from_str(decoded.claims.sub.as_str()).unwrap())
}

pub use errors::AuthError;
