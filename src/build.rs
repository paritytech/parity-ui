
#[cfg(feature = "with-syntex")]
pub mod inner {
  use syntex;
  use codegen;
	use std::env;
	use std::path::Path;

  pub fn register(reg: &mut syntex::Registry) {
    reg.add_attr("feature(custom_derive)");
    reg.add_attr("feature(custom_attribute)");

    reg.add_decorator("derive_WebAppFiles", codegen::expand_webapp_implementation);
  }

	pub fn build() {
		let out_dir = env::var_os("OUT_DIR").unwrap();
		let mut registry = syntex::Registry::new();
		register(&mut registry);

		let src = Path::new("src/lib.rs.in");
		let dst = Path::new(&out_dir).join("lib.rs");

		registry.expand("", &src, &dst).unwrap();
	}
}

#[cfg(not(feature = "with-syntex"))]
pub mod inner {
  use codegen;

  pub fn register(reg: &mut rustc_plugin::Registry) {
    reg.register_syntax_extension(
      syntax::parse::token::intern("derive_WebAppFiles"),
      syntax::ext::base::MultiDecorator(
        Box::new(codegen::expand_webapp_implementation)));
  }

	pub fn build() {}
}
