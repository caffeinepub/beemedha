import Map "mo:core/Map";
import Int "mo:core/Int";
import Time "mo:core/Time";

module {
  // Type definitions based on old actor
  type Category = {
    #beeProducts;
    #naturalHoney;
    #rawHoney;
  };

  type AvailabilityStatus = {
    #inStock;
    #limited;
    #outOfStock;
  };

  type Price = {
    listPrice : Float;
    salePrice : ?Float;
  };

  type Product = {
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

  type ProductVariants = {
    #weight : [WeightVariant];
    #flavor : [FlavorVariant];
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

  type ProductUpdate = {
    id : Nat;
    productUpdateType : ProductUpdateType;
    productId : Nat;
    message : Text;
    timestamp : Time.Time;
  };

  type ProductUpdateType = {
    #newHarvest;
    #seasonalAvailability;
    #priceUpdate;
    #limitedTimeOffer;
  };

  type ContactFormSubmission = {
    id : Nat;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
  };

  type UserRole = {
    #guest;
    #user;
    #admin;
  };

  type UserProfile = {
    name : Text;
  };

  type Logo = {
    mimeType : Text;
    data : [Nat8];
  };

  // Old actor includes adminPrincipals and nextProductIdMap.
  type OldActor = {
    nextUpdateId : Nat;
    nextContactId : Nat;
    products : Map.Map<Nat, Product>;
    updates : Map.Map<Nat, ProductUpdate>;
    contacts : Map.Map<Nat, ContactFormSubmission>;
    userProfiles : Map.Map<Principal, UserProfile>;
    logo : ?Logo;
    adminPrincipals : Map.Map<Principal, Bool>;
    nextProductIdMap : Map.Map<Text, Nat>;
  };

  // New actor omits adminPrincipals and nextProductIdMap.
  type NewActor = {
    nextUpdateId : Nat;
    nextContactId : Nat;
    products : Map.Map<Nat, Product>;
    updates : Map.Map<Nat, ProductUpdate>;
    contacts : Map.Map<Nat, ContactFormSubmission>;
    userProfiles : Map.Map<Principal, UserProfile>;
    logo : ?Logo;
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    {
      nextUpdateId = old.nextUpdateId;
      nextContactId = old.nextContactId;
      products = old.products;
      updates = old.updates;
      contacts = old.contacts;
      userProfiles = old.userProfiles;
      logo = old.logo;
    };
  };
};
