/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
      // Existing configurations (if any) go here
  
      // Add SVG handling
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"]
      });
  
      return config;
    }
  };
  
  export default nextConfig;
 