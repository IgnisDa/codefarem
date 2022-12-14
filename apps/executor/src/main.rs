use duct::cmd;
use log::{error, info};
use protobuf::generated::executor::{
    executor_service_server::{ExecutorService, ExecutorServiceServer},
    ExecutorInput, ExecutorOutput, Language, ToolchainInfoResponse, VoidParams,
};
use std::{io::Write, path::PathBuf, time::Instant};
use tonic::{async_trait, transport::Server, Request, Response, Status};
use utilities::{generate_random_file, get_command_output, get_server_url, CODEFAREM_TEMP_PATH};

fn get_command_args(language: Language, file_path: PathBuf) -> Vec<String> {
    let binding = file_path.to_string_lossy().to_string();
    match language {
        Language::Python => {
            vec![
                format!("--dir={}", CODEFAREM_TEMP_PATH.to_string_lossy()),
                "--mapdir=/opt/wasi-python::/opt/wasi-python".to_string(),
                "--".to_string(),
                "/opt/wasi-python/bin/python3.wasm".to_string(),
                binding,
            ]
        }
        Language::Ruby => vec![
            // FIXME: We need to specify the parent directory which seems a bit wonky
            format!(
                "--dir={}",
                CODEFAREM_TEMP_PATH.parent().unwrap().to_string_lossy()
            ),
            "--mapdir=/usr::/opt/wasi-ruby".to_string(),
            "--".to_string(),
            "/opt/wasi-ruby/local/bin/ruby".to_string(),
            binding,
        ],
        _ => vec![binding],
    }
}

fn toolchain_version() -> String {
    get_command_output("wasmtime", &["--version"]).unwrap()
}

#[derive(Debug, Default)]
struct ExecutorHandler {}

#[async_trait]
impl ExecutorService for ExecutorHandler {
    async fn toolchain_info(
        &self,
        _request: Request<VoidParams>,
    ) -> Result<Response<ToolchainInfoResponse>, Status> {
        let version = toolchain_version();
        Ok(Response::new(ToolchainInfoResponse { version }))
    }

    async fn execute(
        &self,
        request: Request<ExecutorInput>,
    ) -> Result<Response<ExecutorOutput>, Status> {
        let (mut file, file_path) = generate_random_file(Some("wasm")).unwrap();
        file.write_all(request.get_ref().data.as_slice()).unwrap();
        let mut program_args = vec![];
        let language = Language::from_i32(request.get_ref().language).unwrap();
        let command_args = get_command_args(language, file_path.clone());
        program_args.extend(command_args);
        let arguments = request.get_ref().arguments.clone();
        if !arguments.is_empty() {
            program_args.extend(arguments);
        }
        let command = cmd("wasmtime", program_args);
        info!("Running command: {:?}", command);
        let start = Instant::now();
        let command_output = command
            .unchecked()
            .stdout_capture()
            .stderr_capture()
            .run()
            .unwrap();
        let elapsed = start.elapsed();
        if command_output.status.success() {
            info!("Executed wasmtime on file {:?} successfully", file_path);
            Ok(Response::new(ExecutorOutput {
                data: command_output.stdout,
                elapsed: format!("{:?}", elapsed),
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
