import * as Http from "http";
import * as Mongo from "mongodb";
import {IncomingMessage, ServerResponse} from "http";
import {URL} from "url";

export namespace A08Server {

    export class Server {
        private readonly http_port: number;

        private db: Mongo.MongoClient | null = null;
        private userCollection: Mongo.Collection | null = null;
        private db_name: string = "abgabe3";
        private mongodb_connection_url: string = "mongodb://localhost:27017";

        constructor() {
            console.log("Starting server");
            this.http_port = Number(process.env.PORT);
            if (!this.http_port)
                this.http_port = 8100;
            this.connectDatabase();
            this.startHttpServer();
        }


        private startHttpServer() {
            Http.createServer(this.onMessage.bind(this)).listen(this.http_port);
        }

        private async onMessage(req: IncomingMessage, res: ServerResponse) {
            console.log("Message received: ", req.url);
            let responseText = '404';
            if (req.url === "/") {
                res.write(responseText);
                res.end();
                return;
            }
            try {
                let url = new URL(<string>req.url, "http://localhost:" + this.http_port);

                switch (url.pathname) {
                    case "/login":
                        responseText = await this.handleLogin(url.searchParams);
                        break;
                    case "/register":
                        responseText = await this.handleRegister(url.searchParams);
                        break;
                    case "/list":
                        responseText = await this.getUserList();
                        break;
                }
            } catch (e) {
                console.log(e);
            }
            res.write(responseText);
            res.end();
        }

        private async connectDatabase(): Promise<void> {
            this.db = new Mongo.MongoClient(this.mongodb_connection_url);
            await this.db.connect();
            this.userCollection = this.db.db(this.db_name).collection("users");
        }

        private async handleLogin(params: URLSearchParams): Promise<string> {
            if (!this.userCollection) {
                return "db_error";
            }
            let psw = params.get('password');
            let email = params.get('email');
            if (!psw || !email) {
                return "error";
            }
            try {
                let userArray = await this.userCollection.find({email: email, password: psw}).toArray();
                if (userArray && userArray.length === 0) {
                    return "error_user_not_found";
                }
            } catch (e) {
                return e.message;
            }
            return "success";
        }

        private async handleRegister(params: URLSearchParams): Promise<string> {
            if (!this.userCollection) {
                return "db_error";
            }
            let vorname = params.get('vorname');
            let nachname = params.get('nachname');
            let password = params.get('password');
            let email = params.get('email');

            if (!vorname || !nachname || !password || !email) {
                return "data_error";
            }

            try {
                let userArray = await this.userCollection.find({email: email}).toArray();
                if (userArray && userArray.length > 0) {
                    return "already_existing_error";
                }

                await this.userCollection.insertOne({
                    vorname: vorname,
                    nachname: nachname,
                    password: password,
                    email: email
                });
            } catch (e) {
                return e.message;
            }
            return "success";
        }

        private async getUserList(): Promise<string> {
            if (!this.userCollection) {
                return "db_error";
            }
            let userArray = await this.userCollection.find({}).toArray();
            if (userArray.length === 0) {
                return "no user in list";
            }

            let response = "<pre>";
            userArray.forEach((entry) => {
                response += entry.vorname + " " + entry.nachname + "\r\n";
            });
            response += "</pre>";
            return response;
        }
    }
}

new A08Server.Server();

