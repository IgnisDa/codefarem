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
macro_rules! hanko_id_from_request {
    ($context: expr) => {{
        let token = &$context
            .data::<Token>()
            .map_err(|_| AuthError::NotAuthorized.extend())?
            .0;
        let app_config = $context.data_unchecked::<AppConfig>();
        get_hanko_id_from_authorization_token(token, &app_config.service_urls.authenticator).await?
    }};
}

#[macro_export]
macro_rules! proto_server {
    ($example:ident, $compiler_handler:ident, $toolchain_version_handler:ident, $language_logo:ident) => {
        use log::info;
        use protobuf::generated::languages::{
            compiler_service_server::{CompilerService, CompilerServiceServer},
            CompileResponse, Example, Input, ToolchainInfoResponse, VoidParams,
        };
        use tonic::{async_trait, transport::Server, Request, Response, Status};
        use utilities::get_server_url;

        #[derive(Debug, Default)]
        pub struct CompilerHandler {}

        #[async_trait]
        impl CompilerService for CompilerHandler {
            async fn example_code(
                &self,
                request: Request<VoidParams>,
            ) -> Result<Response<Example>, Status> {
                Ok(Response::new(Example {
                    data: $example.into(),
                }))
            }

            async fn compile_code(
                &self,
                request: Request<Input>,
            ) -> Result<Response<CompileResponse>, Status> {
                let resp = $compiler_handler(&request.into_inner().code);
                match resp {
                    Ok(s) => Ok(Response::new(CompileResponse {
                        data: s.0.into(),
                        elapsed: s.1,
                    })),
                    Err(e) => Err(Status::invalid_argument(String::from_utf8(e).unwrap())),
                }
            }

            async fn toolchain_info(
                &self,
                request: Request<VoidParams>,
            ) -> Result<Response<ToolchainInfoResponse>, Status> {
                let version = $toolchain_version_handler();
                Ok(Response::new(ToolchainInfoResponse {
                    version: version.into(),
                    language_logo: $language_logo.to_string(),
                }))
            }
        }

        #[tokio::main]
        async fn main() -> Result<(), Box<dyn std::error::Error>> {
            env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
            let server_url = get_server_url();
            let compiler = CompilerHandler::default();
            Server::builder()
                .add_service(CompilerServiceServer::new(compiler))
                .serve(server_url.parse()?)
                .await?;

            Ok(())
        }
    };
}
