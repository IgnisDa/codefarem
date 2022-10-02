use rocket::{
    async_trait,
    request::{FromRequest, Outcome},
    Request,
};

#[derive(Debug)]
pub struct UserRequestData {
    pub token: String,
}

#[derive(Debug)]
pub struct RequestData {
    pub user: Option<UserRequestData>,
}

#[async_trait]
impl<'r> FromRequest<'r> for RequestData {
    type Error = String;

    async fn from_request(_request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let request_data = RequestData { user: None };
        Outcome::Success(request_data)
    }
}

pub mod farem;
pub mod users;
