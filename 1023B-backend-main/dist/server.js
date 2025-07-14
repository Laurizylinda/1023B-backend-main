"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//sheron, aurizy e Menegassi
const promise_1 = __importDefault(require("mysql2/promise"));
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const app = (0, fastify_1.default)();
app.register(cors_1.default);
app.get("/", (request, reply) => {
    reply.send("Fastify Funcionando!");
});
app.get("/produtos", async (_request, reply) => {
    try {
        const conn = await promise_1.default.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "Loja",
            port: 3306,
        });
        const [dados] = await conn.query("SELECT * FROM produtos");
        reply.status(200).send(dados);
    }
    catch (erro) {
        console.error(erro);
        reply.status(500).send({ mensagem: "Erro ao buscar produtos" });
    }
});
app.post("/produtos", async (request, reply) => {
    const { nome, preco, categoria } = request.body;
    if (!nome || !preco || !categoria) {
        return reply.status(400).send({ mensagem: "Preencha todos os campos" });
    }
    try {
        const conn = await promise_1.default.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "Loja",
            port: 3306,
        });
        const [resultado] = await conn.query("INSERT INTO produtos (nome, preco, categoria) VALUES (?, ?, ?)", [nome, preco, categoria]);
        const insertId = resultado.insertId;
        reply.status(200).send({ id: insertId, nome, preco, categoria });
    }
    catch (erro) {
        console.error(erro);
        reply.status(500).send({ mensagem: "Erro ao cadastrar produto" });
    }
});
app.put("/produtos/:id", async (request, reply) => {
    const { id } = request.params;
    const { nome, preco, categoria } = request.body;
    try {
        const conn = await promise_1.default.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "Loja",
            port: 3306,
        });
        await conn.query("UPDATE produtos SET nome = ?, preco = ?, categoria = ? WHERE id = ?", [nome, preco, categoria, id]);
        reply.status(200).send({ id, nome, preco, categoria });
    }
    catch (erro) {
        console.error(erro);
        reply.status(500).send({ mensagem: "Erro ao atualizar produto" });
    }
});
app.delete("/produtos/:id", async (request, reply) => {
    const { id } = request.params;
    try {
        const conn = await promise_1.default.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "Loja",
            port: 3306,
        });
        await conn.query("DELETE FROM produtos WHERE id = ?", [id]);
        reply.status(200).send({ mensagem: "Produto excluído com sucesso" });
    }
    catch (erro) {
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
