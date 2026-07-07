const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const allowedOrigins = [
  'https://algorian-task.vercel.app',
  'https://algorian-task-git-main-subiyan-coders-projects.vercel.app',
  'https://algorian-task-fbjpkpdnt-subiyan-coders-projects.vercel.app',
  'http://localhost:5173'
];

const applyGlobalMiddleware = (app) => {
  app.use(cors({
    origin: allowedOrigins,
    credentials: true  
  }));

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

module.exports = applyGlobalMiddleware;