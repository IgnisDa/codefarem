use async_graphql::{Enum, InputObject, SimpleObject};
use main_db::ToEdgeqlString;
use serde::{Deserialize, Serialize};
use strum::EnumIter;

#[derive(Enum, Copy, Clone, Eq, PartialEq, Debug, EnumIter, Deserialize, Serialize)]
pub enum TestCaseUnit {
    #[serde(rename = "NumberUnit")]
    Number,
    #[serde(rename = "StringUnit")]
    String,
    #[serde(rename = "NumberCollectionUnit")]
    NumberCollection,
    #[serde(rename = "StringCollectionUnit")]
    StringCollection,
}

impl ToEdgeqlString for TestCaseUnit {
    fn get_module_name() -> String {
        "learning".to_string()
    }
}

#[derive(Debug, SimpleObject, InputObject)]
pub struct InputCaseUnit {
    pub data_type: TestCaseUnit,
    pub data: String,
    /// The name of the variable to store it as
    pub name: String,
}

#[derive(Debug, SimpleObject, InputObject)]
pub struct OutputCaseUnit {
    /// The type of data to store this line as
    pub data_type: TestCaseUnit,
    /// The data to store
    pub data: String,
}

#[derive(Debug, SimpleObject, InputObject)]
pub struct TestCase {
    /// The inputs related to this test case
    pub inputs: Vec<InputCaseUnit>,
    /// The outputs related to this test case
    pub outputs: Vec<OutputCaseUnit>,
}
