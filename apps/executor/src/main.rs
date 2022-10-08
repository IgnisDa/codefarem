use std::io::Write;

use duct::cmd;
use log::info;
use protobuf::generated::executor::{
    executor_service_server::{ExecutorService, ExecutorServiceServer},
    ExecutorInput, ExecutorOutput,
};
use tonic::{async_trait, transport::Server, Request, Response, Status};
use utilities::generate_random_file;

#[derive(Debug, Default)]
struct ExecutorHandler {}

#[async_trait]
impl ExecutorService for ExecutorHandler {
    async fn execute(
        &self,
        request: Request<ExecutorInput>,
    ) -> Result<Response<ExecutorOutput>, Status> {
        let (mut file, file_path) = generate_random_file(Some("wasm")).unwrap();
        file.write_all(request.get_ref().data.as_slice()).unwrap();
        let command_output = cmd!("wasmtime", file_path)
            .unchecked()
            .stdout_capture()
            .stderr_capture()
            .run()
            .unwrap();
        if command_output.status.success() {
            Ok(Response::new(ExecutorOutput {
                data: command_output.stdout,
            }))
        } else {
            Err(Status::invalid_argument(
                String::from_utf8(command_output.stderr).unwrap(),
            ))
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    let port = std::env::var("PORT").expect("Expected PORT to be set");
    info!("Starting server on port {port:?}");
    let executor = ExecutorHandler::default();
    Server::builder()
        .add_service(ExecutorServiceServer::new(executor))
        .serve(format!("0.0.0.0:{port}").parse()?)
        .await?;

    Ok(())
}
