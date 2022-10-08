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
        use actix_protobuf::{ProtoBuf, ProtoBufResponseBuilder};
        use actix_web::{error, middleware::Logger, web, App, HttpResponse, HttpServer};
        use log::info;
        use serde::Deserialize;

        mod farem {
            #![allow(clippy::derive_partial_eq_without_eq)]
            include!(concat!(env!("OUT_DIR"), "/farem.rs"));
        }
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
                    .route(
                        "example-proto",
                        web::get().to(|| async {
                            HttpResponse::Ok().protobuf(farem::Example {
                                data: $example_handler().await.into(),
                            })
                        }),
                    )
                    .route("example", web::get().to($example_handler))
                    .route(
                        "farem-proto",
                        web::post().to(|code: ProtoBuf<farem::Input>| async move {
                            let resp = $farem_handler(&code.code);
                            match resp {
                                Ok(_) => HttpResponse::Ok().protobuf(farem::SuccessResponse {
                                    data: resp.unwrap().into(),
                                }),
                                Err(_) => {
                                    HttpResponse::BadRequest().protobuf(farem::ErrorResponse {
                                        data: resp.unwrap_err().into(),
                                    })
                                }
                            }
                        }),
                    )
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

#[macro_export]
macro_rules! proto_server {
    ($example_handler:ident, $compiler_handler:ident) => {
        use log::info;
        use protobuf::generated::compilers::{
            compiler_service_server::{CompilerService, CompilerServiceServer},
            CompileResponse, Example, Input, VoidParams,
        };
        use tonic::{async_trait, transport::Server, Request, Response, Status};

        #[derive(Debug, Default)]
        pub struct CompilerHandler {}

        #[async_trait]
        impl CompilerService for CompilerHandler {
            async fn example_code(
                &self,
                request: Request<VoidParams>,
            ) -> Result<Response<Example>, Status> {
                Ok(Response::new(Example {
                    data: $example_handler().await.into(),
                }))
            }

            async fn compile_code(
                &self,
                request: Request<Input>,
            ) -> Result<Response<CompileResponse>, Status> {
                let resp = $compiler_handler(&request.into_inner().code);
                match resp {
                    Ok(s) => Ok(Response::new(CompileResponse { data: s.into() })),
                    Err(e) => Err(Status::invalid_argument(String::from_utf8(e).unwrap())),
                }
            }
        }

        #[tokio::main]
        async fn main() -> Result<(), Box<dyn std::error::Error>> {
            env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
            let port = std::env::var("PORT").expect("Expected PORT to be set");
            info!("Starting server on port {port:?}");
            let compiler = CompilerHandler::default();
            Server::builder()
                .add_service(CompilerServiceServer::new(compiler))
                .serve(format!("0.0.0.0:{port}").parse()?)
                .await?;

            Ok(())
        }
    };
}
