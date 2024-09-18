const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const DATA_PATH = './data/user.json';
const DATA_PATH_FILMES = './data/filmes.json';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        // Renomeando o arquivo de imagem (imagem.jpg => 1749373949.jpg)
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

router.post('/cadastro_filme', upload.single('img_filme'), (req, res) => {
    const data = lerDadosFilmes();

    const novoFilme = {
        id: Date.now(),
        nome: req.body.titulo,
        diretor: req.body.diretor,
        duracao: req.body.duracao,
        genero: req.body.genero,
        ano_lancamento: Number(req.body.ano_lancamento),
        enredo: req.body.enredo,
        img_filme: req.file ? `/uploads/${req.file.filename}` : null,
        curtidas: 0
    };

    data.push(novoFilme);
    escreverDadosFilmes(data);
    res.json(novoFilme);
});

router.put('/:id', upload.single('img_filme'), (req, res) => {
    const data = lerDadosFilmes();
    const id_edit = Number(req.params.id);
    const index = data.findIndex(filme => filme.id === id_edit);

    if (index !== -1) {
        const filme_edit = data[index];

        filme_edit.nome = req.body.nome || filme_edit.nome;
        filme_edit.diretor = req.body.diretor || filme_edit.diretor;
        filme_edit.duracao = req.body.duracao || filme_edit.duracao;
        filme_edit.genero = req.body.genero || filme_edit.genero;
        filme_edit.ano_lancamento = Number(req.body.ano_lancamento) || filme_edit.ano_lancamento;
        filme_edit.enredo = req.body.enredo || filme_edit.enredo;
        
        // Substituir a imagem se uma nova for enviada
        if (req.file) {
            // Excluir a imagem antiga, se houver
            if (filme_edit.img_filme) {
                const img_antiga = path.join(__dirname, '..', filme_edit.img_filme);
                fs.unlink(img_antiga, (erro) => {
                    if (erro) {
                        console.error("Erro ao tentar excluir a imagem antiga!", erro);
                    } else {
                        console.log("Imagem antiga excluída com sucesso!", img_antiga);
                    }
                });
            } 
            // Atualizar o caminho da nova imagem
            filme_edit.img_filme = `/uploads/${req.file.filename}`;
        } 
        // Atualiza o filme no Json
        data[index] = filme_edit;
        escreverDadosFilmes(data);
        res.json(filme_edit);
    } else {
        res.status(404).send({message: 'Erro ao tentar atualizar o filme!'});
    }
});

router.put('/curtir/:id', (req, res) => {
    const data = lerDadosFilmes();
    const id_curtir = Number(req.params.id);
    const index = data.findIndex(filme => filme.id === id_curtir);

    if (index !== -1) {
        const filme_curtir = data[index];
        filme_curtir.curtidas++;
        data[index] = filme_curtir;
        escreverDadosFilmes(data);
        res.json({ message: 'Filme curtido com sucesso!', filme: filme_curtir });
    } else {
        res.status(404).send({ message: 'Erro ao tentar curtir o filme!' });
    }
});

router.put('/descurtir/:id', (req, res) => {
    const data = lerDadosFilmes();
    const id_descurtir = Number(req.params.id);
    const index = data.findIndex(filme => filme.id === id_descurtir);

    if (index !== -1) {
        const filme_descurtir = data[index];
        filme_descurtir.curtidas--;
        data[index] = filme_descurtir;
        escreverDadosFilmes(data);
        res.json({ message: 'Filme descurtido com sucesso!', filme: filme_descurtir });
    } else {
        res.status(404).send({ message: 'Erro ao tentar curtir o filme!' });
    }
});

router.delete('/:id', (req, res) => {
    const data = lerDadosFilmes();
    const id_del = Number(req.params.id);
    const filtro = data.filter(filme => filme.id !== id_del);
    const idx = data.findIndex(filme => filme.id === id_del);
    
    if (data.length !== filtro.length) {
        const img_del = data[idx];

        // Se tiver uma imagem associada ela será excluída
        if (img_del.img_filme) {
            const imagePath = path.join(__dirname, '..', img_del.img_filme);
            fs.unlink(imagePath, (erro) => {
                if (erro) {
                    console.error("Erro ao tentar excluir a imagem antiga!", erro);
                } else {
                    console.log("Imagem antiga excluída com sucesso!", imagePath);
                }
            });
        } 

        escreverDadosFilmes(filtro);
        res.json({message: 'Filme Excluído com Sucesso!'});
    } else {
        res.status(404).send({message: 'Erro ao tentar excluir o filme!'});
    }
});

module.exports = router;
