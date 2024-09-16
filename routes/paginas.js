const express = require('express');
const fs = require('fs');
const router = express.Router();
const {isAuthenticated} = require('../middleware/authMiddleware');
const path = require('path');
const multer = require('multer');

const DATA_PATH = './data/user.json';
const DATA_PATH_FILMES = './data/filmes.json';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        // Renomeando o arquivo de imagem ( imagem.jpg => 1749373949.jpg)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const lerDados = () => {
    try {
        return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    } catch (error) {
        console.error("Erro ao ler os dados:", error);
        return [];
    }
}

const lerDadosFilmes = () => {
    try {
        return JSON.parse(fs.readFileSync(DATA_PATH_FILMES, 'utf-8'));
    } catch (error) {
        console.error("Erro ao ler os dados:", error);
        return [];
    }
}

const escreverDados = (data) => {
    try {
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Erro ao escrever os dados:", error);
    }
}

const escreverDadosFilmes = (data) => {
    try {
        fs.writeFileSync(DATA_PATH_FILMES, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Erro ao escrever os dados:", error);
    }
}

/* Rota para acessar as páginas */
router.get('/', (req, res) => {
    const data = lerDadosFilmes();
    res.json(data);
});

router.post('/', (req, res) => {
    const data = lerDados();
    const novoDado = {
        id: Date.now(),
            username: req.body.username,
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            email: req.body.email,
            senha: req.body.senha
        };
    
    data.push(novoDado);
    escreverDados(data);
    res.json(novoDado);
});

router.post('/cadastro_filme', upload.single('img_filme'),(req, res) => {
    const data = lerDadosFilmes();

    const novoFilme = {
        id: Date.now(),
        nome: req.body.titulo,
        diretor: req.body.diretor,
        duracao: req.body.duracao,
        genero: req.body.genero,
        ano_lancamento: Number(req.body.ano_lancamento),
        enredo: req.body.enredo,
        img_filme: req.file ? `/uploads/${req.file.filename}` : null

    };

    data.push(novoFilme);
    escreverDadosFilmes(data);
    res.json(novoFilme);

});

router.put('/:id', upload.single('img_prod'), (req, res) => {
    const data = lerDados();
    const id_edit = Number(req.params.id);
    const index = data.findIndex(produto => produto.id === id_edit);

    if (index !== -1) {
        const produto_edit = data[index];

        produto_edit.nome = req.body.nome || produto_edit.nome;
        produto_edit.fabricante = req.body.fabricante || produto_edit.fabricante;
        produto_edit.valor = Number(req.body.valor) || produto_edit.valor;
        produto_edit.quantidade = Number(req.body.quantidade) || produto_edit.quantidade;
        
        // Substituir a imagem se uma nova for enviada
        if (req.file) {
            // Excluir a imagem antiga, se houver
            if (produto_edit.img_produto) {
                const img_antiga = path.join(__dirname, '..', produto_edit.img_produto);
                fs.unlink(img_antiga, (erro) => {
                    if (erro) {
                        console.error("Erro ao tentar excluir a imagem antiga!", erro);
                    } else {
                        console.log("Imagem antiga excluída com sucesso!", img_antiga);
                    }
                });
            } 
            // Atualizar o caminho da nova imagem
            produto_edit.img_produto = `/uploads/${req.file.filename}`;
        } 
        // Atualiza o produto no Json
        data[index] = produto_edit;
        escreverDados(data);
        res.json(produto_edit);
    } else {
        res.status(404).send({message: 'Erro ao tentar atualizar o produto!'});
    }

});

router.delete('/:id', (req, res) => {
    const data = lerDados();
    const id_del = Number(req.params.id);
    const filtro = data.filter(produto => produto.id !== id_del);
    const idx = data.findIndex(produto => produto.id === id_del);
    
    if (data.length !== filtro.length) {

        const img_del = data[idx];

        // Se tiver uma imagem associada ela será excluída
        if (img_del.img_produto) {
            const imagePath = path.join(__dirname, '..', img_del.img_produto);
            fs.unlink(imagePath, (erro) => {
                if (erro) {
                    console.error("Erro ao tentar excluir a imagem antiga!", erro);
                } else {
                    console.log("Imagem antiga excluída com sucesso!", imagePath);
                }
            });
        } 

        escreverDados(filtro);
        res.json({message: 'Produto Excluído com Sucesso!'});
    } else {
        res.status(404).send({message: 'Erro ao tentar excluir o produto!'});
    }
});

module.exports = router;