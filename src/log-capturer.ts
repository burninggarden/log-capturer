interface AsyncCallback {
	() : Promise<any>;
}

interface SyncCallback {
	() : void;
}

interface Writer {
	(buffer: string | Buffer, callback?: Function): boolean;
	(message: string, encoding?: string, callback?: Function): boolean;
}

class LogCapturer {

	private capturedOutput : string = '';
	private originalWrite	: Writer;

	public static capture(callback: SyncCallback) : string {
		return (new this()).capture(callback);
	}

	public static captureAsync(callback) : Promise<string> {
		return (new this()).captureAsync(callback);
	}

	public capture(callback: SyncCallback) : string {
		this.replaceWrite();

		callback();

		this.restoreWrite();

		return this.capturedOutput;
	}

	public captureAsync(callback: AsyncCallback) : Promise<string> {
		this.replaceWrite();

		return callback().then(
			success => {
				this.restoreWrite();

				return this.capturedOutput;
			}
		);
	}

	private replaceWrite() : void {
		this.originalWrite = process.stdout.write;

		process.stdout.write = this.handleStdout.bind(this);
	}

	private handleStdout(message: string, encoding?: string, callback?: Function) : boolean {
		this.capturedOutput += message;
		return true;
	}

	private restoreWrite() : void {
		process.stdout.write = this.originalWrite;
	}

}

export default LogCapturer;
