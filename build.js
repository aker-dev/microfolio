#!/usr/bin/env node

import { config } from 'dotenv';
import { spawn } from 'child_process';

// Load environment variables from .env file
config();

// Pass all environment variables to the child process
const env = { ...process.env };

// Run vite build with the loaded environment variables
const child = spawn('vite', ['build'], {
	stdio: 'inherit',
	env,
	shell: true
});

child.on('exit', (code) => {
	process.exit(code);
});
