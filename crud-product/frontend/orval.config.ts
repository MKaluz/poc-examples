import { defineConfig } from 'orval'

export default defineConfig({
  products: {
    input: {
      target: './openapi/swagger.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      client: 'react-query',
      clean: true,
      override: {
        mutator: {
          path: './src/api/axios-instance.ts',
          name: 'axiosInstance',
        },
      },
    },
  },
})
