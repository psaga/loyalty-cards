import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  setupFiles: ['./dotenv-config.js']
}
export default config
