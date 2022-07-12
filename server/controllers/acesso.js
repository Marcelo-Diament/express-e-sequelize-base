const Sequelize = require('sequelize'),
  config = require('../config/database'),
  db = new Sequelize(config)

const { User } = require('../models')

const controller = {
  register: (req, res) => {
    res.render('register', {
      titulo: 'Cadastro',
      subtitulo: req.cookies.usuario ? 'Verifique o formulário e atualize os dados desejados.' : 'Preencha os dados e complete seu cadastro!',
      usuarioLogado: req.cookies.usuario,
      usuarioAdmin: req.cookies.admin
    });
  },
  add: async (req, res) => {
    let {
      nome,
      sobrenome,
      apelido,
      nascimento,
      senha,
      corPreferida,
      avatar,
      email,
      telefone,
      bio
    } = req.body
    telefone = telefone.replace(/\D/g, '')
    const criadoEm = new Date()
    const modificadoEm = new Date()
    const plano_id = 1
    const papel_id = email.indexOf('@pachecoimoveis.com.br') > 0 ? 1 : 2
    const user = await db.query(`
      INSERT INTO users (nome, sobrenome, apelido, nascimento, senha, corPreferida, avatar, email, telefone, bio, plano_id, papel_id)
      VALUES (:nome, :sobrenome, :apelido, :nascimento, :senha, :corPreferida, :avatar, :email, :telefoneFormatado, :bio, :plano_id, :papel_id)
    `, {
      replacements: {
        nome,
        sobrenome,
        apelido,
        nascimento,
        senha,
        corPreferida,
        avatar,
        email,
        telefoneFormatado,
        bio,
        plano_id,
        papel_id
      },
      type: Sequelize.QueryTypes.INSERT
    })

    // USANDO MODEL QUERYING - Método create - recebe os dados do req.body (e outros) e cria o registro desejado.
    const usuario = await User.create({
      nome,
      sobrenome,
      apelido,
      nascimento,
      senha,
      corPreferida,
      avatar,
      email,
      telefone,
      bio,
      plano_id,
      papel_id,
      criadoEm,
      modificadoEm
    })

    if (usuario) {
      res.redirect('/usuarios')
    } else {
      res.json({ status: 500, msg: 'Deu ruim' })
    }
  },
  login: (req, res, next) => {
    res.render('login', {
      titulo: 'Login',
      subtitulo: 'Preencha os dados e acesse seu perfil!',
      usuarioLogado: req.cookies.usuario,
      usuarioAdmin: req.cookies.admin
    });
  },
  auth: (req, res, next) => {
    res.redirect('../')
  },
  lostPass: (req, res, next) => {
    res.render('lostPassword', {
      titulo: 'Recuperação de Senha',
      subtitulo: 'Preencha os dados e recupere sua senha!',
      usuarioLogado: req.cookies.usuario,
      usuarioAdmin: req.cookies.admin
    });
  },
  update: async (req, res, next) => {
    const idBuscado = req.params.id.replace('/', '')
    const user = await db.query(`SELECT * FROM users WHERE users.id = ${idBuscado}`, {
      type: Sequelize.QueryTypes.SELECT
    })

    const usuarioEditando = await User.findOne({
      where: {
        id: idBuscado
      }
    })

    res.render('userUpdate', {
      titulo: 'Cadastro',
      subtitulo: req.cookies.usuario ? `Verifique os dados e atualize os que precisar` : 'Preencha os dados e complete seu cadastro!',
      usuarioLogado: req.cookies.usuario,
      usuarioAdmin: req.cookies.admin,
      usuarioEditando
    })
  },
  edit: async (req, res, next) => {
    let {
      id,
      nome,
      sobrenome,
      apelido,
      nascimento,
      senha,
      corPreferida,
      avatar,
      email,
      telefone,
      bio
    } = req.body
    telefone = telefone.replace(/\D/g, '')
    id = id.replace(/\D/g, '')
    const modificadoEm = new Date()
    const user = await db.query(`
      UPDATE users
      SET
        nome = :nome,
        sobrenome = :sobrenome,
        apelido = :apelido,
        nascimento = :nascimento,
        ${senha && 'senha = :senha,'}
        corPreferida = :corPreferida,
        ${avatar && 'avatar = :avatar,'}
        email = :email,
        telefone = :telefone,
        bio = :bio,
        modificadoEm = :modificadoEm
      WHERE users.id = :id
    `, {
      replacements: {
        id,
        nome,
        sobrenome,
        apelido,
        nascimento,
        senha,
        corPreferida,
        avatar,
        email,
        telefone,
        bio,
        modificadoEm
      },
      type: Sequelize.QueryTypes.UPDATE
    })
    // USANDO MODEL QUERYING - Método update - recebe os dados do req.body (e outros), encontra o registro a ser alterado (através da condição do WHERE) e atualiza o registro desejado.
    const usuario = await User.update(
      {
        nome,
        sobrenome,
        apelido,
        nascimento,
        senha,
        corPreferida,
        email,
        telefone,
        bio,
        modificadoEm
      },
      {
        where: {
          id
        }
      }
    )
    // if (req.cookies.usuario.id === id) {
    //   res.clearCookie('usuario').cookie('usuario', usuario)
    // }
    console.log(usuario)
    res.redirect('../../usuarios')
  },
  delete: async (req, res, next) => {
    const idBuscado = req.params.id.replace('/', '')

    const user = await db.query(`DELETE FROM users WHERE users.id = :id`, {
      replacements: {
        id: idBuscado
      },
      type: Sequelize.QueryTypes.DELETE
    })

    // USANDO MODEL QUERYING - Método destroy - recebe a condição para a busca(where) e exclui/deleta o registro desejado.
    const usuario = await User.destroy({
      where: {
        id: idBuscado
      }
    })

    if (!usuario) {
      res.redirect('/usuarios')
    } else {
      res.json({ status: 500, msg: 'Deu ruim' })
    }
  },
  logout: (req, res, next) => {
    res.clearCookie('usuario').clearCookie('admin').redirect('../../')
  }
}

module.exports = controller
