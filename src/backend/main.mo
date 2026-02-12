import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  type Category = {
    #beeProducts;
    #naturalHoney;
    #rawHoney;
  };

  public type AvailabilityStatus = {
    #inStock;
    #limited;
    #outOfStock;
  };

  public type Price = {
    listPrice : Float;
    salePrice : ?Float;
  };

  module Product {
    public func compareByCreated(a : Product, b : Product) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  public type Product = {
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

  public type ProductVariants = {
    #weight : [WeightVariant];
    #flavor : [FlavorVariant];
  };

  public type WeightVariant = {
    weight : Nat;
    description : Text;
    price : Price;
  };

  public type FlavorVariant = {
    flavor : Text;
    description : Text;
    price : Price;
    weight : Nat;
  };

  public type ProductUpdate = {
    id : Nat;
    productUpdateType : ProductUpdateType;
    productId : Nat;
    message : Text;
    timestamp : Time.Time;
  };

  public type ProductUpdateType = {
    #newHarvest;
    #seasonalAvailability;
    #priceUpdate;
    #limitedTimeOffer;
  };

  public type ContactFormSubmission = {
    id : Nat;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
  };

  public type UserRole = {
    #guest;
    #user;
    #admin;
  };

  public type UserProfile = {
    name : Text;
  };

  public type Logo = {
    mimeType : Text;
    data : [Nat8];
  };

  var nextUpdateId = 0;
  var nextContactId = 0;
  var products = Map.empty<Nat, Product>();
  let updates = Map.empty<Nat, ProductUpdate>();
  let contacts = Map.empty<Nat, ContactFormSubmission>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var logo : ?Logo = null;

  public shared ({ caller }) func addAdmin(newAdmin : Principal) : async () {
    AccessControl.assignRole(accessControlState, caller, newAdmin, #admin);
  };

  public shared ({ caller }) func removeAdmin(adminToRemove : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let initialAdminPrincipal = Principal.fromText("zq4an-uqz34-isqap-u5moy-4rxll-vz3ff-ndqph-gvmn5-hqe6u-o6j3v-yqe");
    if (adminToRemove == initialAdminPrincipal) {
      Runtime.trap("Cannot remove the initial admin principal");
    };

    AccessControl.assignRole(accessControlState, caller, adminToRemove, #user);
  };

  public shared ({ caller }) func promoteToUser(principal : Principal) : async () {
    AccessControl.assignRole(accessControlState, caller, principal, #user);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updateLogo(mimeType : Text, data : [Nat8]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (mimeType == "" or data.size() == 0) {
      Runtime.trap("Invalid logo data");
    };
    logo := ?{ mimeType; data };
  };

  public query ({ caller }) func getLogo() : async ?Logo {
    logo;
  };

  public shared ({ caller }) func createProduct(
    name : Text,
    description : Text,
    category : Category,
    price : Price,
    image : Text,
    availability : AvailabilityStatus,
    variants : ?ProductVariants,
    stock : Nat,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let productId = products.size();
    let timestamp = Time.now();
    let product = {
      id = productId;
      name;
      description;
      category;
      price;
      image;
      availability;
      created = timestamp;
      timestamp;
      variants;
      stock;
      isDeleted = false;
    };

    products.add(productId, product);
    productId;
  };

  public shared ({ caller }) func updateProduct(
    id : Nat,
    name : Text,
    description : Text,
    category : Category,
    price : Price,
    image : Text,
    availability : AvailabilityStatus,
    variants : ?ProductVariants,
    stock : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let product = switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };

    let updatedProduct = {
      id;
      name;
      description;
      category;
      price;
      image;
      availability;
      created = product.created;
      timestamp = Time.now();
      variants;
      stock;
      isDeleted = false;
    };

    products.add(id, updatedProduct);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let product = switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };

    if (product.isDeleted) {
      Runtime.trap("Product already deleted");
    };

    let updatedProduct = { product with isDeleted = true };
    products.add(id, updatedProduct);
  };

  public shared ({ caller }) func createProductUpdate(
    productUpdateType : ProductUpdateType,
    productId : Nat,
    message : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let updateId = nextUpdateId;
    nextUpdateId += 1;
    let update = {
      id = updateId;
      productUpdateType;
      productId;
      message;
      timestamp = Time.now();
    };
    updates.add(updateId, update);

    updateId;
  };

  public shared ({ caller }) func deleteProductUpdate(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (updates.get(id)) {
      case (null) { Runtime.trap("Product update not found") };
      case (?_) { updates.remove(id) };
    };
  };

  public shared ({ caller }) func submitContactForm(name : Text, email : Text, message : Text) : async Nat {
    let contactId = nextContactId;
    nextContactId += 1;
    let submission = {
      id = contactId;
      name;
      email;
      message;
      timestamp = Time.now();
    };
    contacts.add(contactId, submission);

    contactId;
  };

  func filterDeletedProducts(caller : Principal, product : Product) : Bool {
    AccessControl.isAdmin(accessControlState, caller) or not product.isDeleted
  };

  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    switch (products.get(id)) {
      case (null) { null };
      case (?product) {
        if (filterDeletedProducts(caller, product)) {
          ?product;
        } else {
          null;
        };
      };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().filter(
      func(product) {
        filterDeletedProducts(caller, product);
      }
    );
  };

  public query ({ caller }) func getProductsByCategory(category : Category) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.category == category and filterDeletedProducts(caller, product);
      }
    );
  };

  public query ({ caller }) func getAllProductUpdates() : async [ProductUpdate] {
    updates.values().toArray();
  };

  public query ({ caller }) func getProductUpdatesByType(productUpdateType : ProductUpdateType) : async [ProductUpdate] {
    updates.values().toArray().filter(
      func(update) {
        update.productUpdateType == productUpdateType;
      }
    );
  };

  public query ({ caller }) func getProductUpdatesByProduct(productId : Nat) : async [ProductUpdate] {
    updates.values().toArray().filter(
      func(update) {
        update.productId == productId;
      }
    );
  };

  public query ({ caller }) func getLimitedProducts() : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.availability == #limited and filterDeletedProducts(caller, product);
      }
    );
  };

  public query ({ caller }) func getContactFormSubmissions() : async [ContactFormSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    contacts.values().toArray();
  };

  public type SeedProductsResult = {
    #seeded : { count : Nat };
    #alreadySeeded;
  };

  public shared ({ caller }) func seedProducts() : async SeedProductsResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    seedProductsInternal();
  };

  func seedProductsInternal() : SeedProductsResult {
    if (products.size() > 0) { return #alreadySeeded };

    let now = Time.now();

    let lipBalm : Product = {
      id = 0;
      name = "Lip Balm";
      description = "Natural beeswax lip balm made from pure bee products. Moisturizes and protects your lips with a hint of honey flavor.";
      category = #beeProducts;
      price = { listPrice = 50.0; salePrice = null };
      image = "/assets/images/products/lip-balm-1.webp";
      availability = #inStock;
      created = now;
      timestamp = now;
      variants = null;
      stock = 100;
      isDeleted = false;
    };

    let beeswax : Product = {
      id = 1;
      name = "Beeswax";
      description = "Pure, natural beeswax - perfect for crafting, cosmetics, and homemade candles. Sustainably sourced and lightly filtered for quality.";
      category = #beeProducts;
      price = { listPrice = 50.0; salePrice = null };
      image = "/assets/images/products/beeswax.webp";
      availability = #inStock;
      created = now;
      timestamp = now;
      variants = null;
      stock = 100;
      isDeleted = false;
    };

    let naturalHoneyVariants : [WeightVariant] = [
      {
        weight = 250;
        description = "250g jar of pure, natural honey - unprocessed and packed with flavor.";
        price = { listPrice = 100.0; salePrice = ?80.0 };
      },
      {
        weight = 500;
        description = "500g jar of pure, natural honey - perfect for everyday use.";
        price = { listPrice = 200.0; salePrice = ?150.0 };
      },
      {
        weight = 1000;
        description = "1kg jar of pure, natural honey - great value for honey lovers.";
        price = { listPrice = 350.0; salePrice = ?275.0 };
      }
    ];

    let naturalHoney : Product = {
      id = 2;
      name = "Natural Honey";
      description = "Pure, unprocessed honey sourced directly from local beekeepers. Carefully harvested to maintain natural flavors and health benefits.";
      category = #naturalHoney;
      price = { listPrice = 100.0; salePrice = ?80.0 };
      image = "/assets/images/products/natural-honey-1.webp";
      availability = #inStock;
      created = now;
      timestamp = now;
      variants = ?#weight(naturalHoneyVariants);
      stock = 100;
      isDeleted = false;
    };

    let rawHoneyVariants : [FlavorVariant] = [
      {
        flavor = "Raw Forest";
        description = "1kg jar of raw forest honey - bold and complex flavors from wild forest blossoms.";
        price = { listPrice = 350.0; salePrice = ?275.0 };
        weight = 1000;
      },
      {
        flavor = "Organic Wild";
        description = "1kg jar of organic wild honey - captures the essence of summer flowers.";
        price = { listPrice = 350.0; salePrice = ?275.0 };
        weight = 1000;
      },
      {
        flavor = "Herbal Infused";
        description = "1kg jar of herbal infused honey - a unique blend of raw honey and natural herbs.";
        price = { listPrice = 350.0; salePrice = ?275.0 };
        weight = 1000;
      }
    ];

    let rawHoney : Product = {
      id = 3;
      name = "Raw Honey";
      description = "Unfiltered, unprocessed honey with naturally occurring flavors. Direct from the hive to your table.";
      category = #rawHoney;
      price = { listPrice = 350.0; salePrice = ?275.0 };
      image = "/assets/images/products/raw-honey-1.webp";
      availability = #inStock;
      created = now;
      timestamp = now;
      variants = ?#flavor(rawHoneyVariants);
      stock = 100;
      isDeleted = false;
    };

    products.add(0, lipBalm);
    products.add(1, beeswax);
    products.add(2, naturalHoney);
    products.add(3, rawHoney);

    #seeded { count = 4 };
  };
};
