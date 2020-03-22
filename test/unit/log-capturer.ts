import PromiseWrapper from '@burninggarden/promise-wrapper';
import LogCapturer from 'log-capturer';

describe('LogCapturer', () => {
	describe('capture()', () => {
		it('returns expected output', () => {
			const message = 'A user-defined message';

			const output = LogCapturer.capture(() => {
				process.stdout.write(message);
			});

			expect(output).toContain(message);
		});
	});

	describe('captureAsync()', () => {
		it('resolves with expected output', async () => {
			const message = 'A user-defined message';

			const output = await LogCapturer.captureAsync(() => {
				const promiseWrapper = new PromiseWrapper();

				setTimeout(() => {
					process.stdout.write(message);
					promiseWrapper.resolve();
				}, 0);

				return promiseWrapper.getPromise();
			});

			expect(output).toContain(message);
		});
	});
});
