"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
fastify_1.default.get("/produtos", async () => {
    const [rows] = await conexao.execute("SELECT * FROM produtos");
    return rows;
});
fastify_1.default.post("/produtos", async (request, reply) => {
    const { nome, preco, categoria } = request.body;
    if (!nome || !preco || !categoria) {
        return reply.status(400).send({ mensagem: "Campos obrigatórios não preenchidos." });
    }
    const [result] = await conexao.execute("INSERT INTO produtos (nome, preco, categoria) VALUES (?, ?, ?)", [nome, preco, categoria]);
    const id = result.insertId;
    return { id, nome, preco, categoria };
});
fastify_1.default.put("/produtos/:id", async (request, reply) => {
    const { id } = request.params;
    const { nome, preco, categoria } = request.body;
    await conexao.execute("UPDATE produtos SET nome = ?, preco = ?, categoria = ? WHERE id = ?", [nome, preco, categoria, id]);
    return { id, nome, preco, categoria };
});
fastify_1.default.delete("/produtos/:id", async (request, reply) => {
    const { id } = request.params;
    await conexao.execute("DELETE FROM produtos WHERE id = ?", [id]);
    return { mensagem: "Produto deletado com sucesso" };
});
