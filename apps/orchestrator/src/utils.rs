use axum::http::HeaderMap;
use edgedb_tokio::Error;
use log::error;
use utilities::graphql::ApiError;

pub struct Token(pub String);

pub fn get_token_from_headers(headers: &HeaderMap) -> Option<Token> {
    headers
        .get("authorization")
        .and_then(|value| value.to_str().map(|s| Token(s.to_string())).ok())
}

// A function that logs the error and then returns an ApiError
pub fn log_error_and_return_api_error(e: Error, error_string: &str) -> ApiError {
    error!("{}", e);
    ApiError {
        error: error_string.to_string(),
    }
}
