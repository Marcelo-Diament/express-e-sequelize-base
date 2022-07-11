const Sequelize = require('sequelize'),
  config = require('../config/database'),
  db = new Sequelize(config)

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
    const {
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
    const telefoneFormatado = telefone.replace(/\D/g, '')
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
    if (user) {
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

    res.render('userUpdate', {
      titulo: 'Cadastro',
      subtitulo: req.cookies.usuario ? `Verifique os dados e atualize os que precisar` : 'Preencha os dados e complete seu cadastro!',
      usuarioLogado: req.cookies.usuario,
      usuarioAdmin: req.cookies.admin,
      usuarioEditando: user[0]
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
    // if (req.cookies.usuario.id === id) {
    //   res.clearCookie('usuario').cookie('usuario', usuario)
    // }
    console.log(user)
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
    if (!user) {
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
