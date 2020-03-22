interface AsyncCallback {
	(): Promise<any>;
}

interface SyncCallback {
	(): void;
}

interface Writer {
	(buffer: string | Buffer, callback?: Function): boolean;
	(message: string, encoding?: string, callback?: Function): boolean;
}

class LogCapturer {
	public static capture(callback: SyncCallback): string {
		return new this().capture(callback);
	}

	public static captureAsync(callback: AsyncCallback): Promise<string> {
		return new this().captureAsync(callback);
	}

	private capturedOutput: string = '';
	private originalWrite: Writer;

	public constructor() {
		this.originalWrite = process.stdout.write;
	}

	public capture(callback: SyncCallback): string {
		this.replaceWrite();

		callback();

		this.restoreWrite();

		return this.capturedOutput;
	}

	public captureAsync(callback: AsyncCallback): Promise<string> {
		this.replaceWrite();

		return callback().then((success) => {
			this.restoreWrite();

			return this.capturedOutput;
		});
	}

	private replaceWrite(): void {
		process.stdout.write = this.handleStdout.bind(this) as Writer;
	}

	private handleStdout(
		message: string,
		encoding?: string,
		callback?: Function
	): boolean {
		this.capturedOutput += message;
		return true;
	}

	private restoreWrite(): void {
		process.stdout.write = this.originalWrite;
	}
}

export default LogCapturer;
