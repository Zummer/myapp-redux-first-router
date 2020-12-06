module.exports = function () {
  return {
    module: {
      rules: [
        {
          test: /\.(tsx|ts|jsx|js)$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            // disable type checker - we will use it in fork plugin
            transpileOnly: true,
          },
        },
      ],
    },
  };
};
