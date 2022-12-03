mod errors;
mod jwt;

pub use errors::AuthError;

use std::str::FromStr;

use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use jwt::Claim;
use utilities::{graphql::ApiError, users::AccountType};
use uuid::Uuid;

/// Create a JWT token using the given id
pub fn create_jwt_token(secret: &[u8], user_id: &str, account_type: &AccountType) -> String {
    let expiration_time = Utc::now()
        .checked_add_signed(Duration::days(60))
        .expect("invalid timestamp")
        .timestamp();
    let claim = Claim {
        sub: user_id.to_string(),
        at: *account_type,
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
pub fn get_user_id_from_authorization_token(
    secret: &[u8],
    token: &str,
) -> Result<(Uuid, AccountType), AuthError> {
    let jwt = token
        .strip_prefix("Bearer ")
        .ok_or(AuthError::InvalidAuthHeader)?;
    let decoded = decode::<Claim>(
        jwt,
        &DecodingKey::from_secret(secret),
        &Validation::default(),
    )
    .map_err(|x| AuthError::InvalidJwtToken(x.to_string()))?;
    Ok((
        Uuid::from_str(decoded.claims.sub.as_str()).unwrap(),
        decoded.claims.at,
    ))
}

/// Checks if the user is allowed to access the resource
pub fn validate_user_role(
    required_account_type: &AccountType,
    received_account_type: &AccountType,
) -> Result<(), ApiError> {
    if required_account_type != received_account_type {
        return Err(ApiError {
            error: format!("Only {required_account_type} can perform this action"),
        });
    }
    Ok(())
}
