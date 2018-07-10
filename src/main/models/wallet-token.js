const BaseModel = require('./base');
const { Model, transaction } = require('objection');

const TABLE_NAME = 'wallet_tokens';

class WalletToken extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['tokenId'],
			properties: {
				id: { type: 'integer' },
				walletId: { type: 'integer' },
				tokenId: { type: 'integer' },
				balance: { type: 'number' },
				hidden: { type: 'integer' },
				recordState: { type: 'integer' }
			}
		};
	}

	static get relationMappings() {
		const Wallet = require('./wallet');
		const Token = require('./token');

		return {
			wallet: {
				relation: Model.BelongsToOneRelation,
				modelClass: Wallet,
				join: {
					from: `${this.tableName}.walletId`,
					to: `${Wallet.tableName}.id`
				}
			},
			token: {
				relation: Model.BelongsToOneRelation,
				modelClass: Token,
				join: {
					from: `${this.tableName}.tokenId`,
					to: `${Token.tableName}.id`
				}
			}
		};
	}
	static create(itm) {
		return this.query().insertAndFetch(itm);
	}

	static update(itm) {
		return this.query().patchAndFetchById(itm.id, itm);
	}

	static async createWithNewToken(token, balance, walletId) {
		const tx = await transaction.start(this.knex());
		try {
			let wtoken = this.guery(tx).graphInsertAndFetch({
				walletId,
				token,
				balance,
				recordState: 1
			});
			await tx.commit();
			return wtoken;
		} catch (error) {
			await tx.rollback();
			throw error;
		}
	}

	static find(where) {
		return this.query()
			.select(
				'wallet_tokens.*',
				'token_prices.name',
				'token_prices.priceUSD',
				'tokens.symbol',
				'tokens.decimal',
				'tokens.address',
				'tokens.isCustom'
			)
			.leftJoin('tokens', 'tokenId', 'tokens.id')
			.leftJoin('token_prices', 'tokens.symbol', 'token_prices.symbol')
			.where(where);
	}

	static async findOne(where) {
		let results = await this.find(where);
		if (!results || !results.length) return null;
		return results[0];
	}

	static findOneById(id) {
		return this.findOne({ 'wallet_tokens.id': id });
	}

	static findOneByWalletId(walletId) {
		return this.findOne({ walletId, recordState: 1 });
	}

	static findByWalletId(walletId) {
		return this.find({ walletId, recordState: 1 });
	}
}

module.exports = WalletToken;