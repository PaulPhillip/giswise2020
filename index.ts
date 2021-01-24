import * as Http from "http";
import * as Mongo from "mongodb";
import {IncomingMessage, ServerResponse} from "http";
import {URL} from "url";

export namespace Server {

    export class ServerKlasse {
        
        private readonly http_port: number;
        private db: Mongo.MongoClient | null = null; /*Null weil server noch nicht gestartet*/
        private nutzerCollection: Mongo.Collection | null = null; /*Findet collection nicht da server nicht gestartet, daher null*/
        private dbName: string = "phillip";
        private mongodbVerbindungsURL: string = "mongodb+srv://gispaulphillip:v1Ba0P5lT5lHe8jv@gispaulphillipwise2020.xf65h.mongodb.net/"+this.dbName+"?retryWrites=true&w=majority";

        constructor() {
            console.log("Starte den Server"); //Ausgabe für mich selbst
            this.http_port = Number(process.env.PORT);//Übergibt this.http_port den Port der Anfrage
            if (!this.http_port) //wenn kein Port übergeben wurde dann 8100 port speichern
                this.http_port = 8100;
            this.datenbankVerbinden(); //Startet Methode zum Verbinden zum Server
            this.httpServerStarten(); //Startet Methode zum Erstellen des Servers
        }


        private httpServerStarten() {
            Http.createServer(this.ServerAntwort.bind(this)).listen(this.http_port); //Erstellt den Server und bindet an die Methode onMessage, durch das listen befindet er sich in einem dauerzustand und schaltet nicht direkt wieder ab
        }

        private async ServerAntwort(req: IncomingMessage, res: ServerResponse) { //asynchrone Methode, da wir auf den server warten, es wird Incomingmessage übergeben, sowie die Server Antwort
            console.log("Nachricht angekommen: ", req.url); //um die requeste Url anzuzeigen.
            let antwortText = 'URL ist falsch'; //Ausgabe wird hier gespeichert, standardmäßig schon ein URL ist falsch
            if (req.url === "/") { //falls URL leer ist 
                res.write(antwortText); //schreibe die Server Antwort
                res.end(); //und beende die response
                return;
            }
            
                let url = new URL(<string>req.url, "http://localhost:" + this.http_port); //Neues Objekt URL angelegt, dem wird die requested url übergeben, sowie eine base namens Localhost mit dem Port angehängt.

                switch (url.pathname) { //switch case um die verschiedenen urls zu filtern
                    case "/login": //bei /login wird handlelogin ausgeführt
                        antwortText = await this.loginMethode(url.searchParams); //handlelogin wird aufgerufen und es werden die Parameter der angefragten url übergeben, die antwort der methode wird in responsetext gespeichert
                        break;
                    case "/register": //bei /login wird handlelogin ausgeführt
                        antwortText = await this.registrierMethode(url.searchParams); //das selbe nur für die handleregisterMethode
                        break;
                    case "/liste":
                        antwortText = await this.getBenutzerMethode(); //das selbe nur für die userlist methode
                        break;
                }
            
            res.write(antwortText); //wird and den client zurückgegeben
            res.end(); //beendet den responseprozess
        }

        private async datenbankVerbinden(): Promise<void> { //methode um mit der datenbank zu verbinden
            this.db = new Mongo.MongoClient(this.mongodbVerbindungsURL, { useNewUrlParser: true }); //anlegen der MongoDb variable, beinhaltet mongo db link mit passwort und login zur DB
            await this.db.connect(); //wartet darauf mit der db zu verbinden
            this.nutzerCollection = this.db.db(this.dbName).collection("benutzer"); //speichert die collection benutzen in usercollection
        }

        private async loginMethode(params: URLSearchParams): Promise<string> { //die parameter der url werden übergeben und es wird ein string zurückgegeben
            if (!this.nutzerCollection) { // wenn die usercollection nicht vorhanden, dann db error
                return "Fehler mit der Datenbank";
            }
            let passwortVonUebergebeneAnfrage = params.get('password'); //ansonsten speichere in die variable psw, email die parameter von password und email die beim login übergeben wurden
            let emailVonUebergebeneAnfrage = params.get('email');
            if (!passwortVonUebergebeneAnfrage || !emailVonUebergebeneAnfrage) { //wenn eins davon leer bzw falsch ist dann gebe error zurück
                return "error";
            }
            
                let benutzerArray = await this.nutzerCollection.find({email: emailVonUebergebeneAnfrage, password: passwortVonUebergebeneAnfrage}).toArray(); //warte darauf dass in der collection alle einträge gefunden werden, die mit der email nd passwort übereinstimmen und speichere sie in einem array
                if (benutzerArray.length === 0) { //wenn das array leer ist, ist auch kein benutzer vorhanden, also error ausgeben
                    return "Benutzer konnte nicht gefunden werden";
                }
           
            return "Erfolgreich angemeldet!"; //ansonsten gebe success zurück, um ein erfolgreiches einloggen zu simulieren
        }

        private async registrierMethode(params: URLSearchParams): Promise<string> { //parameter der url werden übergeben, ein string wird zurückgegeben
            if (!this.nutzerCollection) { //erneuter test ob die datenbank auch verbunden ist, wenn nein dann error
                return "Fehler mit der Datenbank";
            }//wenn ja dann 
            let vornameVonUebergebeneAnfrage = params.get('vorname');//speichere die parameter des vornames in die variable vorname, genauso auch bei den restlihcen
            let nachnameVonUebergebeneAnfrage = params.get('nachname');
            let passwordVonUebergebeneAnfrage = params.get('password');
            let VonUebergebeneAnfrage = params.get('email');

            if (!vornameVonUebergebeneAnfrage || !nachnameVonUebergebeneAnfrage || !passwordVonUebergebeneAnfrage || !VonUebergebeneAnfrage) { //wenn eins davon leer oder falsch ist gebe error aus
                return "Etwas wurde nicht angegeben!";
            }

            
                let benutzerArray = await this.nutzerCollection.find({email: VonUebergebeneAnfrage}).toArray(); // selbe prinzip wie die methode handleLogin
                if (benutzerArray && benutzerArray.length > 0) { //wenn der array und die länge des arrays größer als 0 sind heißt es, dass es unter dieser email addresse bereits einen nutzer gibt
                    return "Dieser Benutzer existiert bereits.";
                }

                await this.nutzerCollection.insertOne({ //wenn das nicht der fall ist dann füge in die collection vorname, nachname passwort und email ein
                    vorname: vornameVonUebergebeneAnfrage,
                    nachname: nachnameVonUebergebeneAnfrage,
                    password: passwordVonUebergebeneAnfrage,
                    email: VonUebergebeneAnfrage
                });
           
            return "Account wurde erfolgreich angelegt"; //bei erfolgreichen abschließen der aktion
        }

        private async getBenutzerMethode(): Promise<string> {
            if (!this.nutzerCollection) { //db test
                return "Fehler mit der Datenbank";
            }
            let benutzerArray = await this.nutzerCollection.find({}).toArray(); //finde alle einträge in der usercollection
            if (benutzerArray.length === 0) { //array = 0 bedeutet kein eintrag
                return "Kein Benutzer gefunden";
            }

            let antwort = "<pre>"; // html tag zur darstellung von text, somit kann ich die gewünschten daten direkt formatiert ausgeben
            benutzerArray.forEach((entry) => {
                antwort += entry.vorname + " " + entry.nachname + "\r\n";
            });
            antwort += "</pre>";
            return antwort; //gebe die antwort zurück
        }
    }
}

new Server.ServerKlasse();/*Einstiegspunkt*/

