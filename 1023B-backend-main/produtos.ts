import mysql from 'mysql2/promise';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors'

  fastify.get("/produtos", async () => {
    const [rows] = await conexao.execute("SELECT * FROM produtos");
    return rows;
  });

  fastify.post("/produtos", async (request, reply) => {
    const { nome, preco, categoria } = request.body as any;

    if (!nome || !preco || !categoria) {
      return reply.status(400).send({ mensagem: "Campos obrigatórios não preenchidos." });
    }

    const [result] = await conexao.execute(
      "INSERT INTO produtos (nome, preco, categoria) VALUES (?, ?, ?)",
      [nome, preco, categoria]
    );

    const id = (result as any).insertId;
    return { id, nome, preco, categoria };
  });

  fastify.put("/produtos/:id", async (request, reply) => {
    const { id } = request.params as any;
    const { nome, preco, categoria } = request.body as any;

    await conexao.execute(
      "UPDATE produtos SET nome = ?, preco = ?, categoria = ? WHERE id = ?",
      [nome, preco, categoria, id]
    );

    return { id, nome, preco, categoria };
  });

  fastify.delete("/produtos/:id", async (request, reply) => {
    const { id } = request.params as any;
    await conexao.execute("DELETE FROM produtos WHERE id = ?", [id]);
    return { mensagem: "Produto deletado com sucesso" };
  });
}
