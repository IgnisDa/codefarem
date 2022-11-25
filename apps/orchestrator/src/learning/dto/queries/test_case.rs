use async_graphql::{InputObject, SimpleObject};

#[derive(Debug, SimpleObject, InputObject)]
pub struct TestCaseDataInput {
    /// The data to store
    pub data: String,
}

#[derive(Debug, SimpleObject, InputObject)]
pub struct TestCaseInput {
    /// The inputs related to this test case
    pub inputs: Vec<TestCaseDataInput>,
    /// The outputs related to this test case
    pub outputs: Vec<TestCaseDataInput>,
}
