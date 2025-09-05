export async function saveOnInventario(nome, precocompra, precovenda, empresa, qtd) {
    try {
        const post = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome:nome,
                precocompra:precocompra,
                precovenda:precovenda,
                empresa:empresa,
                qtd:qtd,
        })
        }
        const response = await fetch('http://localhost:8000/api/cadastrarProduto', post);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const result = await response.json();

        return result;
    } catch (error) {
        console.error("Erro ao salvar no inventário:", error);
    }
};

export async function getInventario() {
    try {
        const list = await fetch('http://localhost:8000/api/produtosCadastrados');
        return list;
    } catch (error) {
        console.error('Não foi possível recuperar dados do BD.', error);
    }
};

export async function editItem(id, nome, precocompra, precovenda, empresa, qtd) {
    try {
        const put = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome:nome,
                precocompra:precocompra,
                precovenda:precovenda,
                empresa:empresa,
                qtd:qtd,
        })
        }
        const response = await fetch(`http://localhost:8000/api/editarProdutoInventario/${id}`, put);
        
        const result = await response.json();

        return result;
    } catch (error) {
        console.error("Erro ao editar no inventário:", error);
    }
}

export async function deleteItem(id) {
    try {
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        };

        await fetch(`http://localhost:8000/api/deleteProdutosInventario/${id}`, options);

        console.log(`Produto ${id} excluído com sucesso!`);

    } catch (error) {
        console.error("Erro ao excluir produto:", error);
    }
}