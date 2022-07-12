const Sequelize = require('sequelize')
const config = require('../config/database')
const db = new Sequelize(config)
const { User } = require('../models')
const { Op } = Sequelize

const controller = {
  index: async (req, res, next) => {
    const users = await db.query('SELECT * FROM users', {
      type: Sequelize.QueryTypes.SELECT
    })

    // USANDO MODEL QUERYING - Método findAll - busca e retorna todos os registros.
    const usuarios = await User.findAll()

    if (!usuarios) {
      res.json({ status: 500, msg: 'molhou...' })
    }
    res.render('users', {
      titulo: 'Usuários',
      subtitulo: 'Listagem de Usuários',
      usuarios,
      usuarioLogado: req.cookies.usuario,
      usuarioAdmin: req.cookies.admin,
      bannerTopo: '/images/banner-topo-usuarios-1564x472.png',
      bannerMeio: '/images/banner-meio-usuarios-1920x1080.png'
    });
  },
  show: async (req, res, next) => {
    const { id } = req.params

    const user = await db.query('SELECT * FROM users WHERE users.id = ' + id, {
      type: Sequelize.QueryTypes.SELECT
    })

    const user2 = await db.query(`SELECT * FROM users WHERE users.id = ${id}`, {
      type: Sequelize.QueryTypes.SELECT
    })

    const user3 = await db.query(`SELECT * FROM users WHERE users.id = ?`, {
      replacements: [
        id
      ],
      type: Sequelize.QueryTypes.SELECT
    })

    const user4 = await db.query(`SELECT * FROM users WHERE users.id = :id`, {
      replacements: {
        id
      },
      type: Sequelize.QueryTypes.SELECT
    })

    // USANDO MODEL QUERYING - Método findOne - recebe a condição para a busca (where) e retorna o objeto desejado.
    const usuario = await User.findOne({
      where: {
        id
      }
    })

    // console.log({usuario})

    res.render('user', {
      titulo: 'Usuário',
      subtitulo: `Usuário #${id}`,
      usuario,
      usuarioLogado: req.cookies.usuario,
      usuarioAdmin: req.cookies.admin,
      bannerTopo: '/images/banner-topo-usuario-1564x472.png',
      bannerMeio: '/images/banner-meio-usuario-1920x1080.png'
    });
  },
  list: async (req, res, next) => {
    let admin = req.cookies.admin
    const users = await db.query('SELECT * FROM users', {
      type: Sequelize.QueryTypes.SELECT
    })

    // USANDO MODEL QUERYING - Método findAll - busca e retorna todos os registros.
    const usuarios = await User.findAll()

    if (!admin || admin === 'false') {
      res.render('users', {
        titulo: 'Ops!',
        subtitulo: 'Você não pode gerenciar usuários, apenas visualizá-los.',
        usuarios,
        usuarioLogado: req.cookies.usuario,
        usuarioAdmin: admin,
        bannerTopo: '/images/banner-topo-usuarios-1564x472.png',
        bannerMeio: '/images/banner-meio-usuarios-1920x1080.png'
      });
    } else {
      res.render('usersList', {
        titulo: 'Usuários',
        subtitulo: 'Listagem de Usuários',
        usuarios: users,
        usuarioLogado: req.cookies.usuario,
        usuarioAdmin: admin
      });
    }
  },
  search: async (req, res) => {
    const { searchParam, searchValue } = req.params
    const whereClause = {}
    whereClause[searchParam] = {
      [Op.like]: `%${searchValue}%`
    }
    const usuarios = await User.findAll({
      where: whereClause
    })
    console.log(usuarios)
    res.render('users', {
      titulo: 'Usuários',
      subtitulo: `Resultado de Busca de Usuários por ${searchParam} com valor ${searchValue}`,
      usuarios,
      usuarioLogado: req.cookies.usuario,
      usuarioAdmin: req.cookies.admin,
      bannerTopo: '/images/banner-topo-usuarios-1564x472.png',
      bannerMeio: '/images/banner-meio-usuarios-1920x1080.png'
    });
  }
}

module.exports = controller
