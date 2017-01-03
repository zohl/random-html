import seedrandom from 'seedrandom';


const randomTagName = (options, state) => {
  return 'div'; // TODO
};


const randomProps = (options, state) => {
  return {}; // TODO
};


const generate = (options, state) => {
  var result = {};

  result.name = randomTagName(options, state);
  result.props = randomProps(options, state);

  var cntChildren = (undefined !== options.maxHeight && state.height == options.maxHeight)
      ? 0
      : (state.rng() * (options.maxWidth + 1))|0;

  result.children = (!cntChildren)
    ? ["text"]
    : [...Array(cntChildren).keys()].map(_ => generate(options, Object.assign({}, state, {
      height: 1 + state.height
    , parent: result.name
    })));
    
  return result;
};


const render = (ident, p) => s => ((prefix, newline) => (typeof s == 'string')
  ? prefix + s + newline
  : (prefix + '<' + s.name
     + (Object.keys(s.props).map(key => ' ' + key + '="' + s.props[key] + '"')).join('')
     + '>' + newline
     + s.children.map(render(ident, prefix + '  ')).join('')
     + prefix + '</' + s.name + '>' + newline))(
  (ident ? (undefined === p ? '' : p) : '')
, (ident ? '\n' : ''));



/** Generate random html snippet.

   @arg {Object} [userOptions] - User-provided parameters.

   @arg {number} [userOptions.maxHeight] - Maximum number of nested
   tags.

   @arg {number} [userOptions.maxWidth = 3] - Maximum number of
   children for each node.

   @arg {Object} [userOptions.rng = seedrandom(Math.random())] -
   Pseudo random number generator. If not specified, one with random
   seed will be used.

   @return {string} HTML snippet.
*/
const randomHTML = (userOptions) => {
  var defaultOptions = {
    maxWidth: 3
  };
  var options = Object.assign({}, defaultOptions, userOptions || {});

  var state = {
    height: 0
  , rng: seedrandom(options.seed || Math.random())
  };

  return render(true)(generate(options, state));
};


export default randomHTML
