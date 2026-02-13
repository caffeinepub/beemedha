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
import Char "mo:core/Char";
import Nat32 "mo:core/Nat32";
import Nat8 "mo:core/Nat8";
import Blob "mo:core/Blob";
import Random "mo:core/Random";
import Option "mo:core/Option";

actor {
  // Data types
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

  public type UserProfile = {
    name : Text;
    // Add other user-specific fields as needed
  };

  public type Logo = {
    mimeType : Text;
    data : [Nat8];
  };

  // Admin authentication types
  public type AdminCredentials = {
    username : Text;
    email : Text;
    passwordHash : Text;
  };

  public type AdminSession = {
    sessionId : Text;
    expiresAt : Time.Time;
  };

  // Customer authentication types
  public type CustomerIdentifier = {
    #email : Text;
    #phone : Text;
  };

  public type OTPChallenge = {
    identifier : CustomerIdentifier;
    otpHash : Text;
    expiresAt : Time.Time;
    attempts : Nat;
  };

  public type CustomerSession = {
    sessionId : Text;
    identifier : CustomerIdentifier;
    expiresAt : Time.Time;
  };

  var nextUpdateId = 0;
  var nextContactId = 0;
  var products = Map.empty<Nat, Product>();
  let updates = Map.empty<Nat, ProductUpdate>();
  let contacts = Map.empty<Nat, ContactFormSubmission>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var logo : ?Logo = null;

  // Admin authentication state
  var adminCredentials : ?AdminCredentials = null;
  let adminSessions = Map.empty<Text, AdminSession>();

  // Customer authentication state
  let otpChallenges = Map.empty<Text, OTPChallenge>();
  let customerSessions = Map.empty<Text, CustomerSession>();

  // Session timeout constants (in nanoseconds)
  let ADMIN_SESSION_TIMEOUT : Int = 24 * 60 * 60 * 1_000_000_000; // 24 hours
  let CUSTOMER_SESSION_TIMEOUT : Int = 7 * 24 * 60 * 60 * 1_000_000_000; // 7 days
  let OTP_TIMEOUT : Int = 10 * 60 * 1_000_000_000; // 10 minutes
  let MAX_OTP_ATTEMPTS : Nat = 3;

  // AccessControlState initialization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Initialize admin credentials with hashed password
  func initializeAdminCredentials() {
    if (adminCredentials.isNull()) {
      let passwordHash = hashPassword("78982qwertyuiop");
      adminCredentials := ?{
        username = "Thejas Kinnigoli";
        email = "thejasumeshpoojary7@gmail.com";
        passwordHash = passwordHash;
      };
    };
  };

  // Simple password hashing (for demonstration purposes only)
  func hashPassword(password : Text) : Text {
    var hash : Nat32 = 5381;
    for (char in password.chars()) {
      hash := ((hash << 5) +% hash) +% Nat32.fromNat(char.toNat32().toNat());
    };
    hash.toText();
  };

  // Generate random session ID
  func generateSessionId() : async Text {
    let entropy = await Random.blob();
    let bytes = entropy.toArray();
    var sessionId = "";
    for (byte in bytes.vals()) {
      sessionId #= byte.toText();
    };
    sessionId;
  };

  // Generate random OTP (6 digits)
  func generateOTP() : async Text {
    let entropy = await Random.blob();
    let bytes = entropy.toArray();
    if (bytes.size() == 0) {
      return "123456"; // Fallback
    };
    let num = Nat32.fromNat(bytes[0].toNat()) % 1000000;
    let otp = num.toText();
    // Pad with zeros to ensure 6 digits
    let padding = 6 - otp.size();
    var paddedOtp = "";
    var i = 0;
    while (i < padding) {
      paddedOtp #= "0";
      i += 1;
    };
    paddedOtp # otp;
  };

  // Check if admin session is valid
  func isValidAdminSession(sessionId : Text) : Bool {
    switch (adminSessions.get(sessionId)) {
      case (null) { false };
      case (?session) {
        if (Time.now() > session.expiresAt) {
          adminSessions.remove(sessionId);
          false;
        } else {
          true;
        };
      };
    };
  };

  // Check if customer session is valid
  func isValidCustomerSession(sessionId : Text) : Bool {
    switch (customerSessions.get(sessionId)) {
      case (null) { false };
      case (?session) {
        if (Time.now() > session.expiresAt) {
          customerSessions.remove(sessionId);
          false;
        } else {
          true;
        };
      };
    };
  };

  // Get identifier key for OTP challenges
  func getIdentifierKey(identifier : CustomerIdentifier) : Text {
    switch (identifier) {
      case (#email(e)) { "email:" # e };
      case (#phone(p)) { "phone:" # p };
    };
  };

  // Admin authentication endpoints
  public shared func adminLogin(username : Text, password : Text) : async ?Text {
    initializeAdminCredentials();

    switch (adminCredentials) {
      case (null) { null };
      case (?creds) {
        if (creds.username == username and creds.passwordHash == hashPassword(password)) {
          let sessionId = await generateSessionId();
          let session : AdminSession = {
            sessionId = sessionId;
            expiresAt = Time.now() + ADMIN_SESSION_TIMEOUT;
          };
          adminSessions.add(sessionId, session);
          ?sessionId;
        } else {
          null;
        };
      };
    };
  };

  public shared func adminLogout(sessionId : Text) : async () {
    adminSessions.remove(sessionId);
  };

  public query func validateAdminSession(sessionId : Text) : async Bool {
    isValidAdminSession(sessionId);
  };

  // Customer authentication endpoints
  public shared func customerRequestOTP(identifier : CustomerIdentifier) : async Bool {
    let key = getIdentifierKey(identifier);

    // Check if there's an existing challenge
    switch (otpChallenges.get(key)) {
      case (?existing) {
        // If too many attempts, reject
        if (existing.attempts >= MAX_OTP_ATTEMPTS) {
          return false;
        };
      };
      case (null) {};
    };

    let otp = await generateOTP();
    let otpHash = hashPassword(otp);

    let challenge : OTPChallenge = {
      identifier = identifier;
      otpHash = otpHash;
      expiresAt = Time.now() + OTP_TIMEOUT;
      attempts = 0;
    };

    otpChallenges.add(key, challenge);

    // In production, send OTP via email/SMS
    // For now, we just store it (in real app, don't log/return OTP)
    true;
  };

  public shared func customerVerifyOTP(identifier : CustomerIdentifier, otp : Text) : async ?Text {
    let key = getIdentifierKey(identifier);

    switch (otpChallenges.get(key)) {
      case (null) { null };
      case (?challenge) {
        if (Time.now() > challenge.expiresAt) {
          otpChallenges.remove(key);
          return null;
        };

        if (challenge.attempts >= MAX_OTP_ATTEMPTS) {
          otpChallenges.remove(key);
          return null;
        };

        if (challenge.otpHash == hashPassword(otp)) {
          // OTP is correct, create session
          otpChallenges.remove(key);

          let sessionId = await generateSessionId();
          let session : CustomerSession = {
            sessionId = sessionId;
            identifier = identifier;
            expiresAt = Time.now() + CUSTOMER_SESSION_TIMEOUT;
          };
          customerSessions.add(sessionId, session);
          ?sessionId;
        } else {
          // Increment attempts
          let updatedChallenge = {
            challenge with
            attempts = challenge.attempts + 1;
          };
          otpChallenges.add(key, updatedChallenge);
          null;
        };
      };
    };
  };

  public shared func customerLogout(sessionId : Text) : async () {
    customerSessions.remove(sessionId);
  };

  public query func validateCustomerSession(sessionId : Text) : async Bool {
    isValidCustomerSession(sessionId);
  };

  public query func getCustomerSessionInfo(sessionId : Text) : async ?CustomerIdentifier {
    switch (customerSessions.get(sessionId)) {
      case (null) { null };
      case (?session) {
        if (Time.now() > session.expiresAt) {
          null;
        } else {
          ?session.identifier;
        };
      };
    };
  };

  // Backward compatibility: Principal-based admin management
  public shared ({ caller }) func addAdmin(newAdmin : Principal) : async () {
    AccessControl.assignRole(accessControlState, caller, newAdmin, #admin);
  };

  public shared ({ caller }) func removeAdmin(adminToRemove : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    AccessControl.assignRole(accessControlState, caller, adminToRemove, #user);
  };

  public shared ({ caller }) func promoteToUser(principal : Principal) : async () {
    AccessControl.assignRole(accessControlState, caller, principal, #user);
  };

  // User profile management (requires customer session or Principal-based auth)
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

  // Admin-only operations (require admin session)
  public shared func updateLogo(sessionId : Text, mimeType : Text, data : [Nat8]) : async () {
    if (not isValidAdminSession(sessionId)) {
      Runtime.trap("Unauthorized: Invalid or expired admin session");
    };
    if (mimeType == "" or data.size() == 0) {
      Runtime.trap("Invalid logo data");
    };
    logo := ?{ mimeType; data };
  };

  public query func getLogo() : async ?Logo {
    logo;
  };

  public shared func createProduct(
    sessionId : Text,
    name : Text,
    description : Text,
    category : Category,
    price : Price,
    image : Text,
    availability : AvailabilityStatus,
    variants : ?ProductVariants,
    stock : Nat,
  ) : async Nat {
    if (not isValidAdminSession(sessionId)) {
      Runtime.trap("Unauthorized: Invalid or expired admin session");
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

  public shared func updateProduct(
    sessionId : Text,
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
    if (not isValidAdminSession(sessionId)) {
      Runtime.trap("Unauthorized: Invalid or expired admin session");
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

  public shared func deleteProduct(sessionId : Text, id : Nat) : async () {
    if (not isValidAdminSession(sessionId)) {
      Runtime.trap("Unauthorized: Invalid or expired admin session");
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

  public shared func createProductUpdate(
    sessionId : Text,
    productUpdateType : ProductUpdateType,
    productId : Nat,
    message : Text,
  ) : async Nat {
    if (not isValidAdminSession(sessionId)) {
      Runtime.trap("Unauthorized: Invalid or expired admin session");
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

  public shared func deleteProductUpdate(sessionId : Text, id : Nat) : async () {
    if (not isValidAdminSession(sessionId)) {
      Runtime.trap("Unauthorized: Invalid or expired admin session");
    };

    switch (updates.get(id)) {
      case (null) { Runtime.trap("Product update not found") };
      case (?_) { updates.remove(id) };
    };
  };

  public shared func getContactFormSubmissions(sessionId : Text) : async [ContactFormSubmission] {
    if (not isValidAdminSession(sessionId)) {
      Runtime.trap("Unauthorized: Invalid or expired admin session");
    };
    contacts.values().toArray();
  };

  public shared func seedProducts(sessionId : Text) : async SeedProductsResult {
    if (not isValidAdminSession(sessionId)) {
      Runtime.trap("Unauthorized: Invalid or expired admin session");
    };
    seedProductsInternal();
  };

  // Public endpoints (no authentication required)
  public shared func submitContactForm(name : Text, email : Text, message : Text) : async Nat {
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

  func filterDeletedProducts(isAdmin : Bool, product : Product) : Bool {
    isAdmin or not product.isDeleted;
  };

  public query func getProduct(id : Nat) : async ?Product {
    switch (products.get(id)) {
      case (null) { null };
      case (?product) {
        if (not product.isDeleted) {
          ?product;
        } else {
          null;
        };
      };
    };
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray().filter(
      func(product) {
        not product.isDeleted;
      }
    );
  };

  public query func getProductsByCategory(category : Category) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.category == category and not product.isDeleted;
      }
    );
  };

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

  public query func getLimitedProducts() : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.availability == #limited and not product.isDeleted;
      }
    );
  };

  // Admin endpoints with session parameter for viewing deleted products
  public query func getProductAdmin(sessionId : Text, id : Nat) : async ?Product {
    if (not isValidAdminSession(sessionId)) {
      return null;
    };
    products.get(id);
  };

  public query func getAllProductsAdmin(sessionId : Text) : async [Product] {
    if (not isValidAdminSession(sessionId)) {
      return [];
    };
    products.values().toArray();
  };

  public type SeedProductsResult = {
    #seeded : { count : Nat };
    #alreadySeeded;
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

  // Initialize admin credentials on first deployment
  initializeAdminCredentials();
};
