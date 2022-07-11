module.exports = (sequelize, DataType) => {
  const User = sequelize.define('User', {
    id: {
      type: DataType.INTEGER.UNSIGNED, // INT UNSIGNED
      primaryKey: true, // PRIMARY KEY
      autoIncrement: true, // AUTO_INCREMENT
      allowNull: false // NOT NULL
    },
    nome: {
      type: DataType.STRING(50), // VARCHAR(50)
      allowNull: false
    },
    sobrenome: {
      type: DataType.STRING(50),
      allowNull: false
    },
    apelido: {
      type: DataType.STRING(50),
      allowNull: false
    },
    nascimento: {
      type: DataType.DATEONLY,
      allowNull: true // Já é o default, não precisaríamos declarar
    },
    senha: {
      type: DataType.STRING(512),
      allowNull: false
    },
    corPreferida: {
      type: DataType.STRING(7),
      allowNull: true // Já é o default, não precisaríamos declarar
    },
    avatar: {
      type: DataType.STRING(150),
      allowNull: true // Já é o default, não precisaríamos declarar
    },
    email: {
      type: DataType.STRING(150),
      allowNull: true // Já é o default, não precisaríamos declarar
    },
    telefone: {
      type: DataType.STRING(13),
      allowNull: true // Já é o default, não precisaríamos declarar
    },
    bio: {
      type: DataType.TEXT, // TEXT
      allowNull: true // Já é o default, não precisaríamos declarar
    },
    plano_id: {
      type: DataType.INTEGER.UNSIGNED, // INT UNSIGNED
      allowNull: false // NOT NULL
    },
    papel_id: {
      type: DataType.INTEGER.UNSIGNED, // INT UNSIGNED
      allowNull: false, // NOT NULL
    },
    criadoEm: {
      type: DataType.DATE, // DATETIME / TIMESTAMP
      allowNull: false, // NOT NULL
    },
    modificadoEm: {
      type: DataType.DATE, // DATETIME / TIMESTAMP
      allowNull: false, // NOT NULL
    }
  },
    {
      tableName: 'users', // Nome da tabela lá no nosso Banco de Dados (BD)
      timestamps: false // Indicamos para que não crie os atributos/campos/colunas createdAt e modifiedAt, pois estamos usando em PT-BR
    })
  return User
}