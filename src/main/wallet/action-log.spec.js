import ActionLog from './action-log';
import TestDb from '../db/test-db';

describe('ActionLog model', () => {
	const testLog = { walletId: 10, title: 'test', content: 'test content' };
	beforeEach(async () => {
		await TestDb.init();
	});

	afterEach(async () => {
		await TestDb.reset();
	});

	afterAll(async () => {
		await TestDb.destroy();
	});
	it('create', async () => {
		const log = await ActionLog.create(testLog);
		expect(log).toMatchObject(testLog);
		expect(log).toHaveProperty('createdAt');
		expect(log).toHaveProperty('updatedAt');
	});
	it('findByWalletId', async () => {
		await ActionLog.query().insert(testLog);
		await ActionLog.query().insert(testLog);
		const logs = await ActionLog.findByWalletId(testLog.walletId);
		expect(logs.length).toEqual(2);
		const log = logs[0];
		expect(log.walletId).toEqual(testLog.walletId);
		expect(log.title).toEqual(testLog.title);
		expect(log.content).toEqual(testLog.content);
	});
});
