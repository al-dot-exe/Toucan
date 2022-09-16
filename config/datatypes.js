// Custom Data Types: https://github.com/sequelize/sequelize/issues/11177#issuecomment-785481990

const util = require('util')
const DataTypes = require('../node_modules/sequelize/lib/data-types')
const { classToInvokable } = require('../node_modules/sequelize/lib/utils/class-to-invokable');


const ABSTRACT = DataTypes.ABSTRACT.prototype.constructor;

const ExtendedDataTypes = (Sequelize) => {
   let DataTypes = Sequelize.DataTypes;

   // Torrent ID extension class
   class TORRENTID extends ABSTRACT {
      constructor(length) {
         super();
         const options = typeof length === 'object' && length || { length };
         this.options = options;
         this._length = options.length || '';
      }

      toSql() {
         return this.key;
      }

      validate(value) {
         if (typeof value === 'string') {
            if ((value.startsWith('magnet') || (Buffer.isBuffer(value)))) {
               return true
            } else {
               throw new sequelizeErrors.ValidationError(util.format('%j is not a .torrent nor a MagnetURI', value));
            }
         }
      }

      _stringify(value) {
         if (value.startsWith('magnet')) {
            return value;
         }
         if (!Buffer.isBuffer(value)) {
            if (Array.isArray(value)) {
               value = Buffer.from(value);
            } else {
               value = Buffer.from(value.toString());
            }
         }
         const hex = value.toString('hex');
         return this._hexify(hex);
      }

      _hexify(hex) {
         return `X'${hex}'`;
      }

      _bindParam(value, options) {
         if (!Buffer.isBuffer(value)) {
            if (Array.isArray(value)) {
               value = Buffer.from(value);
            } else {
               value = Buffer.from(value.toString());
            }
         }
         return options.bindParam(value);
      }

      static parse(value) {
         if (value.toString().startsWith('magnet')) {
            return value.toString();
         }
      }
   }


   // DataType Initiation
   DataTypes.TORRENTID = classToInvokable(TORRENTID);
   DataTypes.TORRENTID.prototype.key = 'torrentid';
   DataTypes.TORRENTID.key = DataTypes.TORRENTID.prototype.key;
   Sequelize.TORRENTID = Sequelize.Utils.classToInvokable(DataTypes.TORRENTID);


   // SQL Dialect Mappings // noticed for the mappings I am getting function instead of class mapping
   // The types and keys for each dialect MUST be lowercase if they are the same name as the DataType class
   
   //SQLite for this project
   DataTypes.TORRENTID.types.sqlite = ['torrentid'];
   const LiteTypes = DataTypes.sqlite;

   LiteTypes.TORRENTID = function TORRENTID() {
      if (!(this instanceof LiteTypes.TORRENTID)) return new LiteTypes.TORRENTID();
      DataTypes.TORRENTID.apply(this, arguments);
   }
   util.inherits(LiteTypes.TORRENTID, DataTypes.TORRENTID); //inherits is deprecated & needs a fix
   LiteTypes.TORRENTID.parse = DataTypes.TORRENTID.parse;
   LiteTypes.TORRENTID.types = { sqlite: ['torrentid'] };
   DataTypes.sqlite.TORRENTID.key = 'torrentid';

   // Postgres is also required: https://sequelize.org/docs/v6/other-topics/extending-data-types/#postgresql
   DataTypes.TORRENTID.types.postgres = ['torrentid'];
   const PgTypes = DataTypes.postgres;

   PgTypes.TORRENTID = function TORRENTID() {
      if (!(this instanceof PgTypes.TORRENTID)) return new PgTypes.TORRENTID();
      DataTypes.TORRENTID.apply(this, arguments);
   }
   util.inherits(PgTypes.TORRENTID, DataTypes.TORRENTID); //inherits is deprecated & needs a fix
   PgTypes.TORRENTID.parse = DataTypes.TORRENTID.parse;
   PgTypes.TORRENTID.types = { postgres: ['torrentid'] };
   DataTypes.postgres.TORRENTID.key = 'torrentid';
}

Object.defineProperty(exports, "__esModule", {
   value: true
});


exports.default = ExtendedDataTypes
