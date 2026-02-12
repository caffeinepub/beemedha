import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Category = {
    #rawForest;
    #organicWild;
    #herbalInfused;
    #honeyComb;
  };

  type AvailabilityStatus = {
    #inStock;
    #limited;
    #outOfStock;
  };

  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    category : Category;
    price : Float;
    images : [Text];
    availability : AvailabilityStatus;
    created : Time.Time;
    timestamp : Time.Time;
  };

  type ProductUpdate = {
    id : Nat;
    productUpdateType : ProductUpdateType;
    productId : Nat;
    message : Text;
    timestamp : Time.Time;
  };

  type ProductUpdateType = { #newHarvest; #seasonalAvailability; #priceUpdate; #limitedTimeOffer };
  type ContactFormSubmission = {
    id : Nat;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  module Product {
    public func compareProductsByCreated(a : Product, b : Product) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  let nextProductIdMap = Map.empty<Text, Nat>();
  var nextUpdateId = 0;
  var nextContactId = 0;
  let products = Map.empty<Nat, Product>();
  let updates = Map.empty<Nat, ProductUpdate>();
  let contacts = Map.empty<Nat, ContactFormSubmission>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
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

  // Product Management (Admin-only)
  public shared ({ caller }) func createProduct(
    name : Text,
    description : Text,
    category : Category,
    price : Float,
    images : [Text],
    availability : AvailabilityStatus,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    let productId = products.size();
    let timestamp = Time.now();
    let product = {
      id = productId;
      name;
      description;
      category;
      price;
      images;
      availability;
      created = timestamp;
      timestamp;
    };
    products.add(productId, product);
    productId;
  };

  public shared ({ caller }) func updateProduct(
    id : Nat,
    name : Text,
    description : Text,
    category : Category,
    price : Float,
    images : [Text],
    availability : AvailabilityStatus,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
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
      images;
      availability;
      created = product.created;
      timestamp = Time.now();
    };
    products.add(id, updatedProduct);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) { products.remove(id) };
    };
  };

  // Product Update Management (Admin-only)
  public shared ({ caller }) func createProductUpdate(
    productUpdateType : ProductUpdateType,
    productId : Nat,
    message : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create product updates");
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
      Runtime.trap("Unauthorized: Only admins can delete product updates");
    };
    switch (updates.get(id)) {
      case (null) { Runtime.trap("Product update not found") };
      case (?_) { updates.remove(id) };
    };
  };

  // Contact Form (Public - any user including guests)
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

  // Public Query Functions (No authorization needed)
  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    let list = List.empty<Product>();
    for (product in products.values()) {
      list.add(product);
    };
    list.toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : Category) : async [Product] {
    let filtered = List.empty<Product>();
    for (product in products.values()) {
      if (product.category == category) {
        filtered.add(product);
      };
    };
    let result = filtered.toArray();
    result.sort(Product.compareProductsByCreated);
  };

  public query ({ caller }) func getAllProductUpdates() : async [ProductUpdate] {
    let list = List.empty<ProductUpdate>();
    for (update in updates.values()) {
      list.add(update);
    };
    list.toArray();
  };

  public query ({ caller }) func getProductUpdatesByType(productUpdateType : ProductUpdateType) : async [ProductUpdate] {
    let filtered = List.empty<ProductUpdate>();
    for (update in updates.values()) {
      if (update.productUpdateType == productUpdateType) {
        filtered.add(update);
      };
    };
    filtered.toArray();
  };

  public query ({ caller }) func getProductUpdatesByProduct(productId : Nat) : async [ProductUpdate] {
    let filtered = List.empty<ProductUpdate>();
    for (update in updates.values()) {
      if (update.productId == productId) {
        filtered.add(update);
      };
    };
    filtered.toArray();
  };

  // Admin-only Query Functions
  public query ({ caller }) func getContactFormSubmissions() : async [ContactFormSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact form submissions");
    };
    let list = List.empty<ContactFormSubmission>();
    for (submission in contacts.values()) {
      list.add(submission);
    };
    list.toArray();
  };
};
