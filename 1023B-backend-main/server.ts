import mysql from 'mysql2/promise';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';

const app = fastify();
app.register(cors);


app.get("/", (request: FastifyRequest, reply: FastifyReply) => {
  reply.send("Fastify Funcionando!");
});


app.get("/clientes", async (_request: FastifyRequest, reply: FastifyReply) => {
  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "loja",
      port: 3306,
    });

    const [dados] = await conn.query("SELECT * FROM clientes");
    reply.status(200).send(dados);
  } catch (erro) {
    console.error(erro);
    reply.status(500).send({ mensagem: "Erro ao buscar clientes" });
  }
});


app.post("/clientes", async (request: FastifyRequest, reply: FastifyReply) => {
  const { id, nome, endereco, telefone } = request.body as {
    id: number;
    nome: string;
    endereco: string;
    telefone: string;
  };

  if (!id || !nome || !endereco || !telefone) {
    return reply.status(400).send({ mensagem: "Preencha todos os campos" });
  }

  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "loja",
      port: 3306,
    });

    const [resultado] = await conn.query(
      "INSERT INTO clientes (id, nome, endereco, telefone) VALUES (?, ?, ?, ?)",
      [id, nome, endereco, telefone]
    );

    const insertId = (resultado as any).insertId;

    reply.status(200).send({ id: insertId, nome, endereco, telefone });
  } catch (erro) {
    console.error(erro);
    reply.status(500).send({ mensagem: "Erro ao cadastrar cliente" });
  }
});


app.put("/clientes/:id", async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const { nome, endereco, telefone } = request.body as {
    nome: string;
    endereco: string;
    telefone: string;
  };

  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "loja",
      port: 3306,
    });

    await conn.query(
      "UPDATE clientes SET nome = ?, endereco = ?, telefone = ? WHERE id = ?",
      [nome, endereco, telefone, id]
    );

    reply.status(200).send({ id, nome, endereco, telefone });
  } catch (erro) {
    console.error(erro);
    reply.status(500).send({ mensagem: "Erro ao atualizar cliente" });
  }
});


app.delete("/clientes/:id", async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "loja",
      port: 3306,
    });

    await conn.query("DELETE FROM clientes WHERE id = ?", [id]);
    reply.status(200).send({ mensagem: "Cliente excluído com sucesso" });
  } catch (erro) {
    console.error(erro);
    reply.status(500).send({ mensagem: "Erro ao excluir cliente" });
  }
});


app.listen({ port: 8000 }, (erro, endereco) => {
  if (erro) {
    console.log("ERRO: Fastify não iniciou");
    process.exit(1);
  }
  console.log(`Fastify iniciado em: ${endereco}`);
});