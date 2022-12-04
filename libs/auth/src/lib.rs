mod errors;

pub use errors::AuthError;
use jwks_client::keyset::KeyStore;
use utilities::{graphql::ApiError, users::AccountType};

///.Returns the user ID from the given JWT
pub fn get_hanko_id_from_authorization_token(token: &str) -> Result<String, AuthError> {
    let jwt = token
        .strip_prefix("Bearer ")
        .ok_or(AuthError::InvalidAuthHeader)?;
    let key_store = KeyStore::new();
    let decoded = key_store
        .decode(jwt)
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
