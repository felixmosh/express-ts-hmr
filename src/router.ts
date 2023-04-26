import { Router } from 'express';

export function getRoutes() {
  return Router().get("/", (req, res) => {
    res.send("Express + TypeScript Server");
  });
}
