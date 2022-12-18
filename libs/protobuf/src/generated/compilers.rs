/// A message type which can be used if no parameters are needed
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct VoidParams {
}
/// A code snippet example for a particular language
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Example {
    #[prost(string, tag="1")]
    pub data: ::prost::alloc::string::String,
}
/// The input source that needs to be compiled
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Input {
    #[prost(string, tag="1")]
    pub code: ::prost::alloc::string::String,
}
/// The response returned when compiling source to wasm
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CompileResponse {
    /// The compiled wasm output
    #[prost(bytes="vec", tag="1")]
    pub data: ::prost::alloc::vec::Vec<u8>,
    /// The time elapsed to compile the source
    #[prost(string, tag="2")]
    pub elapsed: ::prost::alloc::string::String,
}
/// The response returned when getting information about the compiler toolchain
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ToolchainInfoResponse {
    /// The version of the compiler toolchain
    #[prost(string, tag="1")]
    pub version: ::prost::alloc::string::String,
}
/// Generated client implementations.
pub mod compiler_service_client {
    #![allow(unused_variables, dead_code, missing_docs, clippy::let_unit_value)]
    use tonic::codegen::*;
    use tonic::codegen::http::Uri;
    /// The farem related services
    #[derive(Debug, Clone)]
    pub struct CompilerServiceClient<T> {
        inner: tonic::client::Grpc<T>,
    }
    impl CompilerServiceClient<tonic::transport::Channel> {
        /// Attempt to create a new client by connecting to a given endpoint.
        pub async fn connect<D>(dst: D) -> Result<Self, tonic::transport::Error>
        where
            D: std::convert::TryInto<tonic::transport::Endpoint>,
            D::Error: Into<StdError>,
        {
            let conn = tonic::transport::Endpoint::new(dst)?.connect().await?;
            Ok(Self::new(conn))
        }
    }
    impl<T> CompilerServiceClient<T>
    where
        T: tonic::client::GrpcService<tonic::body::BoxBody>,
        T::Error: Into<StdError>,
        T::ResponseBody: Body<Data = Bytes> + Send + 'static,
        <T::ResponseBody as Body>::Error: Into<StdError> + Send,
    {
        pub fn new(inner: T) -> Self {
            let inner = tonic::client::Grpc::new(inner);
            Self { inner }
        }
        pub fn with_origin(inner: T, origin: Uri) -> Self {
            let inner = tonic::client::Grpc::with_origin(inner, origin);
            Self { inner }
        }
        pub fn with_interceptor<F>(
            inner: T,
            interceptor: F,
        ) -> CompilerServiceClient<InterceptedService<T, F>>
        where
            F: tonic::service::Interceptor,
            T::ResponseBody: Default,
            T: tonic::codegen::Service<
                http::Request<tonic::body::BoxBody>,
                Response = http::Response<
                    <T as tonic::client::GrpcService<tonic::body::BoxBody>>::ResponseBody,
                >,
            >,
            <T as tonic::codegen::Service<
                http::Request<tonic::body::BoxBody>,
            >>::Error: Into<StdError> + Send + Sync,
        {
            CompilerServiceClient::new(InterceptedService::new(inner, interceptor))
        }
        /// Compress requests with the given encoding.
        ///
        /// This requires the server to support it otherwise it might respond with an
        /// error.
        #[must_use]
        pub fn send_compressed(mut self, encoding: CompressionEncoding) -> Self {
            self.inner = self.inner.send_compressed(encoding);
            self
        }
        /// Enable decompressing responses.
        #[must_use]
        pub fn accept_compressed(mut self, encoding: CompressionEncoding) -> Self {
            self.inner = self.inner.accept_compressed(encoding);
            self
        }
        /// Get an example code snippet
        pub async fn example_code(
            &mut self,
            request: impl tonic::IntoRequest<super::VoidParams>,
        ) -> Result<tonic::Response<super::Example>, tonic::Status> {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/compilers.CompilerService/ExampleCode",
            );
            self.inner.unary(request.into_request(), path, codec).await
        }
        /// Compile a given source code to wasm
        pub async fn compile_code(
            &mut self,
            request: impl tonic::IntoRequest<super::Input>,
        ) -> Result<tonic::Response<super::CompileResponse>, tonic::Status> {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/compilers.CompilerService/CompileCode",
            );
            self.inner.unary(request.into_request(), path, codec).await
        }
        /// Get information about the compiler toolchain
        pub async fn toolchain_info(
            &mut self,
            request: impl tonic::IntoRequest<super::VoidParams>,
        ) -> Result<tonic::Response<super::ToolchainInfoResponse>, tonic::Status> {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/compilers.CompilerService/ToolchainInfo",
            );
            self.inner.unary(request.into_request(), path, codec).await
        }
    }
}
/// Generated server implementations.
pub mod compiler_service_server {
    #![allow(unused_variables, dead_code, missing_docs, clippy::let_unit_value)]
    use tonic::codegen::*;
    ///Generated trait containing gRPC methods that should be implemented for use with CompilerServiceServer.
    #[async_trait]
    pub trait CompilerService: Send + Sync + 'static {
        /// Get an example code snippet
        async fn example_code(
            &self,
            request: tonic::Request<super::VoidParams>,
        ) -> Result<tonic::Response<super::Example>, tonic::Status>;
        /// Compile a given source code to wasm
        async fn compile_code(
            &self,
            request: tonic::Request<super::Input>,
        ) -> Result<tonic::Response<super::CompileResponse>, tonic::Status>;
        /// Get information about the compiler toolchain
        async fn toolchain_info(
            &self,
            request: tonic::Request<super::VoidParams>,
        ) -> Result<tonic::Response<super::ToolchainInfoResponse>, tonic::Status>;
    }
    /// The farem related services
    #[derive(Debug)]
    pub struct CompilerServiceServer<T: CompilerService> {
        inner: _Inner<T>,
        accept_compression_encodings: EnabledCompressionEncodings,
        send_compression_encodings: EnabledCompressionEncodings,
    }
    struct _Inner<T>(Arc<T>);
    impl<T: CompilerService> CompilerServiceServer<T> {
        pub fn new(inner: T) -> Self {
            Self::from_arc(Arc::new(inner))
        }
        pub fn from_arc(inner: Arc<T>) -> Self {
            let inner = _Inner(inner);
            Self {
                inner,
                accept_compression_encodings: Default::default(),
                send_compression_encodings: Default::default(),
            }
        }
        pub fn with_interceptor<F>(
            inner: T,
            interceptor: F,
        ) -> InterceptedService<Self, F>
        where
            F: tonic::service::Interceptor,
        {
            InterceptedService::new(Self::new(inner), interceptor)
        }
        /// Enable decompressing requests with the given encoding.
        #[must_use]
        pub fn accept_compressed(mut self, encoding: CompressionEncoding) -> Self {
            self.accept_compression_encodings.enable(encoding);
            self
        }
        /// Compress responses with the given encoding, if the client supports it.
        #[must_use]
        pub fn send_compressed(mut self, encoding: CompressionEncoding) -> Self {
            self.send_compression_encodings.enable(encoding);
            self
        }
    }
    impl<T, B> tonic::codegen::Service<http::Request<B>> for CompilerServiceServer<T>
    where
        T: CompilerService,
        B: Body + Send + 'static,
        B::Error: Into<StdError> + Send + 'static,
    {
        type Response = http::Response<tonic::body::BoxBody>;
        type Error = std::convert::Infallible;
        type Future = BoxFuture<Self::Response, Self::Error>;
        fn poll_ready(
            &mut self,
            _cx: &mut Context<'_>,
        ) -> Poll<Result<(), Self::Error>> {
            Poll::Ready(Ok(()))
        }
        fn call(&mut self, req: http::Request<B>) -> Self::Future {
            let inner = self.inner.clone();
            match req.uri().path() {
                "/compilers.CompilerService/ExampleCode" => {
                    #[allow(non_camel_case_types)]
                    struct ExampleCodeSvc<T: CompilerService>(pub Arc<T>);
                    impl<
                        T: CompilerService,
                    > tonic::server::UnaryService<super::VoidParams>
                    for ExampleCodeSvc<T> {
                        type Response = super::Example;
                        type Future = BoxFuture<
                            tonic::Response<Self::Response>,
                            tonic::Status,
                        >;
                        fn call(
                            &mut self,
                            request: tonic::Request<super::VoidParams>,
                        ) -> Self::Future {
                            let inner = self.0.clone();
                            let fut = async move {
                                (*inner).example_code(request).await
                            };
                            Box::pin(fut)
                        }
                    }
                    let accept_compression_encodings = self.accept_compression_encodings;
                    let send_compression_encodings = self.send_compression_encodings;
                    let inner = self.inner.clone();
                    let fut = async move {
                        let inner = inner.0;
                        let method = ExampleCodeSvc(inner);
                        let codec = tonic::codec::ProstCodec::default();
                        let mut grpc = tonic::server::Grpc::new(codec)
                            .apply_compression_config(
                                accept_compression_encodings,
                                send_compression_encodings,
                            );
                        let res = grpc.unary(method, req).await;
                        Ok(res)
                    };
                    Box::pin(fut)
                }
                "/compilers.CompilerService/CompileCode" => {
                    #[allow(non_camel_case_types)]
                    struct CompileCodeSvc<T: CompilerService>(pub Arc<T>);
                    impl<T: CompilerService> tonic::server::UnaryService<super::Input>
                    for CompileCodeSvc<T> {
                        type Response = super::CompileResponse;
                        type Future = BoxFuture<
                            tonic::Response<Self::Response>,
                            tonic::Status,
                        >;
                        fn call(
                            &mut self,
                            request: tonic::Request<super::Input>,
                        ) -> Self::Future {
                            let inner = self.0.clone();
                            let fut = async move {
                                (*inner).compile_code(request).await
                            };
                            Box::pin(fut)
                        }
                    }
                    let accept_compression_encodings = self.accept_compression_encodings;
                    let send_compression_encodings = self.send_compression_encodings;
                    let inner = self.inner.clone();
                    let fut = async move {
                        let inner = inner.0;
                        let method = CompileCodeSvc(inner);
                        let codec = tonic::codec::ProstCodec::default();
                        let mut grpc = tonic::server::Grpc::new(codec)
                            .apply_compression_config(
                                accept_compression_encodings,
                                send_compression_encodings,
                            );
                        let res = grpc.unary(method, req).await;
                        Ok(res)
                    };
                    Box::pin(fut)
                }
                "/compilers.CompilerService/ToolchainInfo" => {
                    #[allow(non_camel_case_types)]
                    struct ToolchainInfoSvc<T: CompilerService>(pub Arc<T>);
                    impl<
                        T: CompilerService,
                    > tonic::server::UnaryService<super::VoidParams>
                    for ToolchainInfoSvc<T> {
                        type Response = super::ToolchainInfoResponse;
                        type Future = BoxFuture<
                            tonic::Response<Self::Response>,
                            tonic::Status,
                        >;
                        fn call(
                            &mut self,
                            request: tonic::Request<super::VoidParams>,
                        ) -> Self::Future {
                            let inner = self.0.clone();
                            let fut = async move {
                                (*inner).toolchain_info(request).await
                            };
                            Box::pin(fut)
                        }
                    }
                    let accept_compression_encodings = self.accept_compression_encodings;
                    let send_compression_encodings = self.send_compression_encodings;
                    let inner = self.inner.clone();
                    let fut = async move {
                        let inner = inner.0;
                        let method = ToolchainInfoSvc(inner);
                        let codec = tonic::codec::ProstCodec::default();
                        let mut grpc = tonic::server::Grpc::new(codec)
                            .apply_compression_config(
                                accept_compression_encodings,
                                send_compression_encodings,
                            );
                        let res = grpc.unary(method, req).await;
                        Ok(res)
                    };
                    Box::pin(fut)
                }
                _ => {
                    Box::pin(async move {
                        Ok(
                            http::Response::builder()
                                .status(200)
                                .header("grpc-status", "12")
                                .header("content-type", "application/grpc")
                                .body(empty_body())
                                .unwrap(),
                        )
                    })
                }
            }
        }
    }
    impl<T: CompilerService> Clone for CompilerServiceServer<T> {
        fn clone(&self) -> Self {
            let inner = self.inner.clone();
            Self {
                inner,
                accept_compression_encodings: self.accept_compression_encodings,
                send_compression_encodings: self.send_compression_encodings,
            }
        }
    }
    impl<T: CompilerService> Clone for _Inner<T> {
        fn clone(&self) -> Self {
            Self(self.0.clone())
        }
    }
    impl<T: std::fmt::Debug> std::fmt::Debug for _Inner<T> {
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
            write!(f, "{:?}", self.0)
        }
    }
    impl<T: CompilerService> tonic::server::NamedService for CompilerServiceServer<T> {
        const NAME: &'static str = "compilers.CompilerService";
    }
}
