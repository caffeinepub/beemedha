import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  type Category = {
    #beeProducts;
    #naturalHoney;
    #rawHoney;
  };

  type Price = {
    listPrice : Float;
    salePrice : ?Float;
  };

  type AvailabilityStatus = {
    #inStock;
    #limited;
    #outOfStock;
  };

  type WeightVariant = {
    weight : Nat;
    description : Text;
    price : Price;
  };

  type FlavorVariant = {
    flavor : Text;
    description : Text;
    price : Price;
    weight : Nat;
  };

  type ProductVariants = {
    #weight : [WeightVariant];
    #flavor : [FlavorVariant];
  };

  type OldProduct = {
    id : Nat;
    name : Text;
    description : Text;
    category : Category;
    price : Price;
    images : [Text];
    availability : AvailabilityStatus;
    timestamp : Time.Time;
    created : Time.Time;
    variants : ?ProductVariants;
  };

  type NewProduct = {
    id : Nat;
    name : Text;
    description : Text;
    category : Category;
    price : Price;
    image : Text;
    availability : AvailabilityStatus;
    created : Time.Time;
    timestamp : Time.Time;
    variants : ?ProductVariants;
    stock : Nat;
    isDeleted : Bool;
  };

  type OldActor = {
    products : Map.Map<Nat, OldProduct>;
  };

  type NewActor = {
    products : Map.Map<Nat, NewProduct>;
  };

  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.map<Nat, OldProduct, NewProduct>(
      func(_id, oldProduct) {
        {
          oldProduct with
          image = if (oldProduct.images.size() > 0) {
            oldProduct.images[0];
          } else { "/assets/images/default.webp" };
          stock = 100;
          isDeleted = false;
        };
      }
    );
    { products = newProducts };
  };
};
