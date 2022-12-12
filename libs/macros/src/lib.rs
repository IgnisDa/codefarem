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
        let request_data = $context.data_unchecked::<RequestData>();
        let token = request_data
            .user_token
            .as_ref()
            .ok_or_else(|| AuthError::NotAuthorized.extend())?;
        get_hanko_id_from_authorization_token(token.as_str()).await?
    }};
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
