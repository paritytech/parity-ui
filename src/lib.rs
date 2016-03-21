use std::default::Default;

#[derive(Clone)]
pub struct File {
	pub path: &'static str,
	pub content: &'static [u8],
	pub content_type: &'static str,
}

pub trait WebApp : Default + Send + Sync {
  fn files(&self) -> Vec<&File>;
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
    }
}
