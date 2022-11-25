use serde::Serialize;

pub trait ToEdgeqlString
where
    Self: Serialize,
{
    fn get_module_name() -> String;

    fn to_edgeql_string(&self) -> String {
        Self::get_module_name() + "::" + serde_json::to_string(&self).unwrap().trim_matches('"')
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde::Serialize;

    #[derive(Serialize)]
    enum SomeStuff {
        A,
    }
    impl ToEdgeqlString for SomeStuff {
        fn get_module_name() -> String {
            "test".to_owned()
        }
    }

    #[test]
    fn basic() {
        assert_eq!(SomeStuff::A.to_edgeql_string(), "test::A");
    }
}
