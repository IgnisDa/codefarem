mod errors;

use std::env;

pub use errors::AuthError;
use jwksclient2::keyset::KeyStore;
use utilities::{graphql::ApiError, users::AccountType};

pub fn get_jwks_endpoint() -> String {
    let authenticator_url = env::var("CODEFAREM_AUTHENTICATOR_URL").unwrap();
    format!("{authenticator_url}/.well-known/jwks.json")
}

///.Returns the hanko ID from the authorization token
pub async fn get_hanko_id_from_authorization_token(token: &str) -> Result<String, AuthError> {
    let jwt = token
        .strip_prefix("Bearer ")
        .ok_or(AuthError::InvalidAuthHeader)?;
    let key_store = KeyStore::new_from(get_jwks_endpoint())
        .await
        .map_err(|_| AuthError::InvalidConfig)?;
    let decoded = key_store
        .verify(jwt)
        .map_err(|_| AuthError::InvalidAuthHeader)?;
    Ok(decoded.payload().sub().unwrap().to_string())
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
