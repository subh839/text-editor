const path = require('path')

module.exports = {
  stories: ['../stories/**/*.stories.(ts|tsx)'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links', '@storybook/addon-docs'],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
          },
        },
        {
          loader: require.resolve('react-docgen-typescript-loader'),
        },
      ],
    });

  
    config.module.rules.splice(6, 1)


    config.module.rules.unshift({
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    
    });

    config.resolve.extensions.push('.ts', '.tsx', '.css', 'js');

    return config;
  },
};

