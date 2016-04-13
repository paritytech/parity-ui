
import rlp from 'rlp';

const version = 0x010000;
const separator = '/';

export default class ExtraDataManipulator {

  encode (str) {
    return `0x${rlp.encode([version].concat(str.split(separator))).toString('hex')}`;
  }

  decode (str) {
    return rlp.decode(str).slice(1).join(separator);
  }

}
