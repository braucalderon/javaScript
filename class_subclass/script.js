// ---------------------------------
// park class
// ---------------------------------
{
    class Parks {
        constructor(name) {
            this.name = name;
            this.name_park = ['Green Park', 'Central Park', 'Morning Park', 'Dog Park'];

        }

        // get the park name 
        park_name() {
            let n_park;
            this.name_park.forEach(cur => {
                if (cur === this.name) {
                    // console.log(this.name);
                    n_park = this.name;
                }
            });
            return n_park
        }

    }
    // ---------------------------------
    // Streets class
    // ---------------------------------

    class Streets extends Parks {
        constructor(name, cur_year) {
            super(name);
            this.cur_year = cur_year;
            this.streets = 0;
            this.arr = [];

        }

        parkInfo(park_name) {
            const park_trees = new Map();

            //  key = park_area
            park_trees.set(20, 'Morning Park');
            park_trees.set(10, 'Central Park');
            park_trees.set(25, 'Green Park');
            park_trees.set(40, 'Dog Park');

            park_trees.forEach((value, key) => {
                if (value === park_name) {
                    this.treesPark(key, value);
                    this.streetName(value);
                    // console.log(`${this.streets}`);
                    this.calcAvg();
                }
            });
        }

        treesPark(area, park_name) {
            const park_trees = new Map();

            // key = number of trees
            park_trees.set(1960, 'Morning Park');
            park_trees.set(900, 'Central Park');
            park_trees.set(400, 'Green Park');
            park_trees.set(1100, 'Dog Park');

            console.log('-------------');
            park_trees.forEach((value, key) => {
                if (value === park_name) {
                    console.log(`${value} has a tree density of ${key / area} per square mile, with ${this.cur_year - key} years old`);
                    key > 1000 ? console.log(`${value} has ${key} trees.`) : null;
                }
            });

        }

        streetName(park_name) {
            const street_name = new Map();

            // key = street number
            street_name.set('Washington', 'Morning Park');
            street_name.set('Castle Hill', 'Morning Park');
            street_name.set('Cabrini', 'Morning Park');
            street_name.set('Riverside', 'Morning Park');
            street_name.set('Inwood', 'Central Park');
            street_name.set('St Nicholas', 'Green Park');
            street_name.set('Amsterdam', 'Dog Park');

            street_name.forEach((value, key) => {
                if (value === park_name) {
                    // console.log(`${key} Street.`);
                    this.streetBuilt(key);
                    this.streets++;
                }
            });
            console.log(`${this.name} has ${this.streets} street(s)`);


        }

        streetBuilt(street_name) {
            const street_built = new Map();

            // key = year
            street_built.set(1990, 'Washington');
            street_built.set(1880, 'Castle Hill');
            street_built.set(1920, 'Cabrini');
            street_built.set(1800, 'Riverside');
            street_built.set(2000, 'Inwood');
            street_built.set(1700, 'St Nicholas');
            street_built.set(1500, 'Amsterdam');


            street_built.forEach((value, key) => {
                if (value === street_name) {
                    console.log(`${value} street that was built in ${key}`);
                    // subtract year with current year to push it into the array
                    this.arr.push(this.cur_year - key);
                }
            });


        }

        calcAvg() {
            // console.log(`The array is ${this.arr}`)
            // gets the sum of all the numbers in an array
            const sum = this.arr.reduce((prev, cur) => prev + cur);

            console.log(`The ${this.streets} street(s) in ${this.name} has the average of ${sum / this.arr.length} years`);

        }
    }
    // ---------------------------------
    // Objects
    // ---------------------------------

    const d = new Date();
    let year = d.getFullYear();

    const park1 = [new Streets('Morning Park', year),
    new Streets('Central Park', year),
    new Streets('Green Park', year),
    new Streets('Dog Park', year)];

    // const park1 = new Streets('Morning Park', 23, 23, 2);
    // park1.parkInfo(park1.park_name());

    function report(p) {
        p.forEach(p => p.parkInfo(p.park_name()));

    }
    report(park1);

}


