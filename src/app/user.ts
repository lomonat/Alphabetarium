/*
* Class stores data for registration form
*/
export class User {
  constructor (
    public user_email: string,
    public client: string,
    public mode: string,
    public origin_source: string
  ) {}
}
