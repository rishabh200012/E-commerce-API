import { getDb } from '../../config/mongodb.js';
import { ApplicationError } from '../../error-handler/application-error.js';

export class userModel{

    constructor(name, email, password, type, id){
        this.name=name;
        this.email=email;
        this.password=password;
        this.type=type;
        this.id=id;
    }
    
    static getAll(){
        return users;
    }
}

var users=[{
    id:1,
    name:"seller user",
    email:"seller@ecom.com",
    password:"123456",
    type:"seller",
},

    {
        id:2,
        name:"customer",
        email:"customer@ecom.com",
        password:"654321",
        type:"customer"
    }
];