#[macro_export]
macro_rules! to_result_union_response {
    ($result:expr, $union:ident) => {
        Ok(match $result {
            Ok(s) => $union::Result(s),
            Err(s) => $union::Error(s),
        })
    };
}

#[macro_export]
macro_rules! user_id_from_request {
    ($context: expr) => {{
        let request_data = $context.data_unchecked::<RequestData>();
        let token = request_data
            .user_token
            .as_ref()
            .ok_or_else(|| AuthError::NotAuthorized.extend())?;
        get_user_id_from_authorization_token(&request_data.jwt_secret[..], token.as_str())?
    }};
}
