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

#[macro_export]
macro_rules! main_function {
    ($example_handler:ident, $farem_handler:ident) => {
        use actix_web::{error, middleware::Logger, web, App, HttpResponse, HttpServer};
        use log::info;
        use serde::Deserialize;

        #[derive(Debug, Deserialize)]
        struct FaremInput {
            code: String,
        }

        #[tokio::main]
        async fn main() -> std::io::Result<()> {
            env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
            let port = std::env::var("PORT").expect("Expected PORT to be set");
            info!("Starting server on port {port:?}");
            HttpServer::new(|| {
                App::new()
                    .wrap(Logger::default())
                    .route("example", web::get().to($example_handler))
                    .route(
                        "farem",
                        web::post().to(|code: web::Json<FaremInput>| async move {
                            let resp = $farem_handler(&code.code);
                            resp.map_err(|e| error::ErrorBadRequest(String::from_utf8(e).unwrap()))
                        }),
                    )
            })
            .bind(format!("0.0.0.0:{port}"))?
            .run()
            .await
        }
    };
}
