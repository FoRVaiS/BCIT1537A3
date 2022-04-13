declare module "comp1537a3" {
    export namespace Models {
        export interface Unicorn {
            name: string;
            dob: string;
            loves: string[];
            weight: number;
            gender: string;
            vampires: number;
        };
    }

    export namespace Post {
        export interface FindByName {
            name: string;
        };

        interface FindByWeight {
            lower: number;
            upper: number;
        };

        interface FindByFood {
            foods: string[]
        };
    }
}