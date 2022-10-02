#[macro_export]
macro_rules! to_result_union_response {
    ($result:expr, $union:ident) => {
        Ok(match $result {
            Ok(s) => $union::Result(s),
            Err(s) => $union::Error(s),
        })
    };
}
