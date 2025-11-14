// const postcssJitProps = require('postcss-jit-props');
import postcssJitProps from 'postcss-jit-props';
import OpenProps from 'open-props';

export default {
  plugins: [
    postcssJitProps(OpenProps),
  ]
}
