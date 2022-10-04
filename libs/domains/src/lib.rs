use rocket::{
    async_trait,
    request::{FromRequest, Outcome},
    Request,
};

#[derive(Debug)]
pub struct RequestData {
    pub user_token: Option<String>,
    pub jwt_secret: Vec<u8>,
}

pub struct Token(pub Option<String>);

#[async_trait]
impl<'r> FromRequest<'r> for Token {
    type Error = String;

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let token_str = request
            .headers()
            .get_one("authorization")
            .map(|f| f.to_string());
        let token = Token(token_str);
        Outcome::Success(token)
    }
}

pub mod farem;
pub mod users;
