use async_graphql::{Error, ErrorExtensions};
use strum::IntoStaticStr;
use thiserror::Error;

#[derive(Debug, Error, IntoStaticStr)]
pub enum AuthError {
    #[error("Authorization header required")]
    AuthHeaderRequired,

    #[error("Found an invalid auth header")]
    InvalidAuthHeader,

    #[error("You are not authorized to view this resource")]
    NotAuthorized,
}

impl ErrorExtensions for AuthError {
    fn extend(&self) -> Error {
        let err_code: &'static str = self.into();
        Error::new(self.to_string()).extend_with(|_err, e| {
            e.set("code", err_code);
        })
    }
}
