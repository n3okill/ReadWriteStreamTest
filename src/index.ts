import * as fs from "fs";
import * as assert from "assert";

const hello = "Hello World!";

export class ReadStream extends fs.ReadStream {
    constructor(path: fs.PathLike, options?: unknown) {
        super(path, options);
    }
    readHello() {
        return this.read(hello.length);
    }
}



export class WriteStream extends fs.WriteStream {
    constructor(path: fs.PathLike, options?: unknown) {
        super(path, options);
    }

    writeHello() {
        this.write(hello, "utf8");
    }
}

const ws = new WriteStream("./test.txt");
ws.setDefaultEncoding("utf8");

ws.on('finish', function () {
    let result: string;
    const rs = new ReadStream("./test.txt");
    rs.setEncoding("utf8");

    rs.on("readable", function (this: ReadStream) {
        result = this.readHello();
        this.destroy();
    });
    rs.on("close", function () {
        assert.strictEqual(hello, result);
        console.log("Result successful");
        fs.unlinkSync("./test.txt");
    });
});

ws.on('error', function (err) {
    console.log(err.stack);
});

ws.writeHello();
ws.end();