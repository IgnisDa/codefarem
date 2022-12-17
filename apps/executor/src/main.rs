use duct::{cmd, Expression};
use log::{error, info};
use protobuf::generated::executor::{
    executor_service_server::{ExecutorService, ExecutorServiceServer},
    ExecutorInput, ExecutorOutput,
};
use std::io::Write;
use tonic::{async_trait, transport::Server, Request, Response, Status};
use utilities::{generate_random_file, get_server_url, SupportedLanguage};

fn get_command_to_run(language: SupportedLanguage) -> Expression {
    match language {
        SupportedLanguage::Python => cmd!("wasmtime"),
        _ => cmd!("wasmtime"),
    }
}

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
        let mut program_args = vec![file_path.to_string_lossy().to_string()];
        let arguments = request.get_ref().arguments.clone();
        if !arguments.is_empty() {
            program_args.extend(arguments);
        }
        let command = cmd("wasmtime", program_args);
        info!("Running command: {:?}", command);
        let command_output = command
            .unchecked()
            .stdout_capture()
            .stderr_capture()
            .run()
            .unwrap();
        if command_output.status.success() {
            info!("Executed wasmtime on file {:?} successfully", file_path);
            Ok(Response::new(ExecutorOutput {
                data: command_output.stdout,
            }))
        } else {
            error!(
                "Compilation unsuccessful, with status: {:?} ",
                command_output.status
            );
            Err(Status::invalid_argument(
                String::from_utf8(command_output.stderr).unwrap(),
            ))
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    let server_url = get_server_url();
    let executor = ExecutorHandler::default();
    Server::builder()
        .add_service(ExecutorServiceServer::new(executor))
        .serve(server_url.parse()?)
        .await?;
    Ok(())
}
