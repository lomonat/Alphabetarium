/*
* Class sores user data: volume and planet
*/
export class UserData {
    public volume: number;
    public planet: number;

    constructor() {
        if (localStorage.getItem('userData') === null) {
            this.planet = 1;
            this.volume = 1;
            this.save();
        }

        const json = JSON.parse(localStorage.getItem('userData'));
        this.planet = json.planet;
        this.volume = json.volume;
    }

    save(): void {
        localStorage.setItem('userData', JSON.stringify(this));
    }
}
