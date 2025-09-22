#!/usr/bin/env node

import dotenv from 'dotenv';
import { spawn } from 'child_process';

// Load environment variables from .env file
dotenv.config();

// Run vite build
const vite = spawn('npx', ['vite', 'build'], {
	stdio: 'inherit',
	env: process.env
});

vite.on('close', (code) => {
	process.exit(code);
});
