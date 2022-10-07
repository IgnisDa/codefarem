use std::{fs, path::PathBuf};

use duct::Expression;
use utilities::generate_random_file;

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

pub fn generate_input_and_output_files(extension: &'_ str, code: &'_ str) -> (PathBuf, PathBuf) {
    let (_, input_file_path) = generate_random_file(Some(extension)).unwrap();
    fs::write(&input_file_path, code).unwrap();
    let (_, output_file_path) = generate_random_file(Some("wasm")).unwrap();
    (input_file_path, output_file_path)
}

pub fn run_command_and_capture_output(
    command: Expression,
    output_file_path: &PathBuf,
) -> Result<Vec<u8>, Vec<u8>> {
    let output = command.unchecked().stderr_capture().run().unwrap();
    if output.status.success() {
        Ok(fs::read(output_file_path).unwrap())
    } else {
        Err(output.stderr)
    }
}
