import mysql from 'mysql2/promise';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';

const app = fastify();
app.register(cors);

app.get("/", (request: FastifyRequest, reply: FastifyReply) => {
  reply.send("Fastify Funcionando!");
});


app.get("/produtos", async (_request: FastifyRequest, reply: FastifyReply) => {
  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "Loja",
      port: 3306,
    });

    const [dados] = await conn.query("SELECT * FROM produtos");
    reply.status(200).send(dados);
  } catch (erro) {
    console.error(erro);
    reply.status(500).send({ mensagem: "Erro ao buscar produtos" });
  }
});


app.post("/produtos", async (request: FastifyRequest, reply: FastifyReply) => {
  const { nome, preco, categoria } = request.body as {
    nome: string;
    preco: number;
    categoria: string;
  };

  if (!nome || !preco || !categoria) {
    return reply.status(400).send({ mensagem: "Preencha todos os campos" });
  }

  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "Loja",
      port: 3306,
    });

    const [resultado] = await conn.query(
      "INSERT INTO produtos (nome, preco, categoria) VALUES (?, ?, ?)",
      [nome, preco, categoria]
    );

    const insertId = (resultado as any).insertId;

    reply.status(200).send({ id: insertId, nome, preco, categoria });
  } catch (erro) {
    console.error(erro);
    reply.status(500).send({ mensagem: "Erro ao cadastrar produto" });
  }
});


app.put("/produtos/:id", async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const { nome, preco, categoria } = request.body as {
    nome: string;
    preco: number;
    categoria: string;
  };

  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "Loja",
      port: 3306,
    });

    await conn.query(
      "UPDATE produtos SET nome = ?, preco = ?, categoria = ? WHERE id = ?",
      [nome, preco, categoria, id]
    );

    reply.status(200).send({ id, nome, preco, categoria });
  } catch (erro) {
    console.error(erro);
    reply.status(500).send({ mensagem: "Erro ao atualizar produto" });
  }
});


app.delete("/produtos/:id", async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "Loja",
      port: 3306,
    });

    await conn.query("DELETE FROM produtos WHERE id = ?", [id]);
    reply.status(200).send({ mensagem: "Produto excluído com sucesso" });
  } catch (erro) {
    console.error(erro);
    reply.status(500).send({ mensagem: "Erro ao excluir produto" });
  }
});


app.listen({ port: 8000 }, (erro, endereco) => {
  if (erro) {
    console.log(" ERRO: Fastify não iniciou");
    process.exit(1);
  }
  console.log(` Fastify iniciado em: ${endereco}`);
});
