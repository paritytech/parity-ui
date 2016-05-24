// Copyright 2015, 2016 Ethcore (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

extern crate aster;
extern crate glob;
extern crate mime_guess;

use self::mime_guess::guess_mime_type;
use std::path::{Path, PathBuf};

use syntax::ast::{MetaItem, Item};

use syntax::ast;
use syntax::codemap::Span;
use syntax::ext::base::{Annotatable, ExtCtxt};

pub fn expand_webapp_implementation(
	cx: &mut ExtCtxt,
	span: Span,
	meta_item: &MetaItem,
	annotatable: &Annotatable,
	push: &mut FnMut(Annotatable)
) {
	let item = match *annotatable {
		Annotatable::Item(ref item) => item,
		_ => {
			cx.span_err(meta_item.span, "`#[derive(WebAppFiles)]` may only be applied to struct implementations");
			return;
		},
	};

	let builder = aster::AstBuilder::new().span(span);

  implement_webapp(cx, &builder, &item, push);
}

fn implement_webapp(
	cx: &ExtCtxt,
	builder: &aster::AstBuilder,
	_item: &Item,
	push: &mut FnMut(Annotatable),
) {
  
  let src = Path::new("src");
  let static_files = {
    let mut buf = src.to_path_buf();
    // TODO [ToDr] This might be taken from the attribute
    buf.push("web");
    buf
  };
  let search_location = {
    let mut buf = static_files.to_path_buf();
    buf.push("**");
    buf.push("*");
    buf
  };

  let files = glob::glob(search_location.to_str().expect("Valid UTF8 path"))
      .expect("The sources directory is missing.")
      .collect::<Result<Vec<PathBuf>, glob::GlobError>>()
      .expect("There should be no error when reading a list of files.");

  let statements = files
      .iter()
      .filter(|path_buf| path_buf.is_file())
      .map(|path_buf| {
        let path = path_buf.as_path();
        let filename = path.file_name().and_then(|s| s.to_str()).expect("Only UTF8 paths.");
        let mime_type = guess_mime_type(filename).to_string();
        let file_path = path.strip_prefix(&static_files).ok().and_then(|s| s.to_str()).expect("Only UTF8 paths.");
        let file_path_in_source = path.strip_prefix(&src).ok().and_then(|s| s.to_str()).expect("Only UTF8 paths.");

        let path_lit = builder.expr().str(file_path);
        let mime_lit = builder.expr().str(mime_type.as_str());
        let web_path_lit = builder.expr().str(file_path_in_source);
        let macro_id = builder.id("include_bytes!");

        quote_stmt!(cx, 
          files.insert($path_lit, File { path: $path_lit, content_type: $mime_lit, content: $macro_id($web_path_lit) });
        ).expect("The statement is always ok, because it just uses literals.")
      }).collect::<Vec<ast::Stmt>>();
  
	let default_impl = quote_item!(cx,
		impl Default for App {
			fn default() -> Self {
			  let files = {
          let mut files = ::std::collections::HashMap::new();
          $statements
          files
        };
        App {
          files: files
        }
      }
    }
	).unwrap();
  
  push(Annotatable::Item(default_impl));
}
