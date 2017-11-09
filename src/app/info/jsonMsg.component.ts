/* Class is used later in Info Component.
 * Represents message, that will be send to database
 * Examplle:
 "origin-source" : "Alphabetarium",
 "user-email" : "soty@directbox.com",
 "client" : "BoJe",
 "timestamp" : "2017-06-22 14:18:00",
 "collection" : "LRS",
 "competence" : "Rechtschreibung",
 "competence-level" : 2,
 "exercise" : "Ein Fohlen kommt zur Welt",
 "exercise-type" : "Silbenhäuschen",
 "score" : "300",
 "max-score" : "500",
 "mode" : "ohne Betreuung"
 */
export class JsonMsg {
  constructor(
    public origin_source: string,
    public user_email: string,
    public client: string,
    public timestamp: string,
    public collection: string,
    public competence: string,
    public competence_level: any, // planet
    public exercise: string, // titel
    public exercise_type: string, // app-part
    public score: any,
    public max_score: string,
    public mode: string
  ) {
  }
}
