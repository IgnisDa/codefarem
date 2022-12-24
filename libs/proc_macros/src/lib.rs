use proc_macro::TokenStream;
use quote::quote;
use std::{env, path::PathBuf};

#[proc_macro]
pub fn embed_image_as_base64(image_path: TokenStream) -> TokenStream {
    let root = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());
    let mut sanitized_image_path = image_path.to_string();
    sanitized_image_path = sanitized_image_path.replace('\"', "");
    let image_path = root.join("src").join(PathBuf::from(sanitized_image_path));
    if !image_path.exists() {
        panic!("Image path does not exist: {:?}", image_path);
    }
    let base64 = image_base64::to_base64(image_path.to_str().unwrap());
    quote! { #base64 }.into()
}
