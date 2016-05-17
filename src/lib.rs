use std::default::Default;

#[derive(Clone)]
pub struct File {
	pub path: &'static str,
	pub content: &'static [u8],
	pub content_type: &'static str,
}

#[derive(Clone, Debug)]
pub struct Info {
  pub name: String,
  pub version: String,
  pub author: String,
  pub description: String,
  pub icon_url: String,
}

pub trait WebApp : Default + Send + Sync {
  fn file(&self, path: &str) -> Option<&File>;
  fn info(&self) -> Info;
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
    }
}
