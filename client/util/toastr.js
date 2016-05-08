
export function metaToastr (msg, type = 'default') {
  return {
    toastr: {
      msg,
      type
    }
  };
}
