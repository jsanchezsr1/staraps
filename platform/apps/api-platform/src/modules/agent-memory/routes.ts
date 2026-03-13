import { Express } from "express"

export function registerAgentMemoryRoutes(app: Express) {

  app.post("/api/agent-memory/store", async (req, res) => {
    res.json({ stored: true })
  })

  app.get("/api/agent-memory/nodes", async (req, res) => {
    res.json([])
  })

}
