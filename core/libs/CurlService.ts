const querystring = require("querystring");
const { Curl } = require("node-libcurl");

class CurlService {
    private curl;
    constructor() {
        this.curl = new Curl();
    }

    post(url: string, data: object):Promise<void> {
        return new Promise((resolve, reject) => {
            this.curl.setOpt(Curl.option.URL, url);
            this.curl.setOpt(Curl.option.POST, true);
            this.curl.setOpt(
                Curl.option.POSTFIELDS,
                querystring.stringify(data)
            );

            this.curl.on("end", (statusCode:number, data:any, headers:any) => {
                const self:any = this;
                console.info("Status code " + statusCode);
                console.info("***");
                console.info("Our response: " + data);
                console.info("***");
                console.info("Length: " + data.length);
                console.info("***");
                this.curl.close();
                const response: any = {
                    code: statusCode,
                    data,
                    headers
                }
                return resolve(response);
            });

            this.curl.on("error", (data:any) => {
                return reject(data)
            });

            this.curl.perform();
        })
    }
}

export { CurlService };