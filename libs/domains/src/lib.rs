use rocket::{
    async_trait,
    request::{FromRequest, Outcome},
    Request,
};

#[derive(Debug)]
struct UserRequestData {
    token: String,
}

#[derive(Debug)]
pub struct RequestData {
    user: Option<UserRequestData>,
}

#[async_trait]
impl<'r> FromRequest<'r> for RequestData {
    type Error = String;

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let request_data = RequestData { user: None };
        Outcome::Success(request_data)
    }
}

pub mod farem;
pub mod users;
