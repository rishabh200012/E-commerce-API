export default class cartItemModel{
    constructor( productID,userID, quantity, id){
        this.productID=productID;
        this.userID=userID;
        this.quantity=quantity;
        this.id=id;
    }

  static  add(productID, userID, quantity){
       const cartitem=new cartItemModel(productID, userID, quantity);
       cartitem.id=cartItems.length+1;
       cartItems.push(cartitem);
       return cartitem;
    }

    static get(userID){
        return cartItems.filter(
            (i)=> i.userID == userID
        );
    }

    static delete(cartItemID, userID){
        const cartIndex=cartItems.findIndex((u)=>u.id==cartItemID && u.userID==userID);
        if(cartIndex==-1){
           return "Item not found";
        }
        else{
            cartItems.splice(cartIndex,1);
        }
    }
}

var cartItems=[
    new cartItemModel(1,2,4),
    new cartItemModel(1,1,2,1),
]