import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Blob "mo:core/Blob";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";



actor {
  // Product types
  type Category = {
    #beeProducts;
    #naturalHoney;
    #rawHoney;
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

  type AvailabilityStatus = {
    #inStock;
    #limited;
    #outOfStock;
  };

  public type Price = {
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

  type StoreSettings = {
    backgroundImage : ?Text;
    mapUrl : Text;
    contactDetails : Text;
    certificationsContent : Text;
    certificationsImage : ?Text;
    aboutContent : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  type Logo = {
    mimeType : Text;
    data : [Nat8];
  };

  public type CustomerIdentifier = {
    #email : Text;
    #phone : Text;
  };

  type CustomerSession = {
    sessionId : Text;
    identifier : CustomerIdentifier;
    expiresAt : Time.Time;
  };

  type DeliveryAddress = {
    name : Text;
    addressLine1 : Text;
    addressLine2 : Text;
    city : Text;
    state : Text;
    postalCode : Text;
    country : Text;
    phoneNumber : Text;
  };

  public type OrderStatus = {
    #pending;
    #inProgress;
    #transit;
    #delivered;
  };

  public type OrderType = {
    id : Nat;
    customerIdentifier : CustomerIdentifier;
    items : [OrderItem];
    totalPrice : Float;
    status : OrderStatus;
    address : DeliveryAddress;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type OrderItem = {
    productId : Nat;
    quantity : Nat;
    weightVariant : ?WeightVariant;
    flavorVariant : ?FlavorVariant;
  };

  type ProductKey = Blob;
  var productKeyIncrement : Int = 0;

  var nextUpdateId = 0;
  var nextContactId = 0;
  var nextOrderId = 0;
  var logo : ?Logo = null;

  let products = Map.empty<Nat, Product>();
  let productVariants = Map.empty<Nat, ProductVariants>();
  let updates = Map.empty<Nat, ProductUpdate>();
  let contacts = Map.empty<Nat, ContactFormSubmission>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let orders = Map.empty<Nat, OrderType>();
  let deliveryAddresses = Map.empty<Text, [DeliveryAddress]>();

  var siteSettings : StoreSettings = {
    backgroundImage = null;
    mapUrl = "https://maps.app.goo.gl/J6bsG7n3H4yPBrPK9";
    contactDetails = "";
    certificationsContent = "";
    certificationsImage = null;
    aboutContent = "";
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Product CRUD
  public type CreateProductPayload = {
    name : Text;
    description : Text;
    category : Category;
    price : Price;
    image : Text;
    availability : AvailabilityStatus;
    variants : ?ProductVariants;
    stock : Nat;
  };

  public type UpdateProductPayload = {
    id : Nat;
    name : Text;
    description : Text;
    category : Category;
    price : Price;
    image : Text;
    availability : AvailabilityStatus;
    variants : ?ProductVariants;
    stock : Nat;
  };

  public shared ({ caller }) func createProduct(payload : CreateProductPayload) : async {
    #success : Product;
    #error : Text;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      return #error("Unauthorized: Only admins can create products");
    };

    let productId = createProductKey();
    let now = Time.now();
    let product : Product = {
      id = productId;
      name = payload.name;
      description = payload.description;
      category = payload.category;
      price = payload.price;
      image = payload.image;
      availability = payload.availability;
      created = now;
      timestamp = now;
      variants = payload.variants;
      stock = payload.stock;
      isDeleted = false;
    };

    products.add(productId, product);
    #success(product);
  };

  public shared ({ caller }) func updateProduct(payload : UpdateProductPayload) : async {
    #success : Product;
    #error : Text;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      return #error("Unauthorized: Only admins can update products");
    };

    switch (products.get(payload.id)) {
      case (null) { #error("Product not found") };
      case (?existingProduct) {
        let updatedProduct : Product = {
          id = existingProduct.id;
          name = payload.name;
          description = payload.description;
          category = payload.category;
          price = payload.price;
          image = payload.image;
          availability = payload.availability;
          created = existingProduct.created;
          timestamp = Time.now();
          variants = payload.variants;
          stock = payload.stock;
          isDeleted = existingProduct.isDeleted;
        };
        products.add(payload.id, updatedProduct);
        #success(updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(productId : Nat) : async { #success : (); #error : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      return #error("Unauthorized: Only admins can delete products");
    };

    switch (products.get(productId)) {
      case (null) { #error("Product not found") };
      case (?product) {
        let deletedProduct : Product = {
          id = product.id;
          name = product.name;
          description = product.description;
          category = product.category;
          price = product.price;
          image = product.image;
          availability = product.availability;
          created = product.created;
          timestamp = Time.now();
          variants = product.variants;
          stock = product.stock;
          isDeleted = true;
        };

        products.add(productId, deletedProduct);
        #success(());
      };
    };
  };

  public query func getProduct(productId : Nat) : async ?Product {
    products.get(productId);
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray().filter(func(p) { not p.isDeleted });
  };

  public query func getProductsByCategory(category : Category) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.category == category and not product.isDeleted;
      }
    );
  };

  func createProductKey() : Nat {
    productKeyIncrement += 1;
    productKeyIncrement.toNat();
  };

  // User management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
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

  // Store settings
  public query func getStoreSettings() : async StoreSettings {
    siteSettings;
  };

  public shared ({ caller }) func updateStoreSettings(settings : StoreSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update store settings");
    };
    siteSettings := settings;
  };

  func getEmailFromIdentifier(identifier : CustomerIdentifier) : Text {
    switch (identifier) {
      case (#email(email)) { email };
      case (#phone(phone)) { phone };
    };
  };

  // Product helpers
  func getCustomerIdentifierFromSession(sessionId : Text) : ?CustomerIdentifier {
    null;
  };

  // Orders
  public shared ({ caller }) func createOrder(sessionId : Text, items : [OrderItem], totalPrice : Float, address : DeliveryAddress) : async {
    #success : Nat;
  } {
    switch (getCustomerIdentifierFromSession(sessionId)) {
      case (null) {
        Runtime.trap("Unauthorized: Invalid or expired session");
      };
      case (?identifier) {
        let orderId = createProductKey();
        let order : OrderType = {
          id = orderId;
          customerIdentifier = identifier;
          items;
          totalPrice;
          status = #pending;
          address;
          createdAt = Time.now();
          updatedAt = Time.now();
        };
        orders.add(orderId, order);
        #success(orderId);
      };
    };
  };

  public query ({ caller }) func getCustomerOrders(sessionId : Text) : async [OrderType] {
    switch (getCustomerIdentifierFromSession(sessionId)) {
      case (null) {
        Runtime.trap("Unauthorized: Invalid or expired session");
      };
      case (?identifier) {
        orders.values().toArray().filter(
          func(order) {
            getEmailFromIdentifier(order.customerIdentifier) == getEmailFromIdentifier(identifier);
          }
        );
      };
    };
  };

  public query ({ caller }) func getAllOrders() : async [OrderType] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) {
        let updatedOrder = {
          id = order.id;
          customerIdentifier = order.customerIdentifier;
          items = order.items;
          totalPrice = order.totalPrice;
          status;
          address = order.address;
          createdAt = order.createdAt;
          updatedAt = Time.now();
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // Customer addresses
  public query func getCustomerAddresses(sessionId : Text) : async [DeliveryAddress] {
    switch (getCustomerIdentifierFromSession(sessionId)) {
      case (null) {
        Runtime.trap("Unauthorized: Invalid or expired session");
      };
      case (?identifier) {
        let email = getEmailFromIdentifier(identifier);
        switch (deliveryAddresses.get(email)) {
          case (null) { [] };
          case (?addresses) { addresses };
        };
      };
    };
  };

  public shared ({ caller }) func saveCustomerAddress(sessionId : Text, address : DeliveryAddress) : async () {
    switch (getCustomerIdentifierFromSession(sessionId)) {
      case (null) {
        Runtime.trap("Unauthorized: Invalid or expired session");
      };
      case (?identifier) {
        let email = getEmailFromIdentifier(identifier);
        let addresses = switch (deliveryAddresses.get(email)) {
          case (null) { [] };
          case (?existing) { existing };
        };
        deliveryAddresses.add(email, addresses.concat([address]));
      };
    };
  };

  public shared ({ caller }) func deleteCustomerAddress(sessionId : Text, addressIndex : Nat) : async () {
    switch (getCustomerIdentifierFromSession(sessionId)) {
      case (null) {
        Runtime.trap("Unauthorized: Invalid or expired session");
      };
      case (?identifier) {
        let email = getEmailFromIdentifier(identifier);
        let addresses = switch (deliveryAddresses.get(email)) {
          case (null) { [] };
          case (?existing) { existing };
        };
        if (addressIndex >= addresses.size()) {
          Runtime.trap("Invalid address index");
        };
        let newAddresses = Array.tabulate(
          addresses.size() - 1,
          func(i) {
            if (i < addressIndex) {
              addresses[i];
            } else {
              addresses[i + 1];
            };
          },
        );
        deliveryAddresses.add(email, newAddresses);
      };
    };
  };

  // Product updates
  public query func getAllProductUpdates() : async [ProductUpdate] {
    updates.values().toArray();
  };

  public query func getProductUpdatesByType(productUpdateType : ProductUpdateType) : async [ProductUpdate] {
    updates.values().toArray().filter(
      func(update) {
        update.productUpdateType == productUpdateType;
      }
    );
  };

  public query func getProductUpdatesByProduct(productId : Nat) : async [ProductUpdate] {
    updates.values().toArray().filter(
      func(update) {
        update.productId == productId;
      }
    );
  };

  public shared ({ caller }) func createProductUpdate(
    productUpdateType : ProductUpdateType,
    productId : Nat,
    message : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create product updates");
    };
    let updateId = createProductKey();
    let update : ProductUpdate = {
      id = updateId;
      productUpdateType;
      productId;
      message;
      timestamp = Time.now();
    };
    updates.add(updateId, update);
    updateId;
  };

  // Logo management
  public query func getLogo() : async ?Logo {
    logo;
  };

  public shared ({ caller }) func setLogo(newLogo : Logo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set logo");
    };
    logo := ?newLogo;
  };

  // Contact form
  public shared ({ caller }) func submitContactForm(name : Text, email : Text, message : Text) : async Nat {
    let contactId = createProductKey();
    let submission : ContactFormSubmission = {
      id = contactId;
      name;
      email;
      message;
      timestamp = Time.now();
    };
    contacts.add(contactId, submission);
    contactId;
  };

  public query ({ caller }) func getAllContactSubmissions() : async [ContactFormSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact submissions");
    };
    contacts.values().toArray();
  };
};
